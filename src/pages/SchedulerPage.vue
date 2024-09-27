<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import { AutoWeb } from '@/tools/AutoWeb';
import type { GroupSchemeName, JobOptions } from '@/tools/declares';
import { onMounted, ref, watch } from 'vue';
import { VideoPlay, More, Plus, Operation } from '@element-plus/icons-vue';
import FixedCollapse from '@/components/FixedCollapse/FixedCollapse.vue';
import FixedCollapseItem from '@/components/FixedCollapse/FixedCollapseItem.vue';
import { getNextByCron } from '@/tools/cron';
import { mergeOffsetTime } from '@/tools/tools';
import { ElMessage } from 'element-plus';

// TODO 新增job（名字、描述）
// TODO 修改job（名字、描述）
// TODO 删除
// DONE job排序
// TODO 列表刷新
// TODO 免打扰模式

type orderByType = 'id' | 'level' | 'nextDate';
const config = ref<{
    orderBy: orderByType, // 排序

}>(JSON.parse(localStorage.getItem('store.Scheduler') || '{}'));
watch(config, (newVal, oldVal) => {
    localStorage.setItem('store.Scheduler', JSON.stringify(newVal));
}, { deep: true });

const scheduleList = ref<JobOptions[]>([]);
const groupSchemeNames = ref<GroupSchemeName[]>();
const maskShown = ref<boolean>(false);
onMounted(async () => {
    await loadData();
    groupSchemeNames.value = await AutoWeb.autoPromise('getGroupSchemeNames');
});

const loadData = async () => {
    const list = await AutoWeb.autoPromise('getScheduleList');
    reSort(list);
    scheduleList.value = list;
}

const intervalInputEvent = ($event: Event, item: JobOptions) => {
    if (item.repeatMode == 3) {
        item.nextDate = getNextByCron(item.interval);
    }
    item.nextDate = mergeOffsetTime(new Date(item.nextDate), item.nextOffset);
}

const switchChangeEvent = async (job: JobOptions) => {
    if (job.checked) {
        if (!job.nextDate) {
            ElMessage.error('下次执行时间不能为空');
            job.checked = false;
            return;
        }
    }
    await AutoWeb.autoPromise('saveScheduleList', scheduleList.value);
    await AutoWeb.autoPromise('scheduleChange', job);
    reSort(scheduleList.value);
}

const orderByBtnClickEvent = () => {
    const map: Record<orderByType, orderByType> = { id: 'level', level: 'nextDate', nextDate: 'id' };
    config.value.orderBy = map[config.value.orderBy || 'id'];
    reSort(scheduleList.value);
}

const reSort = (list: JobOptions[]) => {
    if (config.value.orderBy === 'id' || !config.value.orderBy) {
        list.sort((a, b) => (a.id - b.id));
    } else if (config.value.orderBy === 'level') {
        list.sort((a, b) => {
            if (a.level === b.level) {
                return a.id - b.id;
            }
            return parseInt(b.level) - parseInt(a.level);
        });
    } else if (config.value.orderBy === 'nextDate') {
        list.sort((a, b) => {
            if (a.nextDate && b.nextDate) {
                return new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime();
            } else if (a.nextDate && !b.nextDate) {
                return 1;
            } else if (!a.nextDate && b.nextDate) {
                return -1;
            }
            return 0;
        });
    }
}

const runBtnEvent = () => {
    // TODO
}

const modifyBtnEvent = () => {
    // TODO
}

const deleteConfirmBtnEvent = async (job: JobOptions) => {
    scheduleList.value = scheduleList.value.filter(v => v.name !== job.name);
    await AutoWeb.autoPromise('saveScheduleList', scheduleList.value);
}

</script>
<template>
    <Nav name="定时任务">
        <template #extra>
            <span style="margin-right: 10px;">
                <el-button link>
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </span>
            <span style="margin-right: 10px">
                <el-popover placement="bottom" trigger="click">
                    <template #reference>
                        <el-button link><el-icon>
                                <More />
                            </el-icon></el-button>
                    </template>
                    <template #default>
                        <el-button link size="small" style="width: 100%; justify-content: flex-start;"
                            @click="orderByBtnClickEvent">排序：{{ {
                                id: '默认', level: '优先级', nextDate: '下次执行时间'
                            }[config.orderBy || 'id'] }}</el-button>
                    </template>
                </el-popover>
            </span>
        </template>
    </Nav>
    <div class="container">
        <FixedCollapse :multipart="false">
            <FixedCollapseItem v-for="(item, index) in scheduleList" :name="`${item.id} ${item.name}`">
                <template #header>
                    <div>
                        <div style="margin-bottom: 5px;">
                            <el-text
                                :type="`${Date.now() - new Date(item.nextDate).getTime() > 3 * 60 * 1000 ? 'danger' : ''}`"
                                size="small" style="margin-bottom: 5px; font-weight: bold;">
                                {{ item.id }} {{
                                    item.name }}
                            </el-text>
                        </div>
                        <div><el-text size="small" type="info">{{ item.desc }}</el-text></div>
                        <div><el-text size="small" type="info">上次执行开始时间：{{ item.lastRunTime }}</el-text></div>
                        <div><el-text size="small" type="info">上次执行结束时间：{{ item.lastStopTime }}</el-text></div>
                        <div><el-text size="small" type="info">下次执行时间：{{ item.nextDate }}</el-text></div>
                    </div>
                </template>
                <template #header-icon-left>

                    <div style="display: flex;">
                        <div class="operation-box">
                            <el-popover placement="left" :width="55" :hide-after="0" :auto-close="1000" trigger="click"
                                popper-class="job-item-operation">
                                <template #reference>
                                    <el-button @click.stop="void 0" size="small" link>
                                        <el-icon>
                                            <Operation />
                                        </el-icon>
                                    </el-button>
                                </template>

                                <template #default>
                                    <el-button link size="small" type="success"
                                        @click="runBtnEvent">运行</el-button><br />
                                    <el-button link size="small" type="warning"
                                        @click="modifyBtnEvent">修改</el-button><br />
                                    <el-popconfirm title="确认是否删除" @confirm="deleteConfirmBtnEvent(item)"
                                        confirm-button-text="确认" cancel-button-text="取消">
                                        <template #reference>
                                            <el-button link size="small" type="danger">删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </template>
                            </el-popover>
                        </div>
                        <div class="switch-box"><el-switch v-model="item.checked" @change="switchChangeEvent(item)"
                                @click.stop="void 0" size="small" />
                        </div>
                    </div>
                </template>
                <template #content>
                    <el-form label-position="left" :model="item" label-width="auto" size="small" class="form-container"
                        :disabled="item.checked">
                        <el-form-item label="运行方案" size=small>
                            <el-select size="small" v-model="item.config.scheme" placeholder="请选择方案">
                                <el-option-group v-for="group in groupSchemeNames" :key="group.groupName"
                                    :label="group.groupName">
                                    <el-option v-for="schemeName in group.schemeNames" :key="schemeName"
                                        :label="schemeName" :value="schemeName" />
                                </el-option-group>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="重复模式" size=small>
                            <!-- 0不重复运行，1从开始运行时间计算重复间隔，2从运行结束计算重复间隔，3CRON表达式 -->
                            <el-select size="small" v-model="item.repeatMode" placeholder="请选择重复模式">
                                <el-option label="不重复运行" :value="0" />
                                <el-option label="从开始运行时间计算重复间隔" :value="1" />
                                <el-option label="从运行结束计算重复间隔" :value="2" />
                                <el-option label="CRON表达式" :value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="['重复间隔(分钟)', '重复间隔(分钟)', '重复间隔(分钟)', 'CRON表达式'][item.repeatMode]"
                            size=small>
                            <el-input v-model="item.interval"
                                :type="['number', 'number', 'number', 'string'][item.repeatMode]"
                                @input="intervalInputEvent($event, item)" />
                        </el-form-item>
                        <el-form-item label="下次执行偏移随机数(分钟，用逗号分隔)" size=small>
                            <el-input v-model="item.nextOffset" @change="intervalInputEvent($event, item)" />
                        </el-form-item>
                        <el-form-item label="下次执行时间" size=small>
                            <el-date-picker popper-class="date-time-picker-panel" v-model="item.nextDate"
                                :editable="false" type="datetime" placeholder="选择日期时间" :clearable="false"
                                @focus="maskShown = true" />
                        </el-form-item>
                        <el-form-item label="优先级" size=small>
                            <el-input v-model="item.level" type="number" />
                        </el-form-item>
                    </el-form>
                </template>
            </FixedCollapseItem>
        </FixedCollapse>
        <div v-if="maskShown" class="mask" @click="maskShown = false"></div>
    </div>
</template>
<style scoped>
.mask {
    z-index: 10;
    position: fixed;
    width: 99999px;
    height: 99999px;
    top: 0;
    left: 0;
}

.container {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 46px);
    display: flex;
    background-color: #f4f5f7;
    flex-wrap: wrap;
}

.operation-box {
    /* display: flex; */
    margin-right: 10px;
}

.switch-box {
    display: flex;
    align-items: center;
    height: 24px
}

.form-container {
    width: 100%;
    padding: 5px 10px;

}
</style>
<style>
.fixedCollapseItem-contentInner {
    background-color: #fff;
}

.el-form-item--small {
    margin-bottom: 6px;
}

.el-select-dropdown__wrap {
    max-height: 200px;
}

.el-select-group__title {
    padding-left: 15px;
}

.el-select-dropdown__item {
    color: #606266;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    padding-left: 15px;
}

.el-input__wrapper,
.el-select__wrapper {
    background-color: initial !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    border-bottom: 1px solid var(--el-border-color) !important;
}

.el-input__wrapper:hover,
.el-input__wrapper.is-focus,
.el-select__wrapper.is-hovering,
.el-select__wrapper.is-focused {
    box-shadow: none !important;
    border-bottom: 1px solid var(--el-color-primary) !important;
}


.el-date-editor.el-input {
    width: 100%;
}

.el-date-editor.el-input .el-input__prefix {
    display: none;
}

.date-time-picker-panel.el-popper.is-pure {
    top: calc(50% - 212px) !important;
    left: calc(50% - 161px) !important;
}

.el-popper[data-popper-placement^=bottom]>.el-popper__arrow {
    display: none;
}

.el-popover.el-popper.job-item-operation {
    min-width: initial;
}
</style>
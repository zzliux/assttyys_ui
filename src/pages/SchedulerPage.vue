<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import { AutoWeb } from '@/tools/AutoWeb';
import type { GroupSchemeName, JobOptions } from '@/tools/declares';
import { onMounted, ref, watch, computed } from 'vue';
import { Plus, Operation, Refresh, Delete, More, Loading } from '@element-plus/icons-vue';
import FixedCollapse from '@/components/FixedCollapse/FixedCollapse.vue';
import FixedCollapseItem from '@/components/FixedCollapse/FixedCollapseItem.vue';
import { getNextByCron } from '@/tools/cron';
import { bueatifyTime, mergeOffsetTime, toStdFormatDateStr } from '@/tools/tools';
import { ElMessage } from 'element-plus';
import ScheduleJobEditDialog, { type editType, type onConfirmOption } from '@/components/ScheduleJobEditDialog';

type orderByType = 'id' | 'level' | 'nextDate';
const config = ref<{ orderBy: orderByType }>(JSON.parse(localStorage.getItem('store.Scheduler') || '{}'));
watch(config, (newVal, oldVal) => {
    localStorage.setItem('store.Scheduler', JSON.stringify(newVal));
}, { deep: true });

const scheduleList = ref<JobOptions[]>([]);
const groupSchemeNames = ref<GroupSchemeName[]>();
const maskShown = ref<boolean>(false);
const scheduleJobEditDialogShown = ref<boolean>(false);
const editJob = ref<JobOptions>(null);
const editJobType = ref<editType>(null);
const lazyMode = ref<boolean>(false);
const collapseVal = ref<string>('');

const SCHEDULE_CONFIGS_KEY = 'store.ScheduleConfigs';
const SCHEDULE_SELECTED_CONFIG_KEY = 'store.ScheduleSelectedConfig';
const DEFAULT_CONFIG_NAME = '默认配置';
const scheduleConfigs = ref<Record<string, JobOptions[]>>({});
const selectedConfigName = ref<string>('');
const isLoadingConfig = ref<boolean>(true);
const saveConfigDialogVisible = ref<boolean>(false);
const newConfigName = ref<string>('');

const loadScheduleConfigs = async () => {
    // 从后端获取配置名称列表
    const names = await AutoWeb.autoPromise('getScheduleConfigNames');
    scheduleConfigs.value = {};
    for (const name of names) {
        scheduleConfigs.value[name] = []; // 占位，实际数据在 loadConfig 时填充
    }
    selectedConfigName.value = localStorage.getItem(SCHEDULE_SELECTED_CONFIG_KEY) || '';
    isLoadingConfig.value = false;
};

const createEmptyConfig = async () => {
    if (!newConfigName.value.trim()) {
        ElMessage.error('配置名称不能为空');
        return;
    }
    const name = newConfigName.value.trim();
    if (scheduleConfigs.value[name]) {
        ElMessage.error('配置名称已存在');
        return;
    }
    // 基于默认配置（内置方案）创建
    const defaultJobs = scheduleConfigs.value[DEFAULT_CONFIG_NAME] || [];
    const jobs = JSON.parse(JSON.stringify(defaultJobs));
    const result = await AutoWeb.autoPromise('saveScheduleConfig', { name, jobs });
    if (result.error !== 0) {
        ElMessage.error(result.message || '创建失败');
        return;
    }
    scheduleConfigs.value[name] = jobs;
    selectedConfigName.value = name;
    scheduleList.value = jobs;
    localStorage.setItem(SCHEDULE_SELECTED_CONFIG_KEY, name);
    saveConfigDialogVisible.value = false;
    newConfigName.value = '';
    ElMessage.success('配置创建成功');
};

const copyCurrentConfig = async () => {
    if (!newConfigName.value.trim()) {
        ElMessage.error('配置名称不能为空');
        return;
    }
    const name = newConfigName.value.trim();
    if (scheduleConfigs.value[name]) {
        ElMessage.error('配置名称已存在');
        return;
    }
    // 复制当前配置
    const jobs = JSON.parse(JSON.stringify(scheduleList.value));
    const result = await AutoWeb.autoPromise('saveScheduleConfig', { name, jobs });
    if (result.error !== 0) {
        ElMessage.error(result.message || '复制失败');
        return;
    }
    scheduleConfigs.value[name] = jobs;
    selectedConfigName.value = name;
    saveConfigDialogVisible.value = false;
    newConfigName.value = '';
    ElMessage.success('配置复制成功');
};

const loadConfig = async (name: string) => {
    if (!scheduleConfigs.value[name]) return;
    // 调用后端接口加载配置（会清空调度器并重新设置任务）
    const result = await AutoWeb.autoPromise('loadScheduleConfig', name);
    if (result.error !== 0) {
        ElMessage.error(result.message || '加载配置失败');
        return;
    }
    // 更新前端状态
    scheduleList.value = result.data || [];
    selectedConfigName.value = name;
    localStorage.setItem(SCHEDULE_SELECTED_CONFIG_KEY, name);
    ElMessage.success('配置加载成功');
};

const deleteConfig = async (name: string) => {
    if (name === DEFAULT_CONFIG_NAME) return ElMessage.error('默认配置不可删除');
    const result = await AutoWeb.autoPromise('deleteScheduleConfig', name);
    if (result.error !== 0) {
        ElMessage.error(result.message || '删除失败');
        return;
    }
    delete scheduleConfigs.value[name];
    if (selectedConfigName.value === name) {
        // 自动切换到默认配置
        if (scheduleConfigs.value[DEFAULT_CONFIG_NAME]) {
            await loadConfig(DEFAULT_CONFIG_NAME);
        } else {
            selectedConfigName.value = '';
            localStorage.removeItem(SCHEDULE_SELECTED_CONFIG_KEY);
        }
    }
    ElMessage.success('配置删除成功');
};

const persistCurrentConfig = async () => {
    await AutoWeb.autoPromise('saveScheduleList', scheduleList.value);
    // 如果有关联的配置名称，同步更新该配置
    if (selectedConfigName.value) {
        scheduleConfigs.value[selectedConfigName.value] = JSON.parse(JSON.stringify(scheduleList.value));
        await AutoWeb.autoPromise('saveScheduleConfig', {
            name: selectedConfigName.value,
            jobs: scheduleList.value
        });
    }
};

const sortedConfigNames = computed(() => {
    const names = Object.keys(scheduleConfigs.value);
    const defaultIndex = names.indexOf(DEFAULT_CONFIG_NAME);
    if (defaultIndex > 0) {
        names.splice(defaultIndex, 1);
        names.unshift(DEFAULT_CONFIG_NAME);
    }
    return names;
});

onMounted(async () => {
    await loadScheduleConfigs();
    const savedConfigName = localStorage.getItem(SCHEDULE_SELECTED_CONFIG_KEY);
    if (savedConfigName && scheduleConfigs.value[savedConfigName]) {
        // 如果有之前选中的配置，加载该配置
        await loadConfig(savedConfigName);
    } else {
        // 否则加载后端当前激活的调度列表（兼容旧逻辑）
        await loadData();
    }
    groupSchemeNames.value = await AutoWeb.autoPromise('getGroupSchemeNames');
    lazyMode.value = await AutoWeb.autoPromise('getScheduleLazyMode');
    window.loadScheduleData = loadData;
});

const loadData = async () => {
    const list = await AutoWeb.autoPromise('getScheduleList');
    reSort(list);
    scheduleList.value = list;
};

const reSort = (list: JobOptions[]) => {
    const orderBy = config.value.orderBy || 'id';
    if (orderBy === 'id') {
        list.sort((a, b) => a.id - b.id);
    } else if (orderBy === 'level') {
        list.sort((a, b) => (a.level === b.level ? a.id - b.id : parseInt(b.level) - parseInt(a.level)));
    } else if (orderBy === 'nextDate') {
        list.sort((a, b) => {
            if (a.checked !== b.checked) return a.checked ? -1 : 1;
            if (a.nextDate && b.nextDate) return new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime();
            return a.nextDate ? -1 : b.nextDate ? 1 : 0;
        });
    }
};

const orderByBtnClickEvent = () => {
    const map: Record<orderByType, orderByType> = { id: 'level', level: 'nextDate', nextDate: 'id' };
    config.value.orderBy = map[config.value.orderBy || 'id'];
    reSort(scheduleList.value);
};

const switchChangeEvent = async (job: JobOptions) => {
    if (job.checked) {
        if (!await AutoWeb.autoPromise('getScheme', job.config.scheme)) {
            ElMessage.error('关联方案不存在，请先关联方案');
            job.checked = false;
            return;
        }
        if (!job.repeatMode && job.repeatMode !== 0) {
            ElMessage.error('重复模式不能为空');
            job.checked = false;
            return;
        }
        if (!job.nextDate) {
            ElMessage.error('下次执行时间不能为空');
            job.checked = false;
            return;
        }
        if (!job.level) {
            ElMessage.error('请设置优先级');
            job.checked = false;
            return;
        }
        // cron 模式下自动计算下次执行时间
        if (job.repeatMode == 3 && job.interval) {
            job.nextDate = getNextByCron(job.interval);
        }
    }
    await persistCurrentConfig();
    await AutoWeb.autoPromise('scheduleChange', job);
    reSort(scheduleList.value);
};

const intervalInputEvent = ($event: Event, item: JobOptions) => {
    if (item.repeatMode == 3) {
        item.nextDate = getNextByCron(item.interval);
    }
    item.nextDate = mergeOffsetTime(new Date(item.nextDate), item.nextOffset);
};

const addBtnEvent = () => {
    editJobType.value = 'add';
    editJob.value = {
        name: '',
        desc: '',
        checked: false,
        repeatMode: null,
        interval: null,
        nextDate: null,
        level: '10',
        config: {
            scheme: ''
        },
    };
    scheduleJobEditDialogShown.value = true;
};

const refreshBtnEvent = async () => {
    if (selectedConfigName.value) {
        // 如果有选中的配置，重新加载该配置
        await loadConfig(selectedConfigName.value);
    } else {
        // 如果没有选中配置，从后端获取当前激活的配置列表
        await loadData();
    }
};

const runBtnEvent = async (job: JobOptions) => {
    if (!job.checked) {
        ElMessage.error('请先启用任务');
        return;
    }
    job.nextDate = new Date();
    await persistCurrentConfig();
    await AutoWeb.autoPromise('scheduleChange', job);
};

const modifyBtnEvent = (job: JobOptions) => {
    editJob.value = job;
    editJobType.value = 'modify';
    scheduleJobEditDialogShown.value = true;
};

const deleteConfirmBtnEvent = async (job: JobOptions) => {
    const result: JobOptions[] = [];
    for (const v of scheduleList.value) {
        if (v.name !== job.name) result.push(v);
    }
    scheduleList.value = result;
    await persistCurrentConfig();
};

const jobEditConfirmEvent = async (option: onConfirmOption) => {
    if (option.type === 'add') {
        const j = scheduleList.value.find(v => v.name === option.newScheduleJob.name);
        if (j) {
            ElMessage.error('任务名已存在，请修改任务名');
            return false;
        }
        option.newScheduleJob.id = scheduleList.value.reduce((p, c) => Math.max(p, c.id), 0) + 1;
        scheduleList.value.push(option.newScheduleJob);
        reSort(scheduleList.value);
        await persistCurrentConfig();
        collapseVal.value = `${option.newScheduleJob.id} ${option.newScheduleJob.name}`;
        return true;
    } else if (option.type === 'modify') {
        let count = 0;
        for (const v of scheduleList.value) {
            if (v.name === option.oldScheduleJob.name) count++;
        }
        if (count > 1) {
            ElMessage.error('任务名已存在，请修改任务名');
            return false;
        }
        const index = scheduleList.value.findIndex(v => v.name === option.oldScheduleJob.name);
        scheduleList.value[index] = option.newScheduleJob;
        reSort(scheduleList.value);
        await persistCurrentConfig();
        return true;
    }
    return true;
};

const lazyModeBtnClickEvent = async () => {
    lazyMode.value = !lazyMode.value;
    await AutoWeb.autoPromise('setScheduleLazyMode', lazyMode.value);
};
</script>

<template>
    <Nav name="定时任务">
        <template #extra>
            <!-- 配置管理下拉框 -->
            <span style="margin-right: 10px;">
                <el-dropdown trigger="click">
                    <el-button link>
                        <el-icon v-if="isLoadingConfig" class="is-loading">
                            <Loading />
                        </el-icon>
                        <el-text v-else style="padding-top: 2px;">{{ selectedConfigName || '默认配置' }}</el-text>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="name in sortedConfigNames" :key="name" @click="loadConfig(name)">
                                <div
                                    style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                    <span :style="{ color: name === selectedConfigName ? '#409eff' : '#303133' }">
                                        {{ name }} <el-text v-if="name === DEFAULT_CONFIG_NAME" type="info"></el-text>
                                    </span>
                                    <el-popconfirm v-if="name !== DEFAULT_CONFIG_NAME" title="确认是否删除"
                                        @confirm="deleteConfig(name)" confirm-button-text="确认" cancel-button-text="取消"
                                        placement="bottom-end" teleported>
                                        <template #reference>
                                            <el-icon @click.stop="void 0" style="margin-left: 10px; color: #f56c6c;">
                                                <Delete />
                                            </el-icon>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item divided @click="saveConfigDialogVisible = true">
                                <div style="display: flex; align-items: center;">
                                    <el-icon style="margin-right: 5px;">
                                        <Plus />
                                    </el-icon>
                                    新增配置
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </span>
            <span style="margin-right: 10px; display: inline-flex; align-items: center;">
                <el-button link @click="refreshBtnEvent">
                    <el-icon>
                        <Refresh />
                    </el-icon>
                </el-button>
            </span>
            <span style="margin-right: 10px; display: inline-flex; align-items: center;">
                <el-button link @click="addBtnEvent">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </span>
            <span style="margin-right: 10px; display: inline-flex; align-items: center;">
                <el-popover placement="bottom" trigger="click">
                    <template #reference>
                        <el-button link><el-icon>
                                <More />
                            </el-icon></el-button>
                    </template>
                    <template #default>
                        <div style="display: block;">
                            <el-button link size="small" style="width: 100%; justify-content: flex-start;"
                                @click="orderByBtnClickEvent">排序：{{ {
                                    id: '默认', level: '优先级', nextDate: '下次执行时间'
                                }[config.orderBy || 'id'] }}</el-button>
                        </div>
                        <div style="display: block;">
                            <el-button link size="small" style="width: 100%; justify-content: flex-start;"
                                @click="lazyModeBtnClickEvent">免打扰模式：{{ lazyMode ? '开启' : '关闭' }}</el-button>
                        </div>
                    </template>
                </el-popover>
            </span>
        </template>
    </Nav>
    <!-- 新增配置对话框 -->
    <el-dialog v-model="saveConfigDialogVisible" title="新增配置" width="320px">
        <el-input v-model="newConfigName" placeholder="请输入配置名称" />
        <template #footer>
            <el-button @click="saveConfigDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createEmptyConfig">全新创建</el-button>
            <el-button type="success" @click="copyCurrentConfig">复制当前配置</el-button>
        </template>
    </el-dialog>

    <div class="container">
        <FixedCollapse v-model="collapseVal" :multipart="false">
            <FixedCollapseItem v-for="(item, index) in scheduleList" :key="index" :name="`${item.id} ${item.name}`">
                <template #header>
                    <div>
                        <div style="margin-bottom: 5px;">
                            <el-text
                                :type="`${Date.now() - new Date(item.nextDate).getTime() > 3 * 60 * 1000 ? 'danger' : ''}`"
                                size="small" style="margin-bottom: 5px; font-weight: bold;">
                                {{ item.id }} {{ item.name }}
                            </el-text>
                        </div>
                        <div><el-text size="small" type="info">{{ item.desc }}</el-text></div>
                        <div class="times-region">
                            <div class="times-item" v-if="item.lastRunTime"><el-text size="small"
                                    type="info">上次执行开始时间：{{ toStdFormatDateStr(item.lastRunTime)
                                    }}</el-text></div>
                            <div class="times-item" v-if="item.lastStopTime"><el-text size="small"
                                    type="info">上次执行结束时间：{{ toStdFormatDateStr(item.lastStopTime)
                                    }}</el-text></div>
                            <div class="times-item" v-if="item.nextDate"><el-text size="small" type="info">下次执行时间：{{
                                toStdFormatDateStr(item.nextDate) }}({{
                                        bueatifyTime(item.nextDate) }})</el-text>
                            </div>
                        </div>
                    </div>
                </template>
                <template #header-icon-left>
                    <div style="display: flex;">
                        <div class="operation-box">
                            <el-popover placement="left" :width=80 :hide-after="0" :auto-close="2000" trigger="click"
                                popper-class="job-item-operation">
                                <template #reference>
                                    <el-button @click.stop="void 0" size="small" link
                                        style="font-size: 14px; color: #909399;">
                                        <el-icon>
                                            <Operation />
                                        </el-icon>
                                    </el-button>
                                </template>

                                <template #default>
                                    <el-button link size="small" type="success"
                                        @click="runBtnEvent(item)">立即执行</el-button><br />
                                    <el-button link size="small" type="warning"
                                        @click="modifyBtnEvent(item)">修　　改</el-button><br />
                                    <el-popconfirm title="确认是否删除" @confirm="deleteConfirmBtnEvent(item)"
                                        confirm-button-text="确认" cancel-button-text="取消">
                                        <template #reference>
                                            <el-button link size="small" type="danger">删　　除</el-button>
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
                        <el-form-item :label="['重复间隔(分钟)', '重复间隔(分钟)', '重复间隔(分钟)', 'CRON表达式'][item.repeatMode || 0]"
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
                                @visible-change="(visibility: boolean) => maskShown = visibility" />
                        </el-form-item>
                        <el-form-item label="优先级" size=small>
                            <el-input v-model="item.level" type="number" />
                        </el-form-item>
                    </el-form>
                </template>
            </FixedCollapseItem>
        </FixedCollapse>
        <div v-if="maskShown" class="mask" @click="maskShown = false"></div>
        <ScheduleJobEditDialog v-if="scheduleJobEditDialogShown" v-model="scheduleJobEditDialogShown" :job="editJob"
            :onConfirm="jobEditConfirmEvent" :type="editJobType" />
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
.times-region {
    display: flex;
    flex-wrap: wrap
}
.times-item {
    display: flex;
    margin-right: 20px;
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

.el-popper>.el-popper__arrow {
    display: none;
}

.el-popover.el-popper.job-item-operation {
    min-width: initial;
}
</style>
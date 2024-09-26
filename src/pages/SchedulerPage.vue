<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import { AutoWeb } from '@/tools/AutoWeb';
import type { GroupSchemeName, JobOptions } from '@/tools/declares';
import { onMounted, ref } from 'vue';
import ItemCard from '@/components/ItemCard.vue';
import { VideoPlay } from '@element-plus/icons-vue';
import FixedCollapse from '@/components/FixedCollapse/FixedCollapse.vue';
import FixedCollapseItem from '@/components/FixedCollapse/FixedCollapseItem.vue';

const scheduleList = ref<JobOptions[]>([]);
const groupSchemeNames = ref<GroupSchemeName[]>();
const maskShown = ref<boolean>(false);
onMounted(async () => {
    scheduleList.value = await AutoWeb.autoPromise('getScheduleList');
    groupSchemeNames.value = await AutoWeb.autoPromise('getGroupSchemeNames');
});

</script>
<template>
    <Nav name="定时任务" />
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
                        <div @click.stop="void 0" class="play-icon-box">
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                        </div>
                        <div class="switch-box"><el-switch v-model="item.checked" @click.stop="void 0" size="small" />
                        </div>
                    </div>
                </template>
                <template #content>
                    <el-form label-position="left" :model="item" label-width="auto" size="small" class="form-container">
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
                        <el-form-item label="重复间隔(分钟)" size=small>
                            <el-input v-model="item.interval"
                                :type="['number', 'number', 'number', 'string'][item.repeatMode]" />
                        </el-form-item>
                        <el-form-item label="下次执行偏移随机数(分钟，用逗号分隔)" size=small>
                            <el-input v-model="item.nextOffset" />
                        </el-form-item>
                        <el-form-item label="下次执行时间" size=small>
                            <el-date-picker popper-class="date-time-picker-panel" v-model="item.nextDate"
                                type="datetime" placeholder="选择日期时间" :clearable="false" @focus="maskShown = true" />
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

.play-icon-box {
    display: flex;
    align-items: center;
    height: 24px;
    margin-right: 10px;
    font-size: 16px;
    color: #909399
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
</style>
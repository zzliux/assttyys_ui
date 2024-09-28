<script setup lang="ts">
import type { JobOptions } from '@/tools/declares';
import type { editType, onConfirmOption } from '.';
import { onMounted, ref } from 'vue';
import { deepClone } from '@/tools/tools';

const $props = defineProps<{
    job: JobOptions,
    onConfirm: (option: onConfirmOption) => Promise<boolean> | boolean,
    type: editType,
}>();

const model = defineModel<boolean>();
const dataJob = ref<JobOptions>();

const editTypeToTitle = (type: editType) => {
    switch (type) {
        case 'modify':
            return '修改定时任务：';
        case 'add':
            return '新增定时任务';
    }
}

onMounted(() => {
    dataJob.value = deepClone($props.job);
});

const confirmBtnEvent = async () => {
    model.value = !await $props.onConfirm({
        oldScheduleJob: $props.job,
        newScheduleJob: dataJob.value,
        type: $props.type
    });
}



</script>
<template>
    <el-dialog v-model="model" :width="480" :close-on-click-modal="false">
        <template #header>
            <el-text>{{ editTypeToTitle($props.type) }}{{ $props.job.name }}</el-text>
        </template>
        <template #default>
            <el-form class="schedulejob-edit-dialog-form" size="small" :model="dataJob">
                <el-form-item label="定时任务名" :label-width="88">
                    <el-input v-model="dataJob.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="定时任务描述" :label-width="88">
                    <el-input v-model="dataJob.desc" autocomplete="off" />
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="small" @click="model = false">取消</el-button>
                <el-button size="small" type="primary" @click="confirmBtnEvent">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped></style>
<style>
.el-dialog__header {
    padding-bottom: 10px;
}
.schedulejob-edit-dialog-form .el-form-item--small {
    margin-bottom: 10px;
}
.el-dialog__footer {
    padding-top: 0px;
}
.el-option-item {
    color: #606266;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    padding-left: 15px;
}
@media screen and (max-width: 480px) {
    .el-dialog {
        width: calc(100% - 2px) !important;
    }
}
</style>
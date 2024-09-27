<script setup lang="ts">
import type { Scheme } from '@/tools/declares';
import { computed, onMounted, ref } from 'vue';
import type { editType, onConfirmCallback } from '.';
import { AutoWeb } from '@/tools/AutoWeb';
import { deepClone } from '@/tools/tools';
const $props = defineProps<{
    scheme: Scheme,
    type: editType
    onConfirm: onConfirmCallback
}>();
const dataScheme = ref<Scheme>();
const groupNames = ref<string[]>([]);

onMounted(async () => {
    dataScheme.value = deepClone($props.scheme);
});

const groupSelectPanelVisibleChange = async (visible: boolean) => {
    if (!visible) return;
    if (groupNames.value.length) return;
    groupNames.value = await AutoWeb.autoPromise('getGroupNames');
}

const model = defineModel<boolean>(); // 是否显示
const confirmBtnEvent = async () => {
    dataScheme.value.inner = false;
    model.value = !await $props.onConfirm({
        oldScheme: $props.scheme,
        newScheme: dataScheme.value,
        type: $props.type
    });
}

const innerSchemeList = ref<Scheme[]>([]);
const innserScheme = ref<Scheme>(null);
const innerSchemeName = computed({
    get() {
        return innserScheme.value?.schemeName;
    },
    set(val) {
        innserScheme.value = innerSchemeList.value.find(item => item.schemeName === val);
        dataScheme.value = deepClone({ ...dataScheme.value, ...innserScheme.value });
    }
})
const innerSchemeSelectPanelVisibleChange = async (visible: boolean) => {
    if (!visible) return;
    if (innerSchemeList.value.length) return;
    innerSchemeList.value = await AutoWeb.autoPromise('getDefaultSchemeList');
}

const editTypeToTitle = (type: editType) => {
    switch (type) {
        case 'copy':
            return '复制方案：';
        case 'modify':
            return '修改方案：';
        case 'add':
            return '新增方案';
    }
}
</script>
<template>
    <el-dialog v-model="model" :width="480" :close-on-click-modal="false">
        <template #header>
            <el-text>{{ editTypeToTitle($props.type) }}{{ $props.scheme.schemeName }}</el-text>
        </template>
        <template #default>
            <el-form class="scheme-edit-dialog-form" size="small" :model="dataScheme">
                <el-form-item label="方案名" :label-width="60">
                    <el-input v-model="dataScheme.schemeName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="分组名" :label-width="60">
                    <el-select v-model="dataScheme.groupNames" @visible-change="groupSelectPanelVisibleChange"
                        placeholder="输入或选择分组名" allow-create filterable clearable multiple
                        popper-class="scheme-edit-select-panel">
                        <el-option class="el-option-item" v-for="(item, _index) in groupNames" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="$props.type === 'add'" label="内置方案" :label-width="60">
                    <el-select v-model="innerSchemeName" @visible-change="innerSchemeSelectPanelVisibleChange"
                        placeholder="请选择需要复制的内置方案（可选）" filterable popper-class="scheme-edit-select-panel">
                        <el-option class="el-option-item" v-for="(item, _index) in innerSchemeList" :label="item.schemeName"
                            :value="item.schemeName" />
                    </el-select>
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


<style>
.scheme-edit-select-panel .el-scrollbar__wrap {
    max-height: initial;
}

.scheme-edit-select-panel .el-select-dropdown__wrap {
    max-height: initial;
}

.el-select-dropdown.scheme-edit-select-panel {
    max-height: 150px;
    overflow: auto;
}
.el-dialog__header {
    padding-bottom: 10px;
}
.scheme-edit-dialog-form .el-form-item--small {
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
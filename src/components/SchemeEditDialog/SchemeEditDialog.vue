<script setup lang="ts">
import type { Scheme } from '@/tools/declares';
import { onMounted, ref } from 'vue';
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
    groupNames.value = await AutoWeb.autoPromise('getGroupNames');
})
const model = defineModel<boolean>(); // 是否显示
const confirmBtnEvent = async () => {
    dataScheme.value.inner = false;
    model.value = !await $props.onConfirm({
        oldScheme: $props.scheme,
        newScheme: dataScheme.value,
        type: $props.type
    });
}

const editTypeToTitle = (type: editType) => {
    switch (type) {
        case 'copy':
            return '复制方案';
        case 'modify':
            return '修改方案';
        case 'add':
            return '新增方案';
    }
}
</script>
<template>
    <el-dialog v-model="model" :title="`${editTypeToTitle($props.type)}：${$props.scheme.schemeName}`" :width="480">
        <template #default>
            <el-form :model="dataScheme">
                <el-form-item label="方案名" :label-width="80">
                    <el-input v-model="dataScheme.schemeName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="分组名" :label-width="80">
                    <el-select v-model="dataScheme.groupName" placeholder="输入或选择分组名" allow-create filterable clearable>
                        <el-option v-for="(item, _index) in groupNames" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="model = false">取消</el-button>
                <el-button type="primary" @click="confirmBtnEvent">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
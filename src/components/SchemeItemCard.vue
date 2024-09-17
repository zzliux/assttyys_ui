<script setup lang="ts">
import type { Scheme } from '@/tools/declares';
import ItemCard from './ItemCard.vue';
import { Operation } from '@element-plus/icons-vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { AutoWeb } from '@/tools/AutoWeb';
import { ref } from 'vue';
import SchemeEditDialog, { type onConfirmOption } from './SchemeEditDialog';
import { ElMessage } from 'element-plus'

const $props = defineProps<{
    scheme: Scheme
}>();

// 置顶
const toTop = async () => {
    await AutoWeb.autoPromise('topScheme', $props.scheme);
    globalEmmiter.emit('Event.SchemeItemCard.Operation', {
        type: 'toTop',
        targetScheme: $props.scheme,
        newScheme: $props.scheme,
    });
}


const schemeEidtDialogVisiable = ref<boolean>(false);
const schemeEditType = ref<'copy' | 'modify' | 'add'>();
// 复制
const copyBtnEvent = async () => {
    schemeEditType.value = 'copy';
    schemeEidtDialogVisiable.value = true;
}

// 修改
const modifyBtnEvent = async () => {
    schemeEditType.value = 'modify';
    schemeEidtDialogVisiable.value = true;
}

const editDialogSaveEvent = async (option: onConfirmOption) => {
    const { type, oldScheme, newScheme } = option;
    const saveResult = await AutoWeb.autoPromise('saveScheme', {
        oldScheme, newScheme, type
    });
    if (saveResult.error) {
        ElMessage({
            type: 'error',
            message: saveResult.message,
            plain: true,
        })
        return false;
    }
    globalEmmiter.emit('Event.SchemeItemCard.Operation', {
        type: type as 'copy' | 'modify',
        targetScheme: oldScheme,
        newScheme: newScheme,
    });
    return true;
}

// 删除
const remove = async () => {
    await AutoWeb.autoPromise('removeScheme', $props.scheme);
    globalEmmiter.emit('Event.SchemeItemCard.Operation', {
        type: 'remove',
        targetScheme: $props.scheme,
    });
}

</script>

<template>
    <ItemCard>
        <div class="item-title">
            <el-text>{{ $props.scheme.schemeName }}</el-text>
        </div>
        <div class="item-operation">
            <el-popover placement="left" :width="55" trigger="click" popper-class="scheme-item-operation">
                <template #reference>
                    <el-link>
                        <el-icon>
                            <Operation />
                        </el-icon>
                    </el-link>
                </template>
                <template #default>
                    <el-link type="primary" @click="toTop">置顶</el-link><br />
                    <el-link type="success" @click="copyBtnEvent">复制</el-link><br />
                    <el-link type="warning" @click="modifyBtnEvent">修改</el-link><br />
                    <el-popconfirm title="确认是否删除" @confirm="remove" confirm-button-text="确认" cancel-button-text="取消">
                        <template #reference>
                            <el-link type="danger">删除</el-link>
                        </template>
                    </el-popconfirm>
                </template>
            </el-popover>
        </div>
    </ItemCard>
    <SchemeEditDialog v-if="schemeEidtDialogVisiable" v-model="schemeEidtDialogVisiable" :scheme="$props.scheme"
        :type="schemeEditType" @confirm="editDialogSaveEvent" />
</template>

<style scoped>
.item-title,
.item-operation {
    display: flex;
}
</style>

<style>
.el-popover.el-popper.scheme-item-operation {
    min-width: initial;
}
</style>
<script setup lang="ts">
import type { Scheme } from '@/tools/declares';
import ItemCard from './ItemCard.vue';
import { Operation } from '@element-plus/icons-vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { AutoWeb } from '@/tools/AutoWeb';
import { ref } from 'vue';
import SchemeEditDialog, { type onConfirmOption } from './SchemeEditDialog';
import { ElMessage } from 'element-plus'
import { deepClone } from '@/tools/tools';

const $props = defineProps<{
    scheme: Scheme,
    groupName: string,
}>();

// 置顶
const toTop = async () => {
    const groupSchemeNames = await AutoWeb.autoPromise('getGroupSchemeNames');
    for (let groupSchemeName of groupSchemeNames) {
        if (groupSchemeName.groupName === $props.groupName) {
            groupSchemeName.schemeNames.splice(groupSchemeName.schemeNames.indexOf($props.scheme.schemeName), 1);
            groupSchemeName.schemeNames.unshift($props.scheme.schemeName);
            break;
        }
    }
    await AutoWeb.autoPromise('saveGroupSchemeNames', groupSchemeNames);
    globalEmmiter.emit('Event.SchemeItemCard.Operation', {
        type: 'reSort',
        targetScheme: $props.scheme,
        groupSchemeNames: groupSchemeNames,
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

// 删除，删除有点特别，仅删除分组与方案的关联，不删除方案，直到这个方案只有一个分组为止
const deleteConfirmBtnEvent = async () => {
    if ($props.scheme.groupNames?.length === 1 && $props.scheme.groupNames[0] === $props.groupName) {
        await AutoWeb.autoPromise('removeScheme', $props.scheme);
    } else {
        // const groupSchemeNames = await AutoWeb.autoPromise('getGroupSchemeNames');
        // groupSchemeNames.find(groupSchemeName => {
        //     if (groupSchemeName.groupName === $props.groupName) {
        //         groupSchemeName.schemeNames.splice(groupSchemeName.schemeNames.indexOf($props.scheme.schemeName), 1);
        //         return true;
        //     }
        // });
        const scheme = deepClone($props.scheme);
        scheme.groupNames = scheme.groupNames?.filter(groupName => groupName !== $props.groupName);
        await AutoWeb.autoPromise('saveScheme', { oldScheme: $props.scheme, newScheme: scheme, type: 'modify' });
    }
    globalEmmiter.emit('Event.SchemeItemCard.Operation', {
        type: 'remove',
        targetScheme: $props.scheme,
    });
}
</script>

<template>
    <ItemCard>
        <div class="item-title">
            <el-text size="small">{{ $props.scheme.schemeName }}</el-text>
        </div>
        <div class="item-operation">
            <slot name="operation-left"></slot>
            <el-popover placement="left" :width="55" :hide-after="0" :auto-close="1000" trigger="click" popper-class="scheme-item-operation">
                <template #reference>
                    <el-button size="small" link>
                        <el-icon>
                            <Operation />
                        </el-icon>
                    </el-button>
                </template>
                <template #default>
                    <el-button link size="small" type="primary" @click="toTop">置顶</el-button><br />
                    <el-button link size="small" type="success" @click="copyBtnEvent">复制</el-button><br />
                    <el-button link size="small" type="warning" @click="modifyBtnEvent">修改</el-button><br />
                    <el-popconfirm title="确认是否删除" @confirm="deleteConfirmBtnEvent" confirm-button-text="确认"
                        cancel-button-text="取消">
                        <template #reference>
                            <el-button link size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-popover>
            <slot name="operation-right"></slot>
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
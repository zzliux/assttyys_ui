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
import router from '@/pages/router';

const $props = defineProps<{
    scheme: Scheme,
    groupName: string,
    showCheckBox: boolean,
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
    operationBoxHide();
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
    operationBoxHide();
}

const editDialogSaveEvent = async (option: onConfirmOption) => {
    const { type, oldScheme, newScheme } = option;
    const saveResult = await AutoWeb.autoPromise('saveScheme', {
        oldScheme, newScheme, type
    });
    if (saveResult.error) {
        ElMessage.error(saveResult.message);
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
    if (($props.scheme.groupNames?.length === 1 && $props.scheme.groupNames[0] === $props.groupName) || !$props.scheme.groupNames?.length) {
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
    operationBoxHide();
}

const schemeItemClickEvent = () => {
    if ($props.showCheckBox) {
        $props.scheme.export = !$props.scheme.export;
        return;
    }
    router.push({
        path: '/FunctionManagementPage',
        query: {
            schemeName: $props.scheme.schemeName
        }
    });
}

const operationBoxShown = ref<boolean>(false);
const operationBoxRef = ref<HTMLDivElement>();
const operationBoxShow = () => {
    operationBoxShown.value = true;
    setTimeout(() => {
        operationBoxRef.value.style.width = '140px';
    }, 0)
}

const operationBoxHide = () => {
    operationBoxRef.value.style.width = '0px';
    setTimeout(() => {
        operationBoxShown.value = false;
    }, 200)
}

</script>

<template>
    <ItemCard @click="schemeItemClickEvent">
        <div class="item-title">
            <el-checkbox @click.stop v-if="$props.showCheckBox" v-model="$props.scheme.export" size="small"
                style="margin-right: 5px"></el-checkbox>
            <el-text size="small" :sflag="`${groupName}-${scheme.schemeName}`">{{
                $props.scheme?.schemeName }}</el-text>
        </div>
        <div class="item-operation">
            <slot name="operation-left"></slot>
            <div style="position: relative;">
                <el-button size="small" link @click.stop="operationBoxShow">
                    <el-icon>
                        <Operation />
                    </el-icon>
                </el-button>
                <div v-if="operationBoxShown" class="operation-box" ref="operationBoxRef">
                    <el-button link size="small" type="primary" @click.stop="toTop">置顶</el-button>
                    <el-button link size="small" type="success" @click.stop="copyBtnEvent">复制</el-button>
                    <el-button link size="small" type="warning" @click.stop="modifyBtnEvent">修改</el-button>
                    <el-popconfirm title="确认是否删除" @confirm="deleteConfirmBtnEvent" confirm-button-text="确认"
                        cancel-button-text="取消">
                        <template #reference>
                            <el-button link size="small" type="danger" @click.stop>删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button size="small" link @click.stop="operationBoxHide">
                        <el-icon>
                            <Operation />
                        </el-icon>
                    </el-button>
                </div>
            </div>

            <slot name="operation-right"></slot>
        </div>
    </ItemCard>
    <SchemeEditDialog v-if="schemeEidtDialogVisiable" v-model="schemeEidtDialogVisiable" :scheme="$props.scheme"
        :type="schemeEditType" @confirm="editDialogSaveEvent" />
</template>

<style scoped>
.item-checkbox,
.item-title,
.item-operation {
    display: flex;
}

.item-operation {
    align-items: center;
}

.operation-box {
    transition: width 200ms ease-in-out;
    position: absolute;
    top: -6px;
    right: 0;
    width: 0px;
    background-color: #fff;
    overflow: hidden;
    text-wrap: nowrap;
    line-height: 31px;
    height: 34px;
    text-align: right;
}

.mask {
    z-index: 10;
    position: fixed;
    width: 99999px;
    height: 99999px;
    top: 0;
    left: 0;
}
</style>

<style>
.el-popover.el-popper.scheme-item-operation {
    min-width: initial;
}

.item-title .el-checkbox {
    height: initial;
}

.operation-box .el-button+.el-button {
    margin-left: 0;
}
</style>
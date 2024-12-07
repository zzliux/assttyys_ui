<script lang="ts" setup>
import { AutoWeb } from '@/tools/AutoWeb';
import type { Scheme } from '@/tools/declares';
import { ElMessage } from 'element-plus';
import globalEmmiter from '@/tools/GlobalEventBus';
import { ref } from 'vue';
import { Close } from '@element-plus/icons-vue';

const $model = defineModel<boolean>();
const importDialogStr = ref<string>('')
const importSchemeList = ref<Scheme[]>([])
const importSelectDialogShown = ref<boolean>(false)
const tableRef = ref();


const pasteBtnEvent = async () => {
    importDialogStr.value = await AutoWeb.autoPromise('getClip');
}

const randomStr = () => {
    return Math.random().toString(36).slice(-8);
}

const parseBtnEvent = async () => {
    try {
        const arr: Scheme[] = JSON.parse(importDialogStr.value);
        const allSchemeList = await AutoWeb.autoPromise('getSchemeList');
        arr.forEach(scheme => {
            if (allSchemeList.find(s => s.schemeName === scheme.schemeName)) {
                scheme.schemeName = scheme.schemeName + randomStr();
            }
        });
        importSchemeList.value = arr;
        importSelectDialogShown.value = true;
    } catch (error) {
        ElMessage.error('解析失败，请检查导入内容是否有误');
    }
}

const improtBtnEvent = async () => {
    const rows: Scheme[] = tableRef.value.getSelectionRows();
    for (let row of rows) {
        const r = await AutoWeb.autoPromise('saveScheme', {
            newScheme: row,
            type: 'add'
        });
        if (r.error) {
            $model.value = false;
            importSelectDialogShown.value = false;
            globalEmmiter.emit('Event.SchemeItemCard.Operation'); // 仅用于主界面刷新下数据
            ElMessage.error(r.message);
            return;
        }
    }
    $model.value = false;
    importSelectDialogShown.value = false;
    ElMessage.success('导入完成');
    globalEmmiter.emit('Event.SchemeItemCard.Operation'); // 仅用于主界面刷新下数据
}

</script>

<template>
    <el-dialog v-model="$model" align-center width="70%" :show-close="false">
        <el-input @focus="($event: FocusEvent) => ($event.currentTarget as HTMLInputElement).select()"
            style="height: 50vh" size="small" type="textarea" v-model="importDialogStr" />
        <div style="position: absolute; right: 16px; bottom: 16px;">
            <el-button type="warning" size="medium" @click="pasteBtnEvent">粘贴</el-button>
            <el-button type="primary" size="medium" @click="parseBtnEvent">解析</el-button>
        </div>
        <div style="position: absolute; right: 28px; top: 5px; font-size: 20px;">
            <el-icon style="color: black;" @click="$model = false">
                <Close />
            </el-icon>
        </div>
    </el-dialog>
    <el-dialog class="import-scheme-dialog" v-model="importSelectDialogShown" height="100%" width="100%" fullscreen>
        <el-table @row-click="(row: Scheme) => tableRef.toggleRowSelection(row)" size="small" ref="tableRef"
            :data="importSchemeList" style="width: 100%;" stripe>
            <el-table-column type="selection" width="28" />
            <el-table-column prop="schemeName" label="方案名" />
            <el-table-column prop="groupNames" label="分组" />
        </el-table>
        <div style="position: absolute; right: 16px; bottom: 16px;">
            <el-button type="primary" size="large" @click="improtBtnEvent">导入</el-button>
        </div>
    </el-dialog>
</template>

<style>
.import-scheme-dialog .el-dialog__body {
    height: calc(100% - 32px);
    overflow: auto;
}
</style>
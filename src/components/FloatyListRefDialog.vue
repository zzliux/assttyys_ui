<script setup lang="ts">
import { AutoWeb } from '@/tools/AutoWeb';
import type { floatyInfo } from '@/tools/declares';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const floatyList = ref<floatyInfo[]>([]);
const dialogShown = ref<boolean>(false);

const open = async () => {
    floatyList.value = await AutoWeb.autoPromise('getToFloat');
    dialogShown.value = true;
}

const close = async () => {
    dialogShown.value = false;
}

defineExpose({
    open, close
});

const dialogConfirmBtnEvent = async () => {
    const floatyNames: string[] = floatyList.value.filter(item => item.referred).map(item => item.floatyName);
    await AutoWeb.auto('saveToFloat', floatyNames);
    ElMessage.warning('已更新悬浮窗按钮，重启生效');
    dialogShown.value = false;
}


</script>
<template>
    <el-dialog v-model="dialogShown" :close-on-click-modal="false">
        <template #header>
            <el-text size="large">勾选需显示的悬浮窗</el-text>
        </template>
        <div class="floaty-list-ref-dialog-container">
            <div v-for="item in floatyList">
                <el-checkbox v-model="item.referred" class="floaty-list-ref-item">
                    <template #default>
                        <el-text size="small">{{ item.floatyName }}</el-text><br>
                    </template>
                </el-checkbox>
            </div>
        </div>
        <template #footer>
            <el-button size="small" @click="dialogShown = false">取消</el-button>
            <el-button size="small" type="primary" @click="dialogConfirmBtnEvent">确认</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.app-list-ref-dialog-container {
    max-height: calc(70vh - 89px);
    overflow: auto;
}

.app-list-ref-item {
    border-top: 1px solid #ebeef5;
    /* border-bottom: 1px solid #ebeef5; */
    position: relative;
    width: 100%;
    padding: 5px 10px 6px 10px;
    font-size: 14px;
    display: flex;
    /* justify-content: space-between; */
    background-color: #fff;
    z-index: 1;
    transition: all .2s ease-in-out;
    min-height: 38px;
}
</style>

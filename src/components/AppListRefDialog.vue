<script setup lang="ts">
import { AutoWeb } from '@/tools/AutoWeb';
import type { PackageInfo } from '@/tools/declares';
import { onMounted, ref, watch } from 'vue';

const packageList = ref<PackageInfo[]>([]);
const dialogShown = ref<boolean>(false);

const open = async () => {
    packageList.value = await AutoWeb.autoPromise('getToSetDefaultLaunchAppList');
    dialogShown.value = true;
}

const close = async () => {
    dialogShown.value = false;
}

defineExpose({
    open, close
});

const dialogConfirmBtnEvent = async () => {
    await AutoWeb.autoPromise('saveToSetDefaultLaunchAppList', packageList.value.filter(item => item.referred).map(item => item.packageName));
    dialogShown.value = false;
}

// 只让关联一个，关联多个懒得做，后面再考虑做关联多个的
const resetChangeEvent = async (pkgInfo: PackageInfo) => {
    packageList.value.forEach(item => {
        if (item.packageName === pkgInfo.packageName) {
            item.referred = true;
        } else {
            item.referred = false;
        }
    });
}

</script>
<template>
    <el-dialog v-model="dialogShown" :close-on-click-modal="false">
        <template #header>
            <el-text size="large">关联启动应用</el-text>
        </template>
        <div class="app-list-ref-dialog-container">
            <div v-for="item in packageList">
                <el-checkbox v-model="item.referred" class="app-list-ref-item" @change="resetChangeEvent(item)">
                    <template #default>
                        <el-text size="small">{{ item.appName }}</el-text><br>
                        <el-text size="small">{{ item.packageName }} {{ item.versionName }}</el-text>
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

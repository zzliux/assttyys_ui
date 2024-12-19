<script setup lang="ts">
import AppListRefDialog from '@/components/AppListRefDialog.vue';
import Nav from '@/components/Nav.vue';
import VersionDialog from '@/components/VersionDialog.vue';
import { AutoWeb } from '@/tools/AutoWeb';
import type { SettingItem } from '@/tools/declares';
import { ElMessage, ElMessageBox } from 'element-plus';
import { h, onMounted, ref } from 'vue';
import router from './router';
import FloatyListRefDialog from '@/components/FloatyListRefDialog.vue';


const settingList = ref<SettingItem[]>();
const appListRefDialogRef = ref<InstanceType<typeof AppListRefDialog>>();
const FloatyListRefDialogRef = ref<InstanceType<typeof FloatyListRefDialog>>();
const versionDialogRef = ref<InstanceType<typeof VersionDialog>>();
const appVersion = ref<string>('');

onMounted(async () => {
    await loadData();
    const { versionList } = (await AutoWeb.autoPromise('versionInfo'));
    appVersion.value = versionList[versionList.length - 1].version;
});

const loadData = async () => {
    settingList.value = await AutoWeb.autoPromise('getSettings');
}

const itemChangeEvent = async (item: SettingItem) => {
    await AutoWeb.autoPromise('saveSetting', item);
    ElMessage.success('保存成功');
    await loadData();
}

const globalResetEvent = async () => {
    ElMessageBox.confirm(
        '即将清空并重置所有数据，重置后将退出脚本，是否继续？',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await AutoWeb.autoPromise('clearStorage');
        return await AutoWeb.autoPromise('exit');
    }).catch(() => {
        // 取消了
        return;
    });
}

const startActivityForLog = () => {
    AutoWeb.autoPromise('startActivityForLog');
}

const logout = () => {

    ElMessageBox.confirm(
        // h(ElText, { size: 'small' }, '确认是否退出登录'),
        '确认是否退出登录',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            buttonSize: 'small',
        }
    ).then(async () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('userInfo');
        localStorage.removeItem('autoOAuth');
        router.replace('/OAuth');
        return;
    }).catch(() => {
        // 取消了
        return;
    });
}

</script>
<template>
    <Nav name="设置">
    </Nav>
    <div class="container">
        <div class="item-container" v-for="item in settingList" :key="item.name">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>{{ item.desc }}</el-text></span>
                <span class="item-header-right">
                    <el-switch size="small" v-if="item.stype === 'switch' || !item.stype" v-model="item.enabled"
                        @change="itemChangeEvent(item)" />
                    <el-select v-else-if="item.stype === 'list'" v-model="item.value" :size="'small'"
                        @change="itemChangeEvent(item)">
                        <el-option v-for="option in item.data" :key="option" :label="option" :value="option" />
                    </el-select>
                    <el-input v-else-if="item.stype === 'text'" v-model="item.value" :size="'small'"
                        @blur="itemChangeEvent(item)" />
                </span>
            </div>
        </div>
        <FloatyListRefDialog ref="FloatyListRefDialogRef" />
        <div class="item-container" @click.stop="FloatyListRefDialogRef.open()">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>自选悬浮窗按钮显示</el-text></span>
            </div>
        </div>
        <AppListRefDialog ref="appListRefDialogRef" />
        <div class="item-container" style="margin-top: 10px" @click.stop="appListRefDialogRef.open()">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>关联启动应用</el-text></span>
            </div>
        </div>
        <VersionDialog ref="versionDialogRef" />
        <div class="item-container" @click.stop="versionDialogRef.open()">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>版本：{{ appVersion }}</el-text></span>
            </div>
        </div>
        <div class="item-container" @click="startActivityForLog">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>查看日志</el-text></span>
            </div>
        </div>
        <div class="item-container" @click="logout">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>退出登录</el-text></span>
            </div>
        </div>
        <div class="item-container" @click="globalResetEvent">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>全局重置</el-text></span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 46px);
    background-color: #f4f5f7;
    flex-wrap: wrap;
}

.item-header {
    border-top: 1px solid #ebeef5;
    /* border-bottom: 1px solid #ebeef5; */
    position: relative;
    width: 100%;
    padding: 5px 10px 5px 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    z-index: 1;
    transition: all .2s ease-in-out;
    min-height: 35.6px;
}

.item-container {
    width: 100%;
}

.item-header:active,
.item-container:active {
    background-color: #ebeef5;
}

.item-header-text,
.item-header-right {
    display: flex;
    transition: all .2s ease-in-out;
    margin-right: 10px;
    justify-content: flex-end;
}

.item-header-right {
    min-width: 120px;
}
</style>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import router from './router';
import { doPost } from '@/tools/remote';
import { OAuthURL } from '@/config';
import { ElMessage } from 'element-plus';
import { AutoWeb } from "@/tools/AutoWeb";


const autoOAuth = ref<boolean>(JSON.parse(localStorage.getItem('autoOAuth') || 'false'));
watch(autoOAuth, (val) => {
    localStorage.setItem('autoOAuth', JSON.stringify(val));
})


// OAuth from https://github.com/login/oauth/authorize?client_id=Ov23lilJJPODziwTatQe
onMounted(async () => {
    if (autoOAuth.value) {
        resumeValidUser();
    }
});
const gotoGithubOAuth = async () => {
    // 只有点击跳转时才注册resume回调
    window.resumeValidUser = resumeValidUser;
    const deviceId = await AutoWeb.autoPromise('getDeviceId');
    let url = OAuthURL + '?deviceId=' + deviceId;
    AutoWeb.autoPromise('openURL', url)
}

const getUserInfo = async () => {
    const deviceId = await AutoWeb.autoPromise('getDeviceId');
    return await doPost('/oauth/get_user_info', { deviceId });
}

const resumeValidUser = async () => {
    const userInfo = await getUserInfo();
    if (userInfo.error) {
        ElMessage.error(`登录验证失败，请尝试重新登录`);
        return;
    }
    ElMessage.success(`登录验证成功。`)
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    router.replace('/SchemeManagementPage');
    window.resumeValidUser = null;
}

const copyGithubOAuthURL = async () => {
    const deviceId = await AutoWeb.autoPromise('getDeviceId');
    let url = OAuthURL + '?deviceId=' + deviceId;
    await AutoWeb.autoPromise('copyToClip', url);
    ElMessage.success(`复制成功。`)
}

</script>

<template>
    <div style="display: flex;height: 70px;flex-direction: column;justify-content: space-around;margin-top: 100px;">
        <el-text size="small">请登录后使用，点击跳转将跳转至浏览器，使用github账号登录，完成后返回本应用</el-text>
        <el-text size="small">或复制授权链接后自行选择浏览器，登录完成后返回本应用并点击验证</el-text>
        <div style="display: flex; justify-content: center">
            <el-checkbox v-model="autoOAuth" size="small" label="记住选择" />
            <el-button style="margin-left: 20px;" type="primary" size="small" @click="gotoGithubOAuth">跳转</el-button>
            <el-button style="" type="primary" size="small" @click="copyGithubOAuthURL">复制链接</el-button>
            <el-button style="" type="primary" size="small" @click="resumeValidUser">验证</el-button>
        </div>
    </div>
</template>

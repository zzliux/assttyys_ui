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
    startCountdown();
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
    ElMessage.success(`复制链接成功，请自行打开。`)
}
const ReadAlready = ref(false);
const isDisabled = ref(true);
const countdown = ref(9);
const startCountdown = () => {
    const interval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(interval);
            isDisabled.value = false; // 倒计时结束后启用复选框
        }
    }, 1000);
};
const copyQQGroup = async () => {
    let url = 'https://qm.qq.com/q/cAbNMI25UI'
    await AutoWeb.autoPromise('copyToClip', url);
    ElMessage.success(`复制加QQ群链接成功，请在浏览器里打开加入。`)
}
const copyGithub = async () => {
    let url = 'https://github.com/zzliux/assttyys_autojs'
    await AutoWeb.autoPromise('copyToClip', url);
    ElMessage.success(`复制Github仓库链接成功，请自行打开。`)
}
</script>

<template>
    <div class="assttyys_container">
        <el-text class="content" style="font-size: 3em; font-weight: bold; color: brown;">
            ASSTTYYS
        </el-text>
    </div>
    <div class="assttyys_container">
        <el-text style="font-size: 1em; margin-top: 10px;margin-bottom: 20px;">
            本软件完全<span class="red-text">免费</span>， <span class="blue-text">痒痒鼠高玩交流群</span>
            <el-button style="margin-left: 5px;margin-top: 2px;" @click="copyQQGroup">复制QQ群邀请链接</el-button>
        </el-text>
    </div>
    <div style="margin: 10px 20px 0px 20px; ">
        <el-text
            style="font-size: 1em;display: block;">需登录Github账号，点击跳转会用浏览器打开，点击复制链接后需自行粘贴打开，完成后点击验证。(可能需要梯子)</el-text>
        <div style="display: flex;margin-top: 5px;margin-left: 20px;">
            <el-checkbox v-model="autoOAuth" label="记住选择" />
            <el-button style="margin-left: 20px;" type="primary" @click="gotoGithubOAuth">跳转</el-button>
            <el-button style="" type="primary" @click="copyGithubOAuthURL">复制链接</el-button>
            <el-button style="" type="primary" @click="resumeValidUser">验证</el-button>
        </div>
    </div>
    <div style="margin: 10px 20px 0px 20px; ">
        <el-text style="font-size: 1em;">本软件的Github仓库地址：</el-text>
        <el-text style="font-size: 1em;">https://github.com/zzliux/assttyys_autojs</el-text>
        <el-button style="margin-left: 20px;" type="primary" @click="copyGithub">复制链接</el-button>
    </div>
</template>

<style scoped>
.red-text {
    color: red;
    font-weight: bold;
}

.blue-text {
    color: blue;
    font-weight: bold;
}

.assttyys_container {
    display: flex;
    justify-content: center;
}
</style>

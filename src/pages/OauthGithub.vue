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
    let url = 'https://qm.qq.com/cgi-bin/qm/qr?authKey=XuNaV+q9McnC%2FQsUxS5E6o6ORXV5HndZjzUC5%2FHl4Y6PTSwjmakOrZphXNtRAKuc&k=V45PbJCqhMk7aE0lG_j6LLO4NlKRghs3&noverify=0'
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
            本软件完全<span class="red-text">免费</span>，从任何收费渠道获取的请<span class="red-text">申请退款</span>，这是对开发者的<span
                class="red-text">支持</span>和<span class="red-text">尊重</span>！任何支持<span
                class="red-text">牟利</span>的行为，都将和<span class="red-text">倒狗</span>一样被<span
                class="red-text">唾弃</span>！<span class="red-text">倒狗</span>提供不了任何<span
                class="red-text">技术支持</span>，也不会对任何<span class="red-text">问题负责</span>！我们也不欢迎未<span
                class="red-text">及时退款</span>的用户！
        </el-text>
    </div>
    <div>
        <el-text style="font-size: 1em;display: block;">
            阅读以下<span class=" blue-text">进群须知</span>后加入：<span class="blue-text">痒痒鼠高玩交流群</span>，获得更优质的<span
                class="blue-text">技术支持</span>和<span class="blue-text">问题解答</span>！
        </el-text>
        <el-text style="font-size: 1em;display: block;">
            1.先看群公告和手册，不要问已经在精华消息中有明确答案的问题。
        </el-text>
        <el-text style="font-size: 1em;display: block;">
            2.学会提问的效率，参考手册第2.3或群公告图片。
        </el-text>
        <el-text style="font-size: 1em;display: block;">
            3.没人回答可能是提问方法错误或是管理未看到。
        </el-text>
        <div style="display: flex;">
            <el-checkbox style="margin-left: 20px; margin-right: 5px;font-size: 1em; margin-top: 2px;"
                v-model="ReadAlready" :disabled="isDisabled" label="我已仔细阅读" />
            <el-text v-if="isDisabled" style=" margin-top: -2px;">{{ countdown }}秒</el-text>
            <el-button style="margin-left: 5px;margin-top: 2px;" type="primary" :disabled="!ReadAlready"
                @click="copyQQGroup">复制QQ群邀请链接</el-button>
        </div>
    </div>
    <div style="margin-top: 10px; ">
        <el-text style="font-size: 1em;display: block;">需登录Github账号，点击跳转会用浏览器打开，点击复制链接后需自行粘贴打开，完成后点击验证。(可能需要梯子)</el-text>
        <div style="display: flex;margin-top: 5px;margin-left: 20px;">
            <el-checkbox v-model="autoOAuth" label="记住选择" />
            <el-button style="margin-left: 20px;" type="primary" @click="gotoGithubOAuth">跳转</el-button>
            <el-button style="" type="primary" @click="copyGithubOAuthURL">复制链接</el-button>
            <el-button style="" type="primary" @click="resumeValidUser">验证</el-button>
        </div>
    </div>
    <div style="margin-top: 10px; ">
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

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import router from './router';
import { doPost } from '@/tools/remote';
import { OAuthURL } from '@/config';
import { ElMessage } from 'element-plus';


const autoOAuth = ref<boolean>(JSON.parse(localStorage.getItem('autoOAuth') || 'false'));
const isLogining = ref<boolean>(false);
watch(autoOAuth, (val) => {
    localStorage.setItem('autoOAuth', JSON.stringify(val));
})


// OAuth from https://github.com/login/oauth/authorize?client_id=Ov23lilJJPODziwTatQe
onMounted(async () => {
    const code = sessionStorage.getItem('code')
    if (code) {
        isLogining.value = true;
        sessionStorage.removeItem('code');
        const res = await doPost('/api/github/login/oauth/access_token', { code });
        if (res.error) {
            ElMessage.error(res.error);
            return;
        }
        sessionStorage.setItem('access_token', res.access_token);
    }
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
        // router.push('/login');
        isLogining.value = false;
        if (autoOAuth.value) {
            isLogining.value = true;
            nextTick(() => {
                window.location.href = OAuthURL;
            });
        }
        return;
    } else {
        isLogining.value = true;
    }
    const res = await doPost('/api/github/user', { access_token: accessToken });
    if (!res?.name) {
        sessionStorage.removeItem('access_token');
        isLogining.value = false;
        if (autoOAuth.value) {
            isLogining.value = true;
            nextTick(() => {
                window.location.href = OAuthURL;
            });
        }
        return;
    } else {
        isLogining.value = true;
    }
    sessionStorage.setItem('userInfo', JSON.stringify(res));
    isLogining.value = true;
    nextTick(() => {
        router.replace('/SchemeManagementPage');
    })
});
const gotoGithubOAuth = () => {
    window.location.href = OAuthURL;
}

</script>

<template>
    <!-- TODO 美化 -->
    <div v-if="isLogining"
        style="display: flex;height: 70px;flex-direction: column;justify-content: space-around;margin-top: 100px;">
        <el-text size="small">登录中，请稍后...</el-text>
    </div>
    <div v-else
        style="display: flex;height: 70px;flex-direction: column;justify-content: space-around;margin-top: 100px;">
        <el-text size="small">请登录后使用，点击确认将 跳转使用github账号登录</el-text>
        <div style="display: flex; justify-content: center">
            <el-checkbox v-model="autoOAuth" size="small" label="记住选择" />
            <el-button style="margin-left: 20px;" type="primary" size="small" @click="gotoGithubOAuth">确认</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import router from './router';
import { doPost } from '@/tools/remote';
import { OAuthURL } from '@/config';
import { ElMessage } from 'element-plus';

// OAuth from https://github.com/login/oauth/authorize?client_id=Ov23lilJJPODziwTatQe
onMounted(async () => {
    const code = localStorage.getItem('code')
    if (code) {
        localStorage.removeItem('code');
        const res = await doPost('/api/github/login/oauth/access_token', { code });
        if (res.error) {
            ElMessage.error(res.error);
            return;
        }
        localStorage.setItem('access_token', res.access_token);
    }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        // router.push('/login');
        window.location.href = OAuthURL;
        return;
    }
    const res = await doPost('/api/github/user', { access_token: accessToken });
    if (!res?.name) {
        localStorage.removeItem('access_token');
        window.location.href = OAuthURL;
        return;
    }
    sessionStorage.setItem('userInfo', JSON.stringify(res));
    router.replace('/SchemeManagementPage');
});
</script>

<template>
    <!-- TODO 美化 -->
    登录中，请稍后
</template>

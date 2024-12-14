<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import router, { routesDefine } from '../pages/router';
import { onMounted, ref } from 'vue';

const $props = defineProps({
    name: String
});

const avatarURL = ref<string>('');

onMounted(async () => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    if (!userInfo.login) {
        router.replace('/OAuth');
    }
    avatarURL.value = userInfo.avatar_url;
});

</script>

<template>
    <div style="height: 46px; padding-top: 3px; padding-left: 10px">
        <el-page-header>
            <template #icon>
                <el-avatar :size="20" :src="avatarURL" />
            </template>
            <template #title>
                <el-text @click="$router.push('/SchemeManagementPage')">ASSTTYYS</el-text>
            </template>
            <template #content>
                <!-- <el-text>{{ $props.name }}</el-text> -->
                <el-dropdown trigger="click" size="small">
                    <el-text size="small">
                        {{ $props.name }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-text>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <template v-for="(item, index) in routesDefine">
                                <el-dropdown-item v-if="item.name !== $props.name" @click="$router.push(item.path)">
                                    <span>{{ item.name }}</span>
                                </el-dropdown-item>
                            </template>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
            <template #extra>
                <slot name="extra"></slot>
            </template>
        </el-page-header>
    </div>
</template>

<style>
.el-page-header__back,
.el-page-header__left .el-divider--vertical,
.el-page-header__content {
    display: flex;
    padding-top: 10px;
    padding-bottom: 10px
}
.el-page-header__left {
    margin-right: 80px;
}
.el-page-header__extra {
    position: absolute;
    right: 0;
    background: white;
}
</style>
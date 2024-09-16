<script setup lang="ts">
import { onMounted, ref } from 'vue';



const routesDefine = [
    { name: 'ASSTTYYS' },
    { name: '方案管理', parent: 'ASSTTYYS', path: '/SchemeManagementPage' },
    { name: '定时任务', parent: 'ASSTTYYS', path: '/SettingPage' },
    { name: '设置', parent: 'ASSTTYYS', path: '/SettingPage' },
    { name: '功能管理', parent: '方案管理', path: '/FunctionManagementPage' },
]
const $props = defineProps({
    name: String
});

const breadcrumbData = ref([]);
onMounted(() => {
    // 构造面包屑导航
    recSearch($props.name)
    function recSearch(name: string): void {
        for (let i = 0; i < routesDefine.length; i++) {
            if (routesDefine[i].name === name) {
                breadcrumbData.value.unshift({
                    name: routesDefine[i].name,
                    ...(name === $props.name ? {} : { path: routesDefine[i].path })
                });
                if (routesDefine[i].parent) {
                    recSearch(routesDefine[i].parent);
                }
            }
        }
    }
});

</script>

<template>
    <div style="height: 46px; padding-top: 3px; padding-left: 10px">
        <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="index" :to="item.path || ''">
                {{ item.name }}
            </el-breadcrumb-item>
        </el-breadcrumb> -->
        <el-page-header :icon="null">
            <template #title>
                <el-text>ASSTTYYS</el-text>
            </template>
            <template #content>
                <el-text>{{ $props.name }}</el-text>
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
</style>
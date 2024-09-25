<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import { routesDefine } from '../pages/router';

const $props = defineProps({
    name: String
});

</script>

<template>
    <div style="height: 46px; padding-top: 3px; padding-left: 10px">
        <el-page-header :icon="null">
            <template #title>
                <el-text>ASSTTYYS</el-text>
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
</style>
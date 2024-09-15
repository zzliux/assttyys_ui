<script setup lang="ts">
import type { Scheme } from '@/tools/declares';
import ItemCard from './ItemCard.vue';
import { Menu } from '@element-plus/icons-vue';


const $props = defineProps<{
    scheme: Scheme
}>();

</script>

<template>
    <ItemCard>
        <div class="item-title">
            <el-text>{{ $props.scheme.schemeName }}</el-text>
        </div>
        <div class="item-operation">
            <el-popover placement="left" :width="55" trigger="click" popper-class="scheme-item-operation">
                <template #reference>
                    <el-icon>
                        <Menu />
                    </el-icon>
                </template>
                <template #default>
                    <el-link type="primary">置顶</el-link><br />
                    <el-link type="success">复制</el-link><br />
                    <el-link type="warning">修改</el-link><br />
                    <el-link type="danger">删除</el-link>
                </template>
            </el-popover>
        </div>
    </ItemCard>
</template>

<style scoped>
.item-title,
.item-operation {
    display: flex;
}
</style>

<style>
.el-popover.el-popper.scheme-item-operation {
    min-width: initial;
}
</style>
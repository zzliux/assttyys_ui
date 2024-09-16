<script setup lang="ts">
import type { Scheme } from '@/tools/declares';
import ItemCard from './ItemCard.vue';
import { Menu } from '@element-plus/icons-vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { AutoWeb } from '@/tools/AutoWeb';


const $props = defineProps<{
    scheme: Scheme
}>();

// 置顶
const toTop = async () => {
    // 啥也不做，通知父类对方案进行置顶
    globalEmmiter.emit('Event.SchemeItemCard.Operation', {
        type: 'toTop',
        targetScheme: $props.scheme,
        newScheme: $props.scheme,
    });
}

// 复制
const copy = async () => {

}

// 修改
const modify = async () => {
    // 弹窗
}

// 删除
const remove = async () => {
    await AutoWeb.autoPromise('removeScheme', $props.scheme);
    globalEmmiter.emit('Event.SchemeItemCard.Operation', {
        type: 'remove',
        targetScheme: $props.scheme,
    });
}

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
                    <el-link type="primary" @click="toTop">置顶</el-link><br />
                    <el-link type="success" @click="copy">复制</el-link><br />
                    <el-link type="warning" @click="modify">修改</el-link><br />
                    <el-popconfirm title="确认是否删除" @confirm="remove" confirm-button-text="确认" cancel-button-text="取消">
                        <template #reference>
                            <el-link type="danger">删除</el-link>
                        </template>
                    </el-popconfirm>
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
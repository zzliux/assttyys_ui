<script setup lang='ts'>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { AutoWeb } from '@/tools/AutoWeb';
import Nav from '@/components/Nav.vue';
import { FixedCollapse, FixedCollapaseItem } from '@/components/FixedCollapse';
import type { Scheme } from '@/tools/declares';
import SchemeItemCard from '@/components/SchemeItemCard.vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { categorySchemeList } from '@/tools/tools';

onMounted(async () => {
    loadData();
});

const collapseVal = ref('用户方案');

const schemeList = ref<Scheme[]>([]);
const unstaredUserSchemeList = ref<Scheme[]>([]);
const unstaredInnerSchemeList = ref<Scheme[]>([]);
const staredSchemeList = ref<Scheme[]>([]);
watch(schemeList, (newVal) => {
    const data = categorySchemeList(newVal);
    unstaredUserSchemeList.value = data.unstaredUserSchemeList;
    unstaredInnerSchemeList.value = data.unstaredInnerSchemeList;
    staredSchemeList.value = data.staredSchemeList;
}, { deep: true })

async function loadData() {
    schemeList.value = await AutoWeb.autoPromise('getSchemeList');
}

function schemeItemClick() {
    // TODO 跳转进入该方案的功能配置页
    console.log('schemeItemClick');
}

function schemeItemLongClick(e: Event) {
    console.log(e);
    // TODO 方案的操作菜单
    console.log('schemeItemLongClick');
}

onMounted(() => {
    globalEmmiter.on('Event.SchemeItemCard.Operation', (option) => {
        if (option.type === 'copy') {
            const copyIndex = schemeList.value.findIndex(item => item.schemeName === option.targetScheme.schemeName);
            schemeList.value.splice(copyIndex + 1, 0, option.newScheme);
        } else if (option.type === 'modify') {
            const modifyIndex = schemeList.value.findIndex(item => item.schemeName === option.targetScheme.schemeName);
            schemeList.value[modifyIndex] = option.newScheme;
        } else if (option.type === 'remove') {
            const toRemoveIndex = schemeList.value.findIndex(item => item.schemeName === option.targetScheme.schemeName);
            schemeList.value.splice(toRemoveIndex, 1);
        } else if (option.type === 'toTop') {
            const toRemoveIndex = schemeList.value.findIndex(item => item.schemeName === option.targetScheme.schemeName);
            schemeList.value.splice(toRemoveIndex, 1);
            schemeList.value.unshift(option.newScheme);
        }
    });
});


onUnmounted(() => {
    globalEmmiter.off('Event.SchemeItemCard.Operation')
});

</script>

<template>
    <Nav name="方案管理" />
    <div style="display: flex; height: 20px">
        <div style="width: 50%; display: flex; padding-left: 10px">
            <el-text>未收藏方案</el-text>
        </div>
        <div style="width: 50%; display: flex; padding-left: 10px">
            <el-text>已收藏方案</el-text>
        </div>
    </div>
    <div class="container">
        <div class="container-left">
            <FixedCollapse v-model="collapseVal">
                <FixedCollapaseItem name="用户方案">
                    <template #header>用户方案</template>
                    <template #content>
                        <SchemeItemCard v-for="scheme in unstaredUserSchemeList" :scheme="scheme" />
                    </template>
                </FixedCollapaseItem>
                <FixedCollapaseItem name="内置方案">
                    <template #header>内置方案</template>
                    <template #content>
                        <SchemeItemCard v-for="scheme in unstaredInnerSchemeList" :scheme="scheme" />
                    </template>
                </FixedCollapaseItem>
            </FixedCollapse>
        </div>
        <div class="container-right">
            <SchemeItemCard v-for="scheme in unstaredInnerSchemeList" :scheme="scheme" />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
}

.container-left,
.container-right {
    width: 50%;
    height: 100%;
    overflow: auto;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
}
</style>
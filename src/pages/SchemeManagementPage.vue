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

const collapseValLeft = ref('未收藏方案-用户方案');
const collapseValRight = ref('已收藏方案');

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
    <div class="container">
        <div class="container-left">
            <FixedCollapse v-model="collapseValLeft">
                <FixedCollapaseItem name="未收藏方案-用户方案">
                    <template #header>未收藏方案-用户方案</template>
                    <template #content>
                        <SchemeItemCard v-for="scheme in unstaredUserSchemeList" :scheme="scheme" />
                    </template>
                </FixedCollapaseItem>
                <FixedCollapaseItem name="未收藏方案-内置方案">
                    <template #header>未收藏方案-内置方案</template>
                    <template #content>
                        <SchemeItemCard v-for="scheme in unstaredInnerSchemeList" :scheme="scheme" />
                    </template>
                </FixedCollapaseItem>
            </FixedCollapse>
        </div>
        <div class="container-right">
            <FixedCollapse v-model="collapseValRight">
                <FixedCollapaseItem name="已收藏方案">
                    <template #header>已收藏方案</template>
                    <template #content>
                        <SchemeItemCard v-for="scheme in staredSchemeList" :scheme="scheme" />
                    </template>
                </FixedCollapaseItem>
            </FixedCollapse>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: calc(100% - 46px);
    display: flex;
}

.container-left,
.container-right {
    width: 50%;
    height: 100%;
    overflow: auto;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
}
</style>
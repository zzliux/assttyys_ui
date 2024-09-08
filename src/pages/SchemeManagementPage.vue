<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { AutoWeb } from '@/tools/AutoWeb';
import Nav from '@/components/Nav.vue';
import { FixedCollapse, FixedCollapaseItem } from '@/components/FixedCollapse';
import type { Scheme } from '@/tools/declares';
import ItemCard from '@/components/ItemCard.vue';

onMounted(async () => {
    loadData();
});

const collapseVal = ref('用户方案');
const unstaredUserSchemeList = ref<Scheme[]>([]);
const unstaredInnerSchemeList = ref<Scheme[]>([]);
const staredSchemeList = ref<Scheme[]>([]);

async function loadData() {
    const res = await AutoWeb.autoPromise('getSchemeList');
    unstaredUserSchemeList.value = res.filter(scheme => !scheme.star && !scheme.inner);
    unstaredInnerSchemeList.value = res.filter(scheme => !scheme.star && scheme.inner);
    staredSchemeList.value = res.filter(scheme => scheme.star);
}

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
                        <ItemCard v-for="scheme in unstaredUserSchemeList">
                            <el-text>{{ scheme.schemeName }}</el-text>
                        </ItemCard>
                    </template>
                </FixedCollapaseItem>
                <FixedCollapaseItem name="内置方案">
                    <template #header>内置方案</template>
                    <template #content>
                        <ItemCard v-for="scheme in unstaredInnerSchemeList">
                            <el-text>{{ scheme.schemeName }}</el-text>
                        </ItemCard>
                    </template>
                </FixedCollapaseItem>
            </FixedCollapse>
        </div>
        <div class="container-right">
            <ItemCard v-for="scheme in unstaredInnerSchemeList">
                <el-text>{{ scheme.schemeName }}</el-text>
            </ItemCard>
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
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { AutoWeb } from '@/tools/AutoWeb';
import Nav from '@/components/Nav.vue';
import { FixedCollapse, FixedCollapaseItem } from '@/components/FixedCollapse';
import type { Scheme } from '@/tools/declares';

const unstaredSchemeList = ref<Scheme[]>([]);
const staredSchemeList = ref<Scheme[]>([]);
onMounted(async () => {
    const res = await Promise.all([
        AutoWeb.autoPromise('getUnStaredSchemeList'),
        AutoWeb.autoPromise('getStaredSchemeList')
    ]);
    unstaredSchemeList.value = res[0];
    staredSchemeList.value = res[1];
});

const collapseVal = ref('用户方案');

</script>

<template>
    <Nav name="方案管理" />
    <div class="container">
        <div class="container-left">
            <FixedCollapse v-model="collapseVal">
                <FixedCollapaseItem name="用户方案">
                    <template #header>用户方案</template>
                    <template #content>
                    </template>
                </FixedCollapaseItem>
                <FixedCollapaseItem name="内置方案">
                    <template #header>内置方案</template>
                    <template #content>
                    </template>
                </FixedCollapaseItem>
            </FixedCollapse>
        </div>
        <div class="container-right">

        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: calc(100% - 20px);
    display: flex;
}

.container-left,
.container-right {
    width: 50%;
    height: 100%;
    overflow: auto;
}
</style>
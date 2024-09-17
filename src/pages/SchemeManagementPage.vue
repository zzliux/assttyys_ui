<script setup lang='ts'>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { AutoWeb } from '@/tools/AutoWeb';
import Nav from '@/components/Nav.vue';
import { FixedCollapse, FixedCollapaseItem } from '@/components/FixedCollapse';
import type { Scheme } from '@/tools/declares';
import SchemeItemCard from '@/components/SchemeItemCard.vue';
import ItemCard from '@/components/ItemCard.vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { groupSchemeList } from '@/tools/tools';
import { Plus } from '@element-plus/icons-vue'
import SchemeEditDialog from '@/components/SchemeEditDialog/SchemeEditDialog.vue';
import { ElMessage } from 'element-plus';
import type { onConfirmOption } from '@/components/SchemeEditDialog';

onMounted(async () => {
    loadData();
});

const collapseVal = ref('未分组');

const schemeList = ref<Scheme[]>([]);
const groupNames = ref<string[]>([]);
const groupedSchemeList = ref<Record<string, Scheme[]>>({});
watch(schemeList, (newVal) => {
    groupedSchemeList.value = groupSchemeList(newVal);
}, { deep: true })

async function loadData() {
    groupNames.value = await AutoWeb.autoPromise('getGroupNames');
    schemeList.value = await AutoWeb.autoPromise('getSchemeList');
}

function schemeItemClick() {
    // TODO 跳转进入该方案的功能配置页
    console.log('schemeItemClick');
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

const newScheme = ref<Scheme>();
const newSchemeEditDialogShown = ref(false);
const addSchemeItemEvent = (groupName: string) => {
    newScheme.value = {
        id: schemeList.value.reduce((maxId, scheme) => scheme.id > maxId ? scheme.id : maxId, 0) + 1,
        schemeName: '',
        star: false,
        list: [],
        groupNames: [groupName],
        config: {},
        commonConfig: {}
    }
    newSchemeEditDialogShown.value = true;
}
const addSchemeConfirmEvent = async (option: onConfirmOption) => {
    const { newScheme, type } = option;
    const saveResult = await AutoWeb.autoPromise('saveScheme', {
        newScheme, type
    });
    if (saveResult.error) {
        ElMessage({
            type: 'error',
            message: saveResult.message,
            plain: true,
        })
        return false;
    }
    schemeList.value.push(newScheme);
    return true;
}

</script>

<template>
    <Nav name="方案管理" />
    <div class="container">
        <FixedCollapse v-model="collapseVal">
            <FixedCollapaseItem v-for="groupName in groupNames" :name="groupName">
                <template #header>{{ groupName }}</template>
                <template #content>
                    <div v-for="scheme in groupedSchemeList[groupName]" style="display: flex; width: 50%;">
                        <SchemeItemCard :scheme="scheme" />
                    </div>
                    <div style="display: flex; width: 50%;">
                        <ItemCard>
                            <div class="item-card-addscheme" @click="addSchemeItemEvent(groupName)">
                                <el-text><el-icon>
                                        <Plus />
                                    </el-icon> 添加方案</el-text>
                            </div>
                        </ItemCard>
                    </div>
                </template>
            </FixedCollapaseItem>
        </FixedCollapse>
        <SchemeEditDialog v-if="newSchemeEditDialogShown" v-model="newSchemeEditDialogShown" :scheme="newScheme"
            @confirm="addSchemeConfirmEvent" type="add" />
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
    width: 100%;
    height: 100%;
    overflow: auto;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
}

.item-card-addscheme {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
}
</style>
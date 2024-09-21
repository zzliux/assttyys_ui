<script setup lang='ts'>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { AutoWeb } from '@/tools/AutoWeb';
import Nav from '@/components/Nav.vue';
import { FixedCollapse, FixedCollapseItem } from '@/components/FixedCollapse';
import type { GroupSchemeName, Scheme } from '@/tools/declares';
import SchemeItemCard from '@/components/SchemeItemCard.vue';
import ItemCard from '@/components/ItemCard.vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { groupedSchemeListToGroupSchemeNames, groupSchemeList } from '@/tools/tools';
import { Plus, Sort, Star, StarFilled } from '@element-plus/icons-vue'
import SchemeEditDialog from '@/components/SchemeEditDialog/SchemeEditDialog.vue';
import { ElMessage } from 'element-plus';
import type { onConfirmOption } from '@/components/SchemeEditDialog';
import draggable from '@marshallswain/vuedraggable';


const collapseVal = ref('');

const schemeList = ref<Scheme[]>([]);
const groupSchemeNames = ref<GroupSchemeName[]>([]);
const groupedSchemeList = ref<Record<string, Scheme[]>>({});
// watch(groupSchemeNames, (newVal) => {
//     console.log('[groupSchemeNames] changed', newVal);
//     groupedSchemeList.value = groupSchemeList(newVal, schemeList.value);
// }, { deep: true });
// watch(schemeList, (newVal) => {
//     console.log('[schemeList] changed', newVal);
//     groupedSchemeList.value = groupSchemeList(groupSchemeNames.value, newVal);
// }, { deep: true });


onMounted(async () => {
    await loadData();
    collapseVal.value = groupSchemeNames.value[0].groupName;
});
async function loadData() {
    // schemeList.value = await AutoWeb.autoPromise('getSchemeList');
    // groupSchemeNames.value = await AutoWeb.autoPromise('getGroupSchemeNames');
    const result = await Promise.all([
        AutoWeb.autoPromise('getSchemeList'),
        AutoWeb.autoPromise('getGroupSchemeNames')
    ])
    schemeList.value = result[0];
    groupSchemeNames.value = result[1];
    groupedSchemeList.value = groupSchemeList(groupSchemeNames.value, schemeList.value);
}

function schemeItemClick() {
    // TODO 跳转进入该方案的功能配置页
    console.log('schemeItemClick');
}


onMounted(() => {
    globalEmmiter.on('Event.SchemeItemCard.Operation', (option) => {
        loadData();
        // if (option.type === 'copy') {
        //     const copyIndex = schemeList.value.findIndex(item => item.schemeName === option.targetScheme.schemeName);
        //     schemeList.value.splice(copyIndex + 1, 0, option.newScheme);
        // } else if (option.type === 'modify') {
        //     const modifyIndex = schemeList.value.findIndex(item => item.schemeName === option.targetScheme.schemeName);
        //     schemeList.value[modifyIndex] = option.newScheme;
        // } else if (option.type === 'remove') {
        //     const toRemoveIndex = schemeList.value.findIndex(item => item.schemeName === option.targetScheme.schemeName);
        //     schemeList.value.splice(toRemoveIndex, 1);
        // } else if (option.type === 'reSort') {
        //     groupSchemeNames.value = option.groupSchemeNames;
        // }
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
    loadData();
    return true;
}

const starBtnEvent = async (scheme: Scheme) => {
    scheme.star = !scheme.star;
    await AutoWeb.autoPromise('saveScheme', {
        oldScheme: scheme,
        newScheme: scheme,
        type: 'modify'
    });
}

const dragOptions = computed({
    get() {
        return {
            animation: 150,
            // group: 'description',
            // disabled: false,
            // ghostClass: 'ghost',
        };
    },
    set(val) { }
});

const groupNamesDragEndEvent = async () => {
    await AutoWeb.autoPromise('saveGroupSchemeNames', groupSchemeNames.value);
}

const schemeListDragEndEvent = async () => {
    const toSave = groupedSchemeListToGroupSchemeNames(groupedSchemeList.value);
    await AutoWeb.autoPromise('saveGroupSchemeNames', toSave);
}


</script>

<template>
    <Nav name="方案管理" />
    <div class="container">
        <FixedCollapse v-model="collapseVal">
            <draggable :force-fallback="true" v-model="groupSchemeNames" item-key="groupName"
                handle=".drag-group-handle" v-bind="dragOptions" @update="groupNamesDragEndEvent"
                :group="{ name: 'groupNames' }">
                <template #item="{ element: groupSchemeName, index }">
                    <FixedCollapseItem :name="groupSchemeName.groupName">
                        <template #header>{{ groupSchemeName.groupName }}</template>
                        <template #header-icon-left>
                            <span class="drag-group-handle"><el-icon>
                                    <Sort />
                                </el-icon></span>
                        </template>
                        <template #content>
                            <draggable :force-fallback="true" v-model="groupedSchemeList[groupSchemeName.groupName]"
                                item-key="schemeName" handle=".drag-item-card-scheme-handle" v-bind="dragOptions"
                                @update="schemeListDragEndEvent" class="drag-item-card-scheme-container"
                                :group="{ name: groupSchemeName.groupName }">
                                <template #item="{ element: scheme, index }">
                                    <div class="drag-item-card-scheme">
                                        <SchemeItemCard :scheme="scheme" :group-name="groupSchemeName.groupName">
                                            <template #operation-left>
                                                <el-text @click="starBtnEvent(scheme)" style="margin-right: 10px;">
                                                    <el-icon>
                                                        <!-- 默认的实心五星图标比空心小一圈，让它俩叠加以达到视觉大小一致 -->
                                                        <Star style="position: absolute; top: 0; left: 0" />
                                                        <StarFilled v-if="scheme.star" />
                                                    </el-icon>
                                                </el-text>
                                                <el-text style="margin-right: 10px"
                                                    class="drag-item-card-scheme-handle">
                                                    <el-icon>
                                                        <Sort />
                                                    </el-icon>
                                                </el-text>
                                            </template>
                                        </SchemeItemCard>
                                    </div>
                                </template>
                                <template #footer>
                                    <div class="item-card-addscheme-container">
                                        <ItemCard>
                                            <div class="item-card-addscheme"
                                                @click="addSchemeItemEvent(groupSchemeName.groupName)">
                                                <el-text><el-icon>
                                                        <Plus />
                                                    </el-icon> 添加方案</el-text>
                                            </div>
                                        </ItemCard>
                                    </div>
                                </template>
                            </draggable>
                        </template>
                    </FixedCollapseItem>
                </template>
            </draggable>
        </FixedCollapse>
        <SchemeEditDialog v-if="newSchemeEditDialogShown" v-model="newSchemeEditDialogShown" :scheme="newScheme"
            @confirm="addSchemeConfirmEvent" type="add" />
    </div>
</template>

<style scoped>
@media screen and (max-width: 640px) {
    .drag-item-card-scheme,
    .item-card-addscheme-container {
        width: 50%;
    }
}
@media screen and (min-width: 640px) {
    .drag-item-card-scheme,
    .item-card-addscheme-container {
        width: 33%;
    }
}
.container {
    width: 100%;
    height: calc(100% - 46px);
    display: flex;
}
.item-card-addscheme-container {
    display: flex;
}
.item-card-addscheme {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
}

.drag-item-card-scheme-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.drag-item-card-scheme {
    display: flex;
}

.drag-group-handle {
    margin-right: 10px;
}
</style>
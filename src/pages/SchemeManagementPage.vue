<script setup lang='ts'>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { AutoWeb } from '@/tools/AutoWeb';
import Nav from '@/components/Nav.vue';
import { FixedCollapse, FixedCollapseItem } from '@/components/FixedCollapse';
import type { GroupSchemeName, Scheme } from '@/tools/declares';
import SchemeItemCard from '@/components/SchemeItemCard.vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { deepClone, getGroupColor, groupedSchemeListToGroupSchemeNames, groupSchemeList, simplifySchemeList } from '@/tools/tools';
import { Plus, Sort, Star, StarFilled, More, Expand, Fold, View, Hide, Folder, FolderOpened } from '@element-plus/icons-vue'
import SchemeEditDialog from '@/components/SchemeEditDialog/SchemeEditDialog.vue';
import { ElMessage } from 'element-plus';
import type { onConfirmOption } from '@/components/SchemeEditDialog';
import draggable from '@marshallswain/vuedraggable';
import ImportSchemeDialog from '@/components/ImportSchemeDialog.vue';


const config = ref<{
    showHiddenGroup: boolean,
    currentCollapseVal: string,
    collapseAccordion: boolean,
    hiddenUnStar: boolean,
}>(JSON.parse(localStorage.getItem('store.schemeManagement') || '{}'));
watch(config, (newVal, oldVal) => {
    localStorage.setItem('store.schemeManagement', JSON.stringify(newVal));
}, { deep: true });
watch(() => config.value.collapseAccordion, (newVal) => {
    nextTick(() => {
        const vals = collapseVal.value.split(',');
        collapseVal.value = vals[vals.length - 1];
    });
});
const collapseVal = ref('');
watch(collapseVal, (newVal) => {
    config.value.currentCollapseVal = newVal;
});

const schemeList = ref<Scheme[]>([]);
const groupSchemeNames = ref<GroupSchemeName[]>([]);
const groupedSchemeList = ref<Record<string, Scheme[]>>({});
const exportMode = ref<boolean>(false);
const exportDialogStr = ref<string>('');
const exportDialogShown = ref<boolean>(false);
const importDialogShown = ref<boolean>(false);

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
        ElMessage.error(saveResult.message);
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
const showHideGroup = async (e: MouseEvent, groupNameStr: string, hidden: boolean) => {
    e.stopPropagation();
    e.preventDefault();
    const groupName = groupSchemeNames.value.find(item => item.groupName === groupNameStr);
    groupName.hidden = hidden;
    await AutoWeb.autoPromise('saveGroupSchemeNames', groupSchemeNames.value);
    // loadData();
}


onMounted(async () => {
    await loadData();
    if (typeof config.value.currentCollapseVal === 'undefined') {
        collapseVal.value = groupSchemeNames.value[0].groupName;
    } else {
        collapseVal.value = config.value.currentCollapseVal;
    }
    globalEmmiter.on('Event.SchemeItemCard.Operation', (option) => {
        loadData();
    });
});


onUnmounted(() => {
    globalEmmiter.off('Event.SchemeItemCard.Operation')
});

const switchExportMode = () => {
    exportMode.value = !exportMode.value;
    if (exportMode.value) {
        ElMessage.info('选择需要导出的方案后点击下方导出按钮进行导出。')
    }
}

const exportBtnEvent = async () => {
    const toExportMap: Record<string, Scheme> = {};
    Object.keys(groupedSchemeList.value).forEach(groupName => {
        groupedSchemeList.value[groupName].forEach(scheme => {
            if (scheme.export) {
                toExportMap[scheme.schemeName] = scheme;
            }
        });
    });
    const toExport = Object.keys(toExportMap).map(schemeName => toExportMap[schemeName]);
    exportDialogStr.value = JSON.stringify(await simplifySchemeList(deepClone(toExport)));
    exportDialogShown.value = true;
}


</script>

<template>
    <Nav name="方案管理">
        <template #extra>
            <el-button link @click="switchExportMode">
                <el-icon>
                    <Expand />
                </el-icon>
            </el-button>
            <el-button link @click="importDialogShown = true">
                <el-icon>
                    <Fold />
                </el-icon>
            </el-button>
            <span style="margin-right: 10px">
                <el-popover placement="bottom" trigger="click">
                    <template #reference>
                        <el-button link><el-icon>
                                <More />
                            </el-icon></el-button>
                    </template>
                    <template #default>
                        <el-checkbox v-model="config.showHiddenGroup" label="显示隐藏的分组" size="small"
                            style="width: 100%" />
                        <el-checkbox v-model="config.hiddenUnStar" label="隐藏未收藏的方案" size="small" style="width: 100%" />
                        <el-checkbox v-model="config.collapseAccordion" label="手风琴模式" size="small"
                            style="width: 100%" />
                    </template>
                </el-popover>
            </span>
        </template>
    </Nav>
    <div class="container">
        <FixedCollapse v-model="collapseVal" :multipart="!config.collapseAccordion" :fix-header="true">
            <draggable :force-fallback="true" v-model="groupSchemeNames" item-key="groupName"
                handle=".drag-group-handle" v-bind="dragOptions" @update="groupNamesDragEndEvent"
                :group="{ name: 'groupNames' }">
                <template #item="{ element: groupSchemeName, index }">
                    <FixedCollapseItem :header-icon="Folder" :header-icon-active="FolderOpened"
                        :show-right-arrow-icon="true" :prevColor="getGroupColor(groupSchemeName.groupName)"
                        v-if="(!config.showHiddenGroup && !groupSchemeName.hidden) || config.showHiddenGroup"
                        :name="groupSchemeName.groupName">
                        <template #header><el-text size="small">{{ groupSchemeName.groupName }}</el-text></template>
                        <template #header-icon-left>
                            <!-- 好像没有阻止#reference点击事件冒泡的手段，需要手动控制显示与关闭，有点麻烦，暂时不做二次确认 -->
                            <!-- <el-popconfirm title="确认是否隐藏" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="showHideGroup($event, groupSchemeName.groupName, !groupSchemeName.hidden)">
                                <template #reference> -->
                            <el-text size="small" class="group-show-hide-btn"
                                @click.stop="showHideGroup($event, groupSchemeName.groupName, !groupSchemeName.hidden)"><el-icon>
                                    <View v-if="!groupSchemeName.hidden" />
                                    <Hide v-else />
                                </el-icon></el-text>
                            <!-- </template>
            </el-popconfirm> -->
                            <el-text size="small" class="add-scheme-btn"
                                @click.stop="addSchemeItemEvent(groupSchemeName.groupName)"><el-icon>
                                    <Plus />
                                </el-icon></el-text>
                            <el-text size="small" class="drag-group-handle"><el-icon>
                                    <Sort />
                                </el-icon></el-text>
                        </template>
                        <template #content>
                            <draggable :force-fallback="true" v-model="groupedSchemeList[groupSchemeName.groupName]"
                                item-key="schemeName" handle=".drag-item-card-scheme-handle" v-bind="dragOptions"
                                @update="schemeListDragEndEvent" class="drag-item-card-scheme-container"
                                :group="{ name: groupSchemeName.groupName }">
                                <template #item="{ element: scheme, index }">
                                    <div class="drag-item-card-scheme"
                                        v-if="!config.hiddenUnStar || (config.hiddenUnStar && scheme.star)">
                                        <SchemeItemCard :show-check-box="exportMode" :scheme="scheme"
                                            :group-name="groupSchemeName.groupName">
                                            <template #operation-left>
                                                <el-text size="small" @click.stop="starBtnEvent(scheme)"
                                                    style="margin-right: 10px;">
                                                    <el-icon>
                                                        <!-- 默认的实心五星图标比空心小一圈，让它俩叠加以达到视觉大小一致 -->
                                                        <Star style="position: absolute; top: 0; left: 0" />
                                                        <StarFilled v-if="scheme.star" />
                                                    </el-icon>
                                                </el-text>
                                                <el-text size="small" style="margin-right: 10px"
                                                    class="drag-item-card-scheme-handle">
                                                    <el-icon>
                                                        <Sort />
                                                    </el-icon>
                                                </el-text>
                                            </template>
                                        </SchemeItemCard>
                                    </div>
                                </template>
                                <!-- <template #footer>
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
                                </template> -->
                            </draggable>
                        </template>
                    </FixedCollapseItem>
                </template>
            </draggable>
        </FixedCollapse>
        <SchemeEditDialog v-if="newSchemeEditDialogShown" v-model="newSchemeEditDialogShown" :scheme="newScheme"
            @confirm="addSchemeConfirmEvent" type="add" />
        <div v-if="exportMode" style="position: fixed; right: 10px; bottom: 10px; z-index: 1;">
            <el-button type="primary" @click="exportBtnEvent" size="small">导出</el-button>
        </div>
        <el-dialog v-model="exportDialogShown" align-center width="70%">
            <el-input @focus="($event: FocusEvent) => ($event.currentTarget as HTMLInputElement).select()"
                style="height: 50vh" size="small" type="textarea" v-model="exportDialogStr" />
            <el-button type="primary" size="small" style="position: absolute; right: 0; bottom: 0;"
                @click="AutoWeb.autoPromise('copyToClip', exportDialogStr)">复制</el-button>
        </el-dialog>
        <ImportSchemeDialog v-model="importDialogShown" />
    </div>
</template>

<style scoped>
@media screen and (max-width: 360px) {

    .drag-item-card-scheme,
    .item-card-addscheme-container {
        width: 100%;
    }
}

@media screen and (min-width: 360px) and (max-width: 640px) {

    .drag-item-card-scheme,
    .item-card-addscheme-container {
        width: 50%;
    }
}

@media screen and (min-width: 640px) {

    .drag-item-card-scheme,
    .item-card-addscheme-container {
        width: 33.33%;
    }
}

.container {
    width: 100%;
    height: calc(100% - 46px);
    display: flex;
    background-color: #f4f5f7;
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

.group-show-hide-btn,
.add-scheme-btn {
    margin-right: 10px;
}

.drag-group-handle {
    margin-right: 10px;
}
</style>
<style>
.container .el-textarea__inner {
    height: 100%;
}

.el-page-header__extra .el-button+.el-button {
    margin-left: 0px
}
</style>
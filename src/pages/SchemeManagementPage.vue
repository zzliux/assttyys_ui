<script setup lang='ts'>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { AutoWeb } from '@/tools/AutoWeb';
import Nav from '@/components/Nav.vue';
import { FixedCollapse, FixedCollapseItem } from '@/components/FixedCollapse';
import type { GroupSchemeName, Scheme, SchemePageConfig } from '@/tools/declares';
import SchemeItemCard from '@/components/SchemeItemCard.vue';
import globalEmmiter from '@/tools/GlobalEventBus';
import { deepClone, getCommonConfig, getGroupColor, groupedSchemeListToGroupSchemeNames, groupSchemeList, simplifySchemeList, throttle } from '@/tools/tools';
import { Plus, Sort, Star, StarFilled, More, Expand, Fold, View, Hide, Folder, FolderOpened, Search } from '@element-plus/icons-vue'
import SchemeEditDialog from '@/components/SchemeEditDialog/SchemeEditDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { onConfirmOption } from '@/components/SchemeEditDialog';
import draggable from '@marshallswain/vuedraggable';
import ImportSchemeDialog from '@/components/ImportSchemeDialog.vue';
import VersionDialog from '@/components/VersionDialog.vue';
import { pinyin } from "pinyin-pro";


const config = ref<SchemePageConfig>(JSON.parse(localStorage.getItem('store.schemeManagement') || '{}'));
watch(config, (newVal, oldVal) => {
    localStorage.setItem('store.schemeManagement', JSON.stringify(newVal));
    globalEmmiter.emit('Event.SchemeManagementPage.configUpdate', newVal);
}, { deep: true });
watch(() => config.value.collapseAccordion, (newVal) => {
    nextTick(() => {
        const vals = groupCollapseVal.value.split(',');
        groupCollapseVal.value = vals[vals.length - 1];
    });
});
const groupCollapseVal = ref('');
watch(groupCollapseVal, (newVal) => {
    config.value.currentCollapseVal = newVal;
});

const schemeList = ref<Scheme[]>([]);
const groupSchemeNames = ref<GroupSchemeName[]>([]);
const groupedSchemeList = ref<Record<string, Scheme[]>>({});
const exportMode = ref<boolean>(false);
const exportDialogStr = ref<string>('');
const exportDialogShown = ref<boolean>(false);
const importDialogShown = ref<boolean>(false);
const versionDialogRef = ref<InstanceType<typeof VersionDialog>>();

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
const addSchemeItemEvent = async (groupName: string) => {
    newScheme.value = {
        id: schemeList.value.reduce((maxId, scheme) => scheme.id > maxId ? scheme.id : maxId, 0) + 1,
        schemeName: '',
        star: false,
        list: [],
        groupNames: [groupName],
        config: {},
        commonConfig: await getCommonConfig(),
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
        groupCollapseVal.value = groupSchemeNames.value[0].groupName;
    } else {
        groupCollapseVal.value = config.value.currentCollapseVal;
    }
    globalEmmiter.on('Event.SchemeItemCard.Operation', (option) => {
        loadData();
    });




    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) return;
    const webloaded = sessionStorage.getItem('webloaded');
    if (webloaded) return;

    await AutoWeb.autoPromise('webloaded');
    sessionStorage.setItem('webloaded', 'true');
    versionDialogRef.value.open(true);
    const appInfos = await AutoWeb.autoPromise('getAppInfo');
    if (appInfos?.msg) {
        ElMessageBox.alert(appInfos?.msg, '提示')
    }
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

const searchStr = ref<string>('');
const searchInputShown = ref<boolean>(false);
const highLights = ref<{ groupName: string, schemeName: string }[]>(); // 本来想用set的，怕不同环境对set的有序遍历的支持不一样，改为用数组手动控制
const currentHighLight = ref<{ groupName: string, schemeName: string }>();
const serchKeyEvent = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    searchInputEvent(e.shiftKey, true);
}
const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key !== ' ') return;
    searchInputEvent(e.shiftKey, true);
    e.preventDefault();
};

// 返回是否能用str2搜索str1，目前仅考虑str1.includes(str2)
const strIncludeLike = (str1: string, str2: string) => {
    const sflagPinyin = getPinyin(str1.toLowerCase());  // 获取拼音
    const searchPinyin = getPinyin(str2.toLowerCase());  // 获取输入拼音
    return sflagPinyin.includes(searchPinyin) || str1.includes(str2);
}

/**
 * 
 * @param prev 是否向前搜索
 * @param flag true时表示执行高亮切换
 */
const searchInputEvent = throttle((prev?: boolean, flag?: boolean) => {
    if (!searchStr.value) return;
    highLights.value = [];
    // 不能用schemeList，只能用groupSchemeNames，这样又得对分组、方案同时搜索与保存
    groupSchemeNames.value.forEach(group => {
        if (!config.value.showHiddenGroup && group.hidden) return;
        group.schemeNames.forEach(schemeName => {
            if (strIncludeLike(schemeName, searchStr.value)) {
                const index = highLights.value.findIndex(item => item.groupName === group.groupName && item.schemeName === schemeName);
                if (-1 === index) {
                    highLights.value.push({
                        groupName: group.groupName,
                        schemeName
                    });
                }
            }
        });
    });
    const index = highLights.value.findIndex(item => item.groupName === currentHighLight.value?.groupName && item.schemeName === currentHighLight.value?.schemeName);
    if (!flag) {
        currentHighLight.value = highLights.value[0];
    } else {
        currentHighLight.value = highLights.value[(index + (prev ? highLights.value.length - 1 : 1)) % highLights.value.length];
    }

    if (config.value.collapseAccordion) {
        if (currentHighLight.value) {
            groupCollapseVal.value = currentHighLight.value.groupName
        }
    } else {
        const arr = groupCollapseVal.value.split(',');
        const index = arr.findIndex(str => str === currentHighLight.value?.groupName);
        if (-1 === index && currentHighLight.value) {
            arr.push(currentHighLight.value.groupName);
            groupCollapseVal.value = arr.join(',');
        }
    }
    const eleAll: HTMLElement[] = [].slice.call(document.querySelectorAll('[sflag]'));
    let targetEle = null;
    for (let ele of eleAll) {
        ele.parentElement.parentElement.style.backgroundColor = 'inherit';
        const sflag = ele.getAttribute('sflag');
        if (sflag === `${currentHighLight.value?.groupName}-${currentHighLight.value?.schemeName}`) {
            targetEle = ele;
        } else if (-1 !== highLights.value.findIndex(item => `${item.groupName}-${item.schemeName}` === sflag)) {
            ele.parentElement.parentElement.style.backgroundColor = '#ffffe0'
        }
    }
    if (!targetEle) return;

    targetEle.parentElement.parentElement.style.backgroundColor = '#add8e6'
    setTimeout(() => {
        targetEle.scrollIntoView({
            behavior: "auto",
            block: "center",
        });
    })
}, 20)

const getPinyin = (str: string): string => {
    return pinyin(str, {
        toneType: 'none',  // 不带声调
        type: 'array'      // 返回拼音数组
    }).join('');
}


</script>

<template>
    <Nav name="方案管理">
        <template #extra>
            <el-input class="search-box" v-model="searchStr" size="small"
                :style="{ width: searchInputShown ? '110px' : '24px' }" placeholder="请输入关键字" :prefix-icon="Search"
                @focus="searchInputShown = true" @blur="searchInputShown = false" @keydown="handleKeydown"
                @keyup="serchKeyEvent" @input="searchInputEvent(false)" />
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
                        <el-checkbox v-model="config.scrollSettle" label="常驻滚动条" size="small" style="width: 100%" />
                    </template>
                </el-popover>
            </span>
        </template>
    </Nav>
    <div class="container">
        <FixedCollapse v-model="groupCollapseVal" :multipart="!config.collapseAccordion" :fix-header="true"
            :pre-render-content="true">
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
                            <el-text size="small" class="group-show-hide-btn"
                                @click.stop="showHideGroup($event, groupSchemeName.groupName, !groupSchemeName.hidden)"><el-icon>
                                    <View v-if="!groupSchemeName.hidden" />
                                    <Hide v-else />
                                </el-icon></el-text>
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
                            </draggable>
                        </template>
                    </FixedCollapseItem>
                </template>
            </draggable>
        </FixedCollapse>
        <SchemeEditDialog v-if="newSchemeEditDialogShown" v-model="newSchemeEditDialogShown" :scheme="newScheme"
            @confirm="addSchemeConfirmEvent" type="add" />
        <div v-if="exportMode" style="position: fixed; right: 16px; bottom: 16px; z-index: 1;">
            <el-button type="primary" @click="exportBtnEvent" size="medium">导出</el-button>
        </div>

        <el-dialog v-model="exportDialogShown" align-center width="70%" :show-close="false">
            <el-input @focus="($event: FocusEvent) => ($event.currentTarget as HTMLInputElement).select()"
                style="height: 50vh" size="medium" type="textarea" v-model="exportDialogStr" />
            <el-button type="primary" size="medium" style="position: absolute; right: 16px; bottom: 16px;"
                @click="AutoWeb.autoPromise('copyToClip', exportDialogStr)">复制</el-button>
            <div style="position: absolute; right: 28px; top: 5px; font-size: 20px;">
                <el-icon style="color: black;" @click="exportDialogShown = false">
                    <Close />
                </el-icon>
            </div>
        </el-dialog>
        <ImportSchemeDialog v-model="importDialogShown" />
        <VersionDialog ref="versionDialogRef" />
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

::v-deep(.el-page-header__extra .el-input.search-box) {
    transition: width .1s ease-in-out;
}
::v-deep(.el-page-header__extra .el-input__wrapper) {
    border: none !important;
}
::v-deep(.el-page-header__extra .el-input__wrapper.is-focus) {
    border-bottom: 1px solid var(--el-color-primary) !important;
}
::v-deep(.el-page-header__extra .el-input__prefix) {
    color: inherit;
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
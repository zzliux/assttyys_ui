<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Nav from "../components/Nav.vue";
import type { CommonConfigItem, Func, FuncView, GroupSchemeName, Scheme } from "@/tools/declares";
import { useRoute } from "vue-router";
import { AutoWeb } from "@/tools/AutoWeb";
import { deepClone } from "@/tools/tools";
import { FixedCollapse, FixedCollapseItem } from "@/components/FixedCollapse";
import draggable from '@marshallswain/vuedraggable';
import { Sort, Setting, Wallet, Promotion } from '@element-plus/icons-vue';
import { ElMessage } from "element-plus";

const $route = useRoute();
const groupSchemeNames = ref<GroupSchemeName[]>();
let defaultFuncList: Func[] = [];
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
const commonConfigDialogShown = ref<boolean>(false);


onMounted(async () => {
    defaultFuncList = await AutoWeb.autoPromise('getFuncList');
    groupSchemeNames.value = [
        { groupName: '__内置方案__', hidden: false, schemeNames: ['__停止脚本__', '__返回上个方案__'] }
        , ...await AutoWeb.autoPromise('getGroupSchemeNames')];
    commonConfig.value = await AutoWeb.autoPromise('getCommonConfig');
    await loadData();
});

const schemeOld = ref<Scheme>();
const scheme = ref<Scheme>();
const commonConfig = ref<CommonConfigItem[]>();
const funcList = ref<FuncView[]>([]);

// 修改为在loaddata中手动更新变化，而不是监听数据变化
// watch(() => scheme.value, (newScheme) => {
//     // 1. 监听是某个功能否启用：scheme.list
//     // 2. 监听公共配置是否变化：scheme.commonConfig
//     // 3. 监听各功能配置是否变化：scheme.config
//     watchSchemeEvent(newScheme);
// }, { deep: true });

const watchSchemeEvent = (newScheme: Scheme) => {
    // 1. 监听是某个功能否启用：scheme.list
    // 2. 监听公共配置是否变化：scheme.commonConfig
    // 3. 监听各功能配置是否变化：scheme.config
    funcList.value = defaultFuncList.map(func => {
        const config = deepClone(func.config || []);
        config.forEach(group => {
            group.config.forEach(configItem => {
                if (typeof newScheme.config?.[func.id]?.[configItem.name] !== 'undefined') {
                    configItem.value = newScheme.config?.[func.id]?.[configItem.name];
                } else {
                    configItem.value = configItem.default
                }
            })
        });
        return {
            ...deepClone(func),
            config: config,
            enabled: newScheme.list.includes(func.id),
        }
    });
    commonConfig.value.forEach(group => {
        group.config?.forEach(configItem => {
            if (typeof newScheme.commonConfig?.[configItem.name] !== 'undefined') {
                configItem.value = newScheme.commonConfig?.[configItem.name] as number;
            } else {
                configItem.value = configItem.default
            }
        });
    });
    reSort();
}

const reSort = () => {
    funcList.value.sort((a, b) => {
        if (a.enabled && !b.enabled) {
            return -1;
        } else if (!a.enabled && b.enabled) {
            return 1;
        } else if (a.enabled && a.enabled) {
            return scheme.value.list.indexOf(a.id) - scheme.value.list.indexOf(b.id);
        } else {
            return 0;
        }
    });
}

// TODO 1. 监听commonConfig变化反向更新
const commonConfigChangeEvent = () => {
    commonConfig.value.forEach(group => {
        group.config?.forEach(configItem => {
            scheme.value.commonConfig[configItem.name] = configItem.value
        });
    });
}

// TODO 2. 监听funcList[x].enabled变化反向更新
const enabledChangeEvent = () => {
    scheme.value.list = funcList.value.filter(item => item.enabled).map(item => item.id);
    reSort();
}

// TODO 3. 监听funcList[x].config变化反向更新
const configChangeEvent = (funcItemView: FuncView) => {
    if (!scheme.value.config) {
        scheme.value.config = {};
    }
    if (!scheme.value.config[funcItemView.id]) {
        scheme.value.config[funcItemView.id] = {};
    }
    funcItemView.config?.forEach(group => {
        group.config?.forEach(configItem => {
            scheme.value.config[funcItemView.id][configItem.name] = configItem.value;
        })
    });
}


const loadData = async () => {
    scheme.value = await AutoWeb.autoPromise('getScheme', $route.query.schemeName as string);
    schemeOld.value = deepClone(scheme.value);
    watchSchemeEvent(scheme.value);
}
const saveScheme = async (flag?: boolean) => {
    const result = await AutoWeb.autoPromise('saveScheme', {
        oldScheme: schemeOld.value,
        newScheme: scheme.value,
        type: 'modify'
    });
    if (result.error) {
        ElMessage.error(result.message);
        return;
    }
    await AutoWeb.autoPromise('setCurrentScheme', $route.query.schemeName as string);
    !flag && ElMessage.success('保存成功');
}

const runScheme = async () => {
    await saveScheme(true);
    await AutoWeb.autoPromise('startScript');
}

</script>
<template>
    <Nav :name="`功能管理：${$route.query.schemeName}`">
        <template #extra>
            <span style="margin-right: 10px">
                <el-button link @click="commonConfigDialogShown = true"><el-icon>
                        <Setting />
                    </el-icon></el-button>
            </span>
        </template>
    </Nav>
    <div class="container">
        <FixedCollapse :multipart="false" fix-header>
            <draggable :force-fallback="true" v-model="funcList" item-key="schemeName"
                handle=".drag-item-card-scheme-handle" v-bind="dragOptions" @update="enabledChangeEvent">
                <template #item="{ element: item, index }">
                    <FixedCollapseItem :name="`${item.id} ${item.name}`">
                        <template #header>
                            <div>
                                <div style="margin-bottom: 5px;">
                                    <el-text size="small" style="margin-bottom: 5px; font-weight: bold;">
                                        {{ item.id }} {{ item.name }} {{ item.config?.length > 0 ? '*' : '' }}
                                    </el-text>
                                </div>
                                <div><el-text size="small" type="info">{{ item.desc }}</el-text></div>
                            </div>
                        </template>
                        <template #header-icon-left>
                            <div style="display: flex;">
                                <div class="drag-item-card-scheme-handle">
                                    <el-text size="small">
                                        <el-icon>
                                            <Sort />
                                        </el-icon>
                                    </el-text>
                                </div>
                                <div class="switch-box"><el-switch v-model="item.enabled" @click.stop size="small"
                                        @change="enabledChangeEvent" /></div>
                            </div>
                        </template>
                        <template v-if="item.config?.length > 0" #content>
                            <el-form label-position="left" :model="item" label-width="70%" size="small"
                                class="form-container">
                                <div style="display: block; border-bottom: 1px solid #dcdfe6;"
                                    v-for="group in item.config">
                                    <div style="display: block;"><el-text size="small" type="info">{{ group.desc
                                            }}</el-text>
                                    </div>
                                    <el-form-item v-for="configItem in group.config" :label="configItem.desc"
                                        size=small>
                                        <el-select @change="configChangeEvent(item)" v-if="configItem.type === 'list'"
                                            size="small" v-model="configItem.value">
                                            <el-option v-for="dataItem in configItem.data" :key="dataItem"
                                                :label="dataItem" :value="dataItem" />
                                        </el-select>
                                        <el-switch @change="configChangeEvent(item)"
                                            v-else-if="configItem.type === 'switch'" v-model="configItem.value" />
                                        <el-input @input="configChangeEvent(item)"
                                            v-else-if="configItem.type === 'text'" v-model="configItem.value" />
                                        <el-input @input="configChangeEvent(item)"
                                            v-else-if="configItem.type === 'integer' || configItem.type === 'number'"
                                            v-model="configItem.value" />
                                        <el-select @change="configChangeEvent(item)"
                                            v-else-if="configItem.type === 'scheme'" size="small"
                                            v-model="configItem.value" placeholder="请选择方案">
                                            <el-option-group v-for="group in groupSchemeNames" :key="group.groupName"
                                                :label="group.groupName">
                                                <el-option v-for="schemeName in group.schemeNames" :key="schemeName"
                                                    :label="schemeName" :value="schemeName" />
                                            </el-option-group>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </template>
                    </FixedCollapseItem>
                </template>
            </draggable>
        </FixedCollapse>
        <div style="position: fixed; right: 10px; bottom: 10px; z-index: 1;">
            <el-button style="padding: 10px 10px;" type="primary" @click="saveScheme" size="small"><el-icon><Wallet /></el-icon>&nbsp;保存</el-button>
            <el-button style="padding: 10px 10px; margin-left: 5px" type="warning" @click="runScheme" size="small"><el-icon><Promotion /></el-icon>&nbsp;启动</el-button>
        </div>
    </div>
    <el-dialog v-model="commonConfigDialogShown" align-center>
        <el-form size="small" v-for="group in commonConfig">
            <el-form-item v-for="configItem in group.config" :key="configItem.name" :label="configItem.desc">
                <el-input v-if="configItem.type === 'integer'" type="number" v-model="configItem.value"
                    @change="commonConfigChangeEvent" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<style scoped>
.container {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 46px);
    display: flex;
    background-color: #f4f5f7;
    flex-wrap: wrap;
}

.form-container {
    width: 100%;
    padding: 5px 10px;
    /* max-height: 300px; */
    overflow: auto;
}

.drag-item-card-scheme-handle,
.switch-box {
    display: flex;
    align-items: center;
    height: 24px;
}

.drag-item-card-scheme-handle {
    margin-right: 10px;
}
</style>

<style>
/* .fixedCollapseItem-contentInner .el-form-item__content {
    min-width: 100px;
} */
.fixedCollapseItem-contentInner .el-form-item__label {
    height: initial;
}
</style>
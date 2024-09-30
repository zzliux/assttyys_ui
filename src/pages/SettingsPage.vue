<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import { AutoWeb } from '@/tools/AutoWeb';
import type { SettingItem } from '@/tools/declares';
import { onMounted, ref } from 'vue';
// TODO 1 关于项目
// TODO 2 关联启动应用
// TODO 3 查看日志
// TODO 4 全局重置


const settingList = ref<SettingItem[]>();

onMounted(async () => {
    await loadData();
})

const loadData = async () => {
    settingList.value = await AutoWeb.autoPromise('getSettings');
}

const itemChangeEvent = async (item: SettingItem) => {
    await AutoWeb.autoPromise('saveSetting', item);
    await loadData();
}

</script>
<template>
    <Nav name="设置">
    </Nav>
    <div class="container">
        <div class="item-container" v-for="item in settingList" :key="item.name">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>{{ item.desc }}</el-text></span>
                <span class="item-header-right">
                    <el-switch size="small" v-if="item.stype === 'switch' || !item.stype" v-model="item.enabled"
                        @change="itemChangeEvent(item)" />
                    <el-select v-else-if="item.stype === 'list'" v-model="item.value" :size="'small'">
                        <el-option v-for="option in item.data" :key="option" :label="option" :value="option"
                            @change="itemChangeEvent(item)" />
                    </el-select>
                    <el-input v-else-if="item.stype === 'text'" v-model="item.value" :size="'small'"
                        @blur="itemChangeEvent(item)" />
                </span>
            </div>
        </div>
        <div class="item-container" style="margin-top: 10px">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>关于项目</el-text></span>
            </div>
        </div>
        <div class="item-container" style="margin-top: 10px">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>关联启动应用</el-text></span>
            </div>
        </div>
        <div class="item-container">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>查看日志</el-text></span>
            </div>
        </div>
        <div class="item-container">
            <div class="item-header">
                <span class="item-header-text"><el-text size=small>全局重置</el-text></span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 46px);
    background-color: #f4f5f7;
    flex-wrap: wrap;
}

.item-header {
    border-top: 1px solid #ebeef5;
    /* border-bottom: 1px solid #ebeef5; */
    position: relative;
    width: 100%;
    padding: 5px 10px 5px 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    z-index: 1;
    min-height: 35.6px;
}

.item-container {
    width: 100%;
}

.item-header-text,
.item-header-right {
    display: flex;
    transition: all .2s ease-in-out;
    margin-right: 10px;
    justify-content: flex-end;
}

.item-header-right {
    min-width: 120px;
}
</style>

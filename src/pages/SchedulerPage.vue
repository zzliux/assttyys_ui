<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import { AutoWeb } from '@/tools/AutoWeb';
import type { JobOptions } from '@/tools/declares';
import { onMounted, ref } from 'vue';
import ItemCard from '@/components/ItemCard.vue';
import { VideoPlay } from '@element-plus/icons-vue';
import FixedCollapse from '@/components/FixedCollapse/FixedCollapse.vue';
import FixedCollapseItem from '@/components/FixedCollapse/FixedCollapseItem.vue';

const scheduleList = ref<JobOptions[]>([]);
onMounted(async () => {
    scheduleList.value = await AutoWeb.autoPromise('getScheduleList');
});

</script>
<template>
    <Nav name="定时任务" />
    <div class="container">
        <FixedCollapse :multipart="false">
            <FixedCollapseItem v-for="(item, index) in scheduleList" :name="`${item.id} ${item.name}`">
                <template #header>
                    <div>
                        <div style="margin-bottom: 5px;">
                            <el-text
                                :type="`${Date.now() - new Date(item.nextDate).getTime() > 3 * 60 * 1000 ? 'danger' : ''}`"
                                size="small" style="margin-bottom: 5px; font-weight: bold;">
                                {{ item.id }} {{
                                    item.name }}
                            </el-text>
                        </div>
                        <div><el-text size="small" type="info">{{ item.desc }}</el-text></div>
                        <div><el-text size="small" type="info">上次执行开始时间：{{ item.lastRunTime }}</el-text></div>
                        <div><el-text size="small" type="info">上次执行结束时间：{{ item.lastStopTime }}</el-text></div>
                        <div><el-text size="small" type="info">下次执行时间：{{ item.nextDate }}</el-text></div>
                    </div>
                </template>
                <template #header-icon-left>
                    <div style="display: flex;">
                        <div @click.stop="void 0"
                            style="display: flex; align-items: center; height: 24px; margin-right: 10px; font-size: 16px;">
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                        </div>
                        <div style="display: flex; align-items: center; height: 24px"><el-switch v-model="item.checked"
                                @click.stop="void 0" size="small" /></div>
                    </div>
                </template>
                <template #content>
                    待做
                </template>
            </FixedCollapseItem>
        </FixedCollapse>
    </div>
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
</style>

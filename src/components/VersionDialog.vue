<script lang="ts" setup>
import { AutoWeb } from '@/tools/AutoWeb';
import { ref } from 'vue';


const dialogShown = ref<boolean>(false);
const versionList = ref<{ version: string, desc: string }[]>([]);
const open = async () => {
    dialogShown.value = true;
    versionList.value = (await AutoWeb.autoPromise('versionInfo')).versionList.reverse();
}

const close = async () => {
    dialogShown.value = false;
}

defineExpose({ open, close });
</script>

<template>
    <el-dialog v-model="dialogShown" :close-on-click-modal="false" fullscreen>
        <div class="version-dialog-container">
            <div v-for="item in versionList">
                <div class="version-item">
                    <div class="version-item-title">
                        {{ item.version }}
                    </div>
                    <div class="version-item-desc" v-html="item.desc.replace(/\n/g, '<br/>')">
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<style scoped>
.version-dialog-container {
    max-height: calc(100vh - 42px);
    overflow: auto;
}

.version-item {
    padding: 10px 10px 0px 10px;
}

.version-item-title {
    font-weight: bold;
}

.version-item-desc {
    padding-left: 10px;
    /* white-space: pre-wrap; */
}
</style>

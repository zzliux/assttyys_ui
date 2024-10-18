<script lang="ts" setup>
import { AutoWeb } from '@/tools/AutoWeb';
import { ref } from 'vue';

const dialogShown = ref<boolean>(false);
const versionList = ref<{ version: string, desc: string }[]>([]);
const updateFlag = ref<boolean>(false);
const open = async (flag?: boolean) => {
    const { versionList: rVersionList, storeVersion } = await AutoWeb.autoPromise('versionInfo');
    if (flag) {
        versionList.value = [];
        for (let i = rVersionList.length - 1; i >= 0; i--) {
            if (rVersionList[i].version === storeVersion) {
                break;
            }
            versionList.value.push(rVersionList[i]);
        }
        if (versionList.value.length) {
            updateFlag.value = true;
            dialogShown.value = true;
        }
    } else {
        updateFlag.value = false;
        versionList.value = rVersionList.reverse();
        dialogShown.value = true;
    }

}

const close = async () => {
    dialogShown.value = false;
}

defineExpose({ open, close });
</script>

<template>
    <el-dialog v-model="dialogShown" class="version-dialog" :fullscreen="!updateFlag">
        <div class="version-dialog-container">
            <p v-if="updateFlag">已为你完成更新：</p>
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
<style>
.version-dialog .el-dialog__headerbtn {
    top: 20px;
}
</style>
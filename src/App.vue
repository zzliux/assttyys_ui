<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AutoWeb } from './tools/AutoWeb';
import VersionDialog from './components/VersionDialog.vue';
import { ElMessageBox } from 'element-plus';

const statusBarHeight = ref<number>(0);
const versionDialogRef = ref<InstanceType<typeof VersionDialog>>();

onMounted(async () => {
    statusBarHeight.value = await AutoWeb.autoPromise('getStatusBarHeight');
    await AutoWeb.autoPromise('webloaded');

    versionDialogRef.value.open(true);
    const appInfos = await AutoWeb.autoPromise('getAppInfo');
    if (appInfos?.msg) {
        ElMessageBox.alert(appInfos?.msg, '提示')
    }
});

</script>

<template>
    <div :style="`height: 100%; padding-top: ${statusBarHeight}px`">
        <RouterView />
    </div>
    <VersionDialog ref="versionDialogRef" />
</template>

<style scoped></style>
<style></style>

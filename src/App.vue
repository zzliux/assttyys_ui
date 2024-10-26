<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AutoWeb } from './tools/AutoWeb';
import VersionDialog from './components/VersionDialog.vue';

const statusBarHeight = ref<number>(0);

onMounted(async () => {
    statusBarHeight.value = await AutoWeb.autoPromise('getStatusBarHeight');
});

</script>

<template>
    <div :style="`height: 100%; padding-top: ${statusBarHeight}px`">
        <RouterView />
    </div>
</template>

<style scoped></style>
<style></style>

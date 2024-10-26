<script lang="ts" setup>
import { onMounted } from 'vue';
import router from './router';

onMounted(() => {
    setTimeout(() => {
        router.replace('/OAuth');
    }, 500)
});

</script>
<template></template>
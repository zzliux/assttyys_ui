<script lang="ts" setup>
import type { PropType } from 'vue';


const $props = defineProps({
    onClick: {
        default: () => { },
        type: Function as PropType<(event: MouseEvent) => void>,
    },
});


</script>

<template>
    <div class="item-card-item" @click="$props.onClick">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>
.item-card-item {
    padding: 8px 10px;
    transition: background-color .1s linear;
    margin: 2px 2px;
    /* background-color: #fafafa; */
    border: 1px solid #ebeef5;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: #fff;
}

.item-card-item:active {
    background-color: aliceblue;
}
</style>

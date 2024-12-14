<!-- 父的高度固定时，整体高度超出父高度，未打开的折叠面板的item则会固定在父容器的上下两个位置 -->
<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue';
import { getAncestorBySelector, throttle } from '@/tools/tools';
import type { SchemePageConfig } from '@/tools/declares';
import globalEmmiter from '@/tools/GlobalEventBus';


const fixedCollapseContainerRef = ref<HTMLDivElement>();

const $props = defineProps({
    multipart: {
        default: false,
        type: Boolean,
    },
    fixHeader: {
        default: false,
        type: Boolean
    },
    preRenderContent: {
        default: false,
        type: Boolean
    }
});
const model = defineModel<string>();

provide('fixedCollapse.instanceProps', $props);
provide('fixedCollapse.instanceModel', model);
provide('fixedCollapse.containerRef', fixedCollapseContainerRef);

const scrollSettle = ref<boolean>(false);

// 折叠面板的header超出父容器时，自动固定在父容器顶部
// 直接操作dom，不能修改子元素的类名等
const containerScrollEvent = throttle((e: Event) => {
    if (!$props.fixHeader) return;

    const containerDom = e.target as HTMLDivElement;
    const { x, y } = containerDom.getBoundingClientRect();
    const pointTarget = document.elementFromPoint(x + 1, y + 1);
    const targetContainer = getAncestorBySelector(pointTarget as HTMLElement, '.fixedCollapseItem-container');
    containerDom.querySelectorAll('.fixedCollapseItem-header').forEach((item) => {
        (item as HTMLElement).style.top = 'initial';
    });
    const target = targetContainer?.querySelector('.fixedCollapseItem-header.open') as HTMLElement;
    if (!target) return;
    let upHeight = 0;
    let children = containerDom.querySelectorAll('.fixedCollapseItem-container');
    for (let ele of children) {
        if (ele === targetContainer) break;
        upHeight += (ele as HTMLElement).getBoundingClientRect().height;
    }
    // target.style.top = `${containerDom.scrollTop - upHeight}px`;
}, 100);

onMounted(() => {
    // fixedCollapseContainerRef.value.addEventListener('scroll', containerScrollEvent);
    // scrollSettle
    const config: SchemePageConfig = JSON.parse(localStorage.getItem('store.schemeManagement') || '{}');
    scrollSettle.value = !!config.scrollSettle;
    globalEmmiter.on('Event.SchemeManagementPage.configUpdate', (config: SchemePageConfig) => {
        scrollSettle.value = !!config.scrollSettle;
    });
});

onUnmounted(() => {
    // fixedCollapseContainerRef.value?.removeEventListener('scroll', containerScrollEvent);
    globalEmmiter.off('Event.SchemeManagementPage.configUpdate');
});

</script>

<template>
    <div :class="`fixed-collapse-container ${scrollSettle ? 'scroll-settle' : ''}`"
        ref="fixedCollapseContainerRef">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>
.fixed-collapse-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.scroll-settle {
    height: 100%;
    transition: height 0.5s cubic-bezier(0.65, 0.05, 0.36, 1);
    overflow-y: scroll;
}

.scroll-settle::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0);
    border-left: 1px solid rgba(0, 0, 0, 0);
}

.scroll-settle::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}

.scroll-settle::-webkit-scrollbar-thumb {
    background-color: rgba(191, 191, 191, 191);
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    min-height: 28px;
}

.scroll-settle::webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}
</style>
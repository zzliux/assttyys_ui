<!-- 父的高度固定时，整体高度超出父高度，未打开的折叠面板的item则会固定在父容器的上下两个位置 -->
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { getAncestorBySelector, throttle, uuid } from '@/tools/tools';
import emitter from './EventBus';

const instanceNamespace = uuid();
const containerDomId = ref<string>(`fixedCollapse-${instanceNamespace}`);
const fixedCollapseContainerRef = ref<HTMLDivElement>();

const $props = defineProps({
    multipart: {
        default: false,
        type: Boolean,
    }
});

provide('fixedCollapse.instanceNameSpace', instanceNamespace);
provide('fixedCollapse.instanceProps', $props)

const model = defineModel<string>();
let emitFlag = false;
watch(model, (newVal) => {
    if (emitFlag) {
        emitFlag = false;
        return;
    }
    emitter.emit('Event.FixedCollapse.ModelUpdate', `${instanceNamespace}:${newVal}`);
});


// 折叠面板的header超出父容器时，自动固定在父容器顶部
// 直接操作dom，不能修改子元素的类名等
const containerScrollEvent = (e: Event) => {
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
    target.style.top = `${containerDom.scrollTop - upHeight}px`;
}

onMounted(() => {
    emitter.on('Event.FixedCollapseItem.ModelUpdate', val => {
        const [namespace, name] = val.split(':');
        if (namespace !== instanceNamespace) return;
        emitFlag = true;
        model.value = name;
    });
    nextTick(() => {
        emitter.emit('Event.FixedCollapse.ModelUpdate', `${instanceNamespace}:${model.value}`);
    });
    fixedCollapseContainerRef.value.addEventListener('scroll', containerScrollEvent);
});

onUnmounted(() => {
    emitter.off('Event.FixedCollapseItem.ModelUpdate');
    fixedCollapseContainerRef.value?.removeEventListener('scroll', containerScrollEvent);
})

</script>

<template>
    <div class="fixed-collapse-container" ref="fixedCollapseContainerRef" :id="containerDomId">
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
</style>

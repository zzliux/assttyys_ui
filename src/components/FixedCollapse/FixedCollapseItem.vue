<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';
import emitter from './EventBus';


const contentDomRef = ref<HTMLDivElement>();
const $props = defineProps({
    name: String,
});

const namespace = inject('fixedCollapse.instanceNameSpace');
const isOpen = ref(false);

function toggleItem() {
    isOpen.value = !isOpen.value;
    emitter.emit('Event.FixedCollapseItem.ModelUpdate', `${namespace}:${isOpen.value ? $props.name : ''}`);
}
const parentContainerDom = ref<HTMLElement>();
const singleDoms = ref<HTMLCollectionOf<Element>>();
const modelChangeEvent = (val: string) => {
    parentContainerDom.value = document.getElementById(`fixedCollapse-${namespace}`);
    singleDoms.value = parentContainerDom.value.getElementsByClassName('fixedCollapseItem-header');

    const [instanceNamespace, name] = val.split(':');
    if (instanceNamespace !== namespace) return;
    if (val === `${namespace}:${$props.name}`) {
        const parentHeight = parentContainerDom.value.getBoundingClientRect().height;
        const singleHeight = singleDoms.value[0].getBoundingClientRect().height;
        const singleCounts = singleDoms.value.length;
        const height = parentHeight - singleHeight * singleCounts;

        contentDomRef.value.style.height = `${height}px`;
        contentDomRef.value.style.padding = '2px';
        isOpen.value = true;
    } else {
        contentDomRef.value.style.height = `0px`;
        contentDomRef.value.style.padding = '0px';
        isOpen.value = false;
    }
}
onMounted(() => {
    emitter.on('Event.FixedCollapse.ModelUpdate', modelChangeEvent);
    emitter.on('Event.FixedCollapseItem.ModelUpdate', modelChangeEvent);
});

onUnmounted(() => {
    emitter.off('Event.FixedCollapse.ModelUpdate', modelChangeEvent);
    emitter.off('Event.FixedCollapseItem.ModelUpdate', modelChangeEvent);
});

</script>

<template>
    <div>
        <div :class="`fixedCollapseItem-header ${isOpen ? 'open' : ''}`" @click="toggleItem">
            <div class="fixedCollapseItem-header-text">
                <slot name="header"></slot>
            </div>
            <div class="fixedCollapseItem-header-icon">
                <slot name="header-icon-left"></slot>
                <span class="fixedCollapseItem-header-icon-arrow"><el-icon>
                        <ArrowRight />
                    </el-icon></span>
            </div>
        </div>
        <div class="fixedCollapseItem-content" ref="contentDomRef">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style scoped>
.fixedCollapseItem-header {
    border-top: 1px solid #ebeef5;
    /* border-bottom: 1px solid #ebeef5; */
    padding: 5px 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
}

.fixedCollapseItem-header-text,
.fixedCollapseItem-header-icon {
    display: flex;
    transition: all .2s ease-in-out;
}

.fixedCollapseItem-header.open .fixedCollapseItem-header-icon-arrow {
    transform: rotate(90deg);
}

.fixedCollapseItem-content {
    transition: all .2s ease-in-out;
    overflow: auto;
    height: 0px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: flex-start;
}

.fixedCollapseItem-content.open {
    height: 50px;
    overflow-y: auto;
}
</style>
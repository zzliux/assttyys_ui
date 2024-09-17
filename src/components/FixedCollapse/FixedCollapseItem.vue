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

onMounted(() => {
    emitter.on('Event.FixedCollapse.ModelUpdate', modelChangeEvent);
    emitter.on('Event.FixedCollapseItem.ModelUpdate', modelChangeEvent);

    const parentContainerDom = document.getElementById(`fixedCollapse-${namespace}`);
    const singleDoms = parentContainerDom.getElementsByClassName('fixedCollapseItem-header');

    const parentHeight = parentContainerDom.offsetHeight;
    const singleHeight = singleDoms[0].clientHeight;
    const singleCounts = singleDoms.length;
    const height = parentHeight - singleHeight * singleCounts - 4;
    function modelChangeEvent(val: string) {
        const [instanceNamespace, name] = val.split(':');
        if (instanceNamespace !== namespace) return;
        if (val === `${namespace}:${$props.name}`) {
            contentDomRef.value.style.height = `${height}px`;
            contentDomRef.value.style.padding = '2px';
            isOpen.value = true;
        } else {
            contentDomRef.value.style.height = `0px`;
            contentDomRef.value.style.padding = '0px';
            isOpen.value = false;
        }
    }
});

onUnmounted(() => {
    emitter.off('Event.FixedCollapse.ModelUpdate');
});

</script>

<template>
    <div>
        <div :class="`fixedCollapseItem-header ${isOpen ? 'open' : ''}`" @click="toggleItem">
            <div class="fixedCollapseItem-header-text">
                <slot name="header"></slot>
            </div>
            <div class="fixedCollapseItem-header-icon">
                <span class=""><el-icon>
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
    border-bottom: 1px solid #ebeef5;
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

.fixedCollapseItem-header.open .fixedCollapseItem-header-icon {
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
<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { ArrowRight, Folder, FolderOpened } from '@element-plus/icons-vue';
import emitter from './EventBus';


const contentDomRef = ref<HTMLDivElement>();
const contentInnerDomRef = ref<HTMLDivElement>();
const $props = defineProps({
    name: String,
    prevColor: {
        type: String,
        default: '#fff'
    },
});

const namespace = inject('fixedCollapse.instanceNameSpace');
const $parentProps = inject<{ multipart: boolean, modelValue: string }>('fixedCollapse.instanceProps');
const isOpen = ref(false);

let allNames: string[] = [];

function toggleItem() {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        if (!$parentProps.multipart) {
            allNames = [$props.name]
        } else if ($parentProps.multipart) {
            allNames.push($props.name);
        }
    } else {
        allNames = allNames.filter(name => name !== $props.name);
    }
    emitter.emit('Event.FixedCollapseItem.ModelUpdate', `${namespace}:${allNames.join(',')}`);
}
const parentContainerDom = ref<HTMLElement>();
const singleDoms = ref<HTMLCollectionOf<Element>>();
const modelChangeEvent = (val: string) => {
    parentContainerDom.value = document.getElementById(`fixedCollapse-${namespace}`);
    singleDoms.value = parentContainerDom.value.getElementsByClassName('fixedCollapseItem-header');

    const [instanceNamespace, instanceName] = val.split(':');
    if (instanceNamespace !== namespace) return;
    allNames = instanceName ? instanceName.split(',') : [];
    if (!$parentProps.multipart) {
        isOpen.value = (instanceName === $props.name);
    } else if ($parentProps.multipart) {
        isOpen.value = (allNames.includes($props.name));
    }
    if (isOpen.value) {
        // const parentHeight = parentContainerDom.value.getBoundingClientRect().height;
        // const singleHeight = singleDoms.value[0].getBoundingClientRect().height;
        // const singleCounts = singleDoms.value.length;
        // const height1 = parentHeight - singleHeight * Math.min(singleCounts, 2);
        const height2 = contentInnerDomRef.value.getBoundingClientRect().height;
        // const height = Math.min(height1, height2);

        contentDomRef.value.style.height = `${height2}px`;
        isOpen.value = true;
    } else {
        contentDomRef.value.style.height = `0px`;
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
                <div class="fixedCollapseItem-header-prevColorBox" :style="{ backgroundColor: $props.prevColor }"></div>
                <el-text size="small" style="margin-right: 5px"><el-icon>
                        <FolderOpened v-if="isOpen" />
                        <Folder v-else />
                    </el-icon></el-text>
                <slot name="header"></slot>
            </div>
            <div class="fixedCollapseItem-header-icon">
                <slot name="header-icon-left"></slot>
                <el-text size="small" class="fixedCollapseItem-header-icon-arrow"><el-icon>
                        <ArrowRight />
                    </el-icon></el-text>
            </div>
        </div>
        <div class="fixedCollapseItem-content" ref="contentDomRef">
            <div class="fixedCollapseItem-contentInner" ref="contentInnerDomRef">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fixedCollapseItem-header {
    border-top: 1px solid #ebeef5;
    /* border-bottom: 1px solid #ebeef5; */
    padding: 5px 10px 5px 0px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
}

.fixedCollapseItem-header-prevColorBox {
    width: 4px;
    margin-right: 4px;
    margin-left: 2px;
}

.fixedCollapseItem-header-text,
.fixedCollapseItem-header-icon {
    display: flex;
    transition: all .2s ease-in-out;
}

.fixedCollapseItem-header-icon-arrow {
    transition: all .2s ease-in-out;
}

.fixedCollapseItem-header.open .fixedCollapseItem-header-icon-arrow {
    transform: rotate(90deg);
}

.fixedCollapseItem-content {
    transition: all .2s ease-in-out;
    overflow: hidden;
    /* 动画的时候不显示滚动条 */
    height: 0px;
    width: 100%;
}

.fixedCollapseItem-contentInner {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: flex-start;
    padding: 2px;
}

.fixedCollapseItem-content.open {
    height: 50px;
    overflow-y: auto;
}
</style>
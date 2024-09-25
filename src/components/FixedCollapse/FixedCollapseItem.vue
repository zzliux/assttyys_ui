<script setup lang="ts">
import { inject, ref, watch, type ModelRef, type Ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';


const contentDomRef = ref<HTMLDivElement>();
const contentInnerDomRef = ref<HTMLDivElement>();
const $props = defineProps({
    name: String,
    prevColor: {
        type: String,
        default: '#fff'
    },
    headerIcon: {
        type: Object,
        default: null
    },
    headerIconActive: {
        type: Object,
        default: null
    },
    showRightArrowIcon: {
        type: Boolean,
        default: false
    },
});

const $parentProps = inject<{ multipart: boolean, modelValue: string }>('fixedCollapse.instanceProps');
const parentContainerDom = inject<Ref<HTMLDivElement, HTMLDivElement>>('fixedCollapse.containerRef');
const $parentModel = inject<ModelRef<string>>('fixedCollapse.instanceModel');
const isOpen = ref(false);

let allNames: string[] = [];
// 直接监听爸爸的模型值
watch(() => $parentModel.value, (val) => {
    modelChangeEvent(val);
});

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
    $parentModel.value = allNames.join(',');
}
const singleDoms = ref<HTMLCollectionOf<Element>>();
const modelChangeEvent = (val: string) => {
    singleDoms.value = parentContainerDom.value.getElementsByClassName('fixedCollapseItem-header');

    allNames = val ? val.split(',') : [];
    if (!$parentProps.multipart) {
        isOpen.value = (val === $props.name);
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

</script>

<template>
    <div class="fixedCollapseItem-container">
        <div :class="`fixedCollapseItem-header ${isOpen ? 'open' : ''}`" @click="toggleItem">
            <div class="fixedCollapseItem-header-text">
                <div class="fixedCollapseItem-header-prevColorBox" :style="{ backgroundColor: $props.prevColor }"></div>
                <el-text v-if="$props.headerIconActive || $props.headerIcon" size="small" style="margin-right: 5px">
                    <el-icon>
                        <!-- <FolderOpened v-if="isOpen" />
                        <Folder v-else /> -->
                        <component :is="$props.headerIconActive" v-if="$props.headerIconActive && isOpen" />
                        <component :is="$props.headerIcon" v-else-if="$props.headerIcon" />
                    </el-icon>
                </el-text>
                <slot name="header"></slot>
            </div>
            <div class="fixedCollapseItem-header-icon">
                <slot name="header-icon-left"></slot>
                <el-text v-if="showRightArrowIcon" size="small" class="fixedCollapseItem-header-icon-arrow"><el-icon>
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
    position: relative;
    width: 100%;
    padding: 5px 10px 5px 0px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    z-index: 1;
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
    z-index: 0;
}

.fixedCollapseItem-contentInner {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: flex-start;
    padding: 2px;
}

.fixedCollapseItem-content.open {
    overflow-y: auto;
}
</style>
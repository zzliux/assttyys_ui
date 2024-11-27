<script setup lang="ts">
import { inject, nextTick, ref, watch, type ModelRef, type Ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';


const contentDomRef = ref<HTMLDivElement>();
const contentInnerDomRef = ref<HTMLDivElement>();
const fixedCollapseItemHeaderRef = ref<HTMLDivElement>();
const $props = defineProps({
    name: String,
    prevColor: {
        type: String,
        default: 'inherit'
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

const $parentProps = inject<{ multipart: boolean, modelValue: string, preRenderContent: boolean }>('fixedCollapse.instanceProps');
const $parentContainerDom = inject<Ref<HTMLDivElement, HTMLDivElement>>('fixedCollapse.containerRef');
const $parentModel = inject<ModelRef<string>>('fixedCollapse.instanceModel');
const isOpen = ref(false);
const isOpenDelay = ref(false); // 该参数用户控制content部分延迟清空渲染用
watch(() => isOpen.value, (val) => {
    // 已经渲染过的再次打开不需要渲染了
    if (val) {
        isOpenDelay.value = val;
    }
    // setTimeout(() => {
    //     isOpenDelay.value = val;
    // }, 200)
});

let allNames: string[] = [];
// 直接监听爸爸的模型值
watch(() => $parentModel.value, (val, oldVal) => {
    if (val === oldVal) return;
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

    setTimeout(() => {
        const event = new Event('scroll');
        $parentContainerDom.value.dispatchEvent(event)
    }, 210);
}
const singleDoms = ref<HTMLCollectionOf<Element>>();
const modelChangeEvent = (val: string) => {
    singleDoms.value = $parentContainerDom.value.getElementsByClassName('fixedCollapseItem-header');

    allNames = val ? val.split(',') : [];
    if (!$parentProps.multipart) {
        isOpen.value = (val === $props.name);
    } else if ($parentProps.multipart) {
        isOpen.value = (allNames.includes($props.name));
    }
    if (isOpen.value) {
        nextTick(() => {

            // const parentHeight = parentContainerDom.value.getBoundingClientRect().height;
            // const singleHeight = singleDoms.value[0].getBoundingClientRect().height;
            // const singleCounts = singleDoms.value.length;
            // const height1 = parentHeight - singleHeight * Math.min(singleCounts, 2);
            const height2 = contentInnerDomRef.value.getBoundingClientRect().height;
            // const height = Math.min(height1, height2);

            contentDomRef.value.style.height = `${height2 <= 4 ? 0 : height2}px`;
            isOpen.value = true;

            // 关闭一个特高的，再打开一个矮的时候，当前item滚动直接超出父容器时，修复滚动位置
            // if (!$parentProps.multipart) {
            //     setTimeout(() => {
            //         if (fixedCollapseItemHeaderRef.value.offsetTop < $parentContainerDom.value.scrollTop) {
            //             $parentContainerDom.value.scrollTo({
            //                 top: fixedCollapseItemHeaderRef.value.offsetTop,
            //                 behavior: 'smooth'
            //             });
            //         }
            //     }, 200);
            // }
        });
    } else {
        contentDomRef.value.style.height = `0px`;
        isOpen.value = false;

        // fixedCollapseItemHeaderRef.value.style.top = 'initial';
    }
}
</script>

<template>
    <div class="fixedCollapseItem-container">
        <div ref="fixedCollapseItemHeaderRef" :class="`fixedCollapseItem-header ${isOpen ? 'open' : ''}`"
            @click="toggleItem">
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
            <div v-if="$parentProps.preRenderContent || (isOpen || isOpenDelay)" class="fixedCollapseItem-contentInner" ref="contentInnerDomRef">
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
    position: sticky;
    top: 0;
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
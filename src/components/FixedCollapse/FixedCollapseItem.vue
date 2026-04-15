<script setup lang="ts">
import { inject, nextTick, ref, watch, type ModelRef, type Ref, onMounted, onUnmounted } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';


const contentDomRef = ref<HTMLDivElement>();
const contentInnerDomRef = ref<HTMLDivElement>();
const enableTransition = ref(false)
const resizeObserver = ref<ResizeObserver | null>(null);
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
onMounted(() => {
    requestAnimationFrame(() => {
        enableTransition.value = true
    });

    // 监听内容变化，当方案内容变化时重新计算高度
    if (contentInnerDomRef.value) {
        resizeObserver.value = new ResizeObserver(() => {
            if (isOpen.value) {
                updateContentHeight();
            }
        });
        resizeObserver.value.observe(contentInnerDomRef.value);
    }
});

onUnmounted(() => {
    if (resizeObserver.value) {
        resizeObserver.value.disconnect();
        resizeObserver.value = null;
    }
});

// 更新内容区域高度
const updateContentHeight = () => {
    if (!contentInnerDomRef.value || !contentDomRef.value) return;
    const height = contentInnerDomRef.value.getBoundingClientRect().height;
    contentDomRef.value.style.height = `${height <= 4 ? 0 : height}px`;
};

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
const fixedCollapseItemHeaderRef = ref<HTMLDivElement>();
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
            updateContentHeight();
            isOpen.value = true;

            // 展开时滚动，延迟一点让 DOM 更新完成
            setTimeout(() => {
                scrollContentToCenter();
            }, 50);
        });
    } else {
        contentDomRef.value.style.height = `0px`;
        isOpen.value = false;
    }
}

// 滚动内容到可视区域：能完整显示则不滚动，否则根据溢出方向滚动
const scrollContentToCenter = () => {
    if (!fixedCollapseItemHeaderRef.value || !$parentContainerDom.value || !contentInnerDomRef.value) return;
    const container = $parentContainerDom.value;
    const header = fixedCollapseItemHeaderRef.value;
    const content = contentInnerDomRef.value;

    const containerRect = container.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const contentHeight = content.getBoundingClientRect().height;
    const scrollTop = container.scrollTop;

    // 计算 header 相对于容器内容顶部的实际位置（使用 getBoundingClientRect 更准确）
    const headerTop = scrollTop + headerRect.top - containerRect.top;
    const headerHeight = headerRect.height;
    const totalBottom = headerTop + headerHeight + contentHeight;
    const containerHeight = containerRect.height;
    const containerBottom = scrollTop + containerHeight;

    // 能完整显示则不滚动
    if (headerTop >= scrollTop && totalBottom <= containerBottom) return;

    // 根据溢出方向计算目标位置
    let targetScrollTop;
    if (headerRect.top < containerRect.top) {
        // header 在可视区域上方，滚动使其顶部对齐
        targetScrollTop = headerTop;
    } else if (totalBottom > containerBottom) {
        // content 溢出底部，滚动显示完整内容
        targetScrollTop = totalBottom - containerHeight;
    } else {
        return;
    }

    container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
};
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
        <div class="fixedCollapseItem-content" ref="contentDomRef" :class="{ animated: enableTransition }">
            <div v-if="$parentProps.preRenderContent || (isOpen || isOpenDelay)" class="fixedCollapseItem-contentInner"
                ref="contentInnerDomRef">
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
    overflow: hidden;
    /* 动画的时候不显示滚动条 */
    height: 0px;
    width: 100%;
    z-index: 0;
}

.fixedCollapseItem-content.animated {
    transition: all .1s ease-in-out;
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
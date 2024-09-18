<!-- 父的高度固定时，整体高度超出父高度，未打开的折叠面板的item则会固定在父容器的上下两个位置 -->
<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { uuid } from '@/tools/tools';
import emitter from './EventBus';

const instanceNamespace = uuid();
const containerDomId = ref<string>(`fixedCollapse-${instanceNamespace}`);

provide('fixedCollapse.instanceNameSpace', instanceNamespace);

const model = defineModel<string>();
let emitFlag = false;
watch(model, (newVal) => {
	if (emitFlag) {
		emitFlag = false;
		return;
	}
	emitter.emit('Event.FixedCollapse.ModelUpdate', `${instanceNamespace}:${newVal}`);
});

onMounted(() => {
	emitter.on('Event.FixedCollapseItem.ModelUpdate', val => {
		const [namespace, name] = val.split(':');
		if (namespace !== instanceNamespace) return;
		emitFlag = true;
		model.value = name;
	});
    // 父比子先挂载，等子挂载完了再发送父的model更新事件
    setTimeout(() => {
        emitter.emit('Event.FixedCollapse.ModelUpdate', `${instanceNamespace}:${model.value}`);
    }, 0)
});

onUnmounted(() => {
	emitter.off('Event.FixedCollapseItem.ModelUpdate');
})

</script>

<template>
	<div class="fixed-collapse-container" :id="containerDomId">
		<slot name="default"></slot>
	</div>
</template>

<style scoped>
.fixed-collapse-container {
	position: relative;
    width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>

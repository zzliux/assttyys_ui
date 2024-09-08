<!-- 父的高度固定时，整体高度超出父高度，未打开的折叠面板的item则会固定在父容器的上下两个位置 -->
<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { uuid } from '@/tools/tools';
import emitter from './EventBus';

const instanceNameSpace = uuid();
const containerDomId = ref<string>(`fixedCollapse-${instanceNameSpace}`);

provide('fixedCollapse.instanceNameSpace', instanceNameSpace);

const model = defineModel<string>();
let emitFlag = false;
watch(model, (newVal) => {
	if (emitFlag) {
		emitFlag = false;
		return;
	}
	console.log(emitFlag);
	emitter.emit('Event.FixedCollapse.ModelUpdate', `${instanceNameSpace}:${newVal}`);
});

onMounted(() => {
	emitter.on('Event.FixedCollapseItem.ModelUpdate', val => {
		const [namespace, name] = val.split(':');
		if (namespace !== instanceNameSpace) return;
		emitFlag = true;
		model.value = name;
	});
	emitter.emit('Event.FixedCollapse.ModelUpdate', `${instanceNameSpace}:${model.value}`);
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
	height: 100%;
	overflow: hidden;
	border: 1px solid #ccc;
}
</style>

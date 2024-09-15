import { isFunction } from '@vue/shared'
import type { Directive, DirectiveBinding } from 'vue'

const elMapToMouseDownHandlers: WeakMap<Element, () => void> = new WeakMap()

const elMapToMouseUpHandlers: WeakMap<Element, () => void> = new WeakMap()

function addEventListener(el: Element, binding: DirectiveBinding) {
	const { arg, value } = binding
	if (!isFunction(value)) return
	let timer: number | undefined
	const pressHandler = () => {
        console.log(1132);
		timer = window.setTimeout(value, arg ? Number(arg) : 300)
	}
	const clearTimeoutHandler = () => {
		clearTimeout(timer)
	}
	el.addEventListener('touchstart', pressHandler)
	el.addEventListener('touchend', clearTimeoutHandler)
	elMapToMouseDownHandlers.set(el, pressHandler)
	elMapToMouseUpHandlers.set(el, clearTimeoutHandler)
}

const vLongPress: Directive = {
	beforeUnmount(el: HTMLElement) {
		elMapToMouseDownHandlers.delete(el)
		elMapToMouseUpHandlers.delete(el)
	},
	mounted(el: HTMLElement, binding) {
		addEventListener(el, binding)
	},
	updated(el: HTMLElement, binding) {
		if (elMapToMouseDownHandlers.has(el)) {
			const pressHandler = elMapToMouseDownHandlers.get(el)
			pressHandler && el.removeEventListener('touchstart', pressHandler)
			elMapToMouseDownHandlers.delete(el)
		}
		if (elMapToMouseUpHandlers.has(el)) {
			const pressHandler = elMapToMouseDownHandlers.get(el)
			pressHandler && el.removeEventListener('touchend', pressHandler)
			elMapToMouseUpHandlers.delete(el)
		}
		addEventListener(el, binding)
	},
}
export default vLongPress
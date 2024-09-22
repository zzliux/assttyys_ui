import { debounce } from "@/tools/tools";
import { ElLoading, type LoadingParentElement } from "element-plus";
import type { ComponentPublicInstance, ComponentOptionsBase, ComponentProvideOptions, Ref } from "vue";


let instance: { close: any; setText?: (text: string) => void; removeElLoadingChild?: () => void; handleAfterLeave?: () => void; vm?: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions>, {}, {}, "", {}, any>; $el?: HTMLElement; originalPosition?: Ref<string, string>; originalOverflow?: Ref<string, string>; visible?: Ref<boolean, boolean>; parent?: Ref<LoadingParentElement, LoadingParentElement>; background?: Ref<string, string>; svg?: Ref<string, string>; svgViewBox?: Ref<string, string>; spinner?: Ref<string | boolean, string | boolean>; text?: Ref<string, string>; fullscreen?: Ref<boolean, boolean>; lock?: Ref<boolean, boolean>; customClass?: Ref<string, string>; target?: Ref<HTMLElement, HTMLElement>; beforeClose?: Ref<() => boolean, () => boolean>; closed?: Ref<() => void, () => void>; } = null;
const debounceClose = debounce(() => {
    instance?.close();
    instance = null;
}, 0);
export const DebouncedFullLoading = {
    show() {
        if (instance) return;
        instance = ElLoading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0)' });
    },

    close() {
        return debounceClose();
    }
}

export default DebouncedFullLoading;

import type { Scheme } from "@/tools/declares";
import SchemeEditDialog from "./SchemeEditDialog.vue";

export default SchemeEditDialog;

export type editType = 'copy' | 'modify' | 'add' | 'remove';
export type onConfirmOption = {
    oldScheme?: Scheme,
    newScheme: Scheme,
    type: editType
}
export type onConfirmCallback = (option: onConfirmOption) => Promise<boolean> | boolean;



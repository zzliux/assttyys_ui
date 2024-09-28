import type { JobOptions } from "@/tools/declares";
import ScheduleJobEditDialog from "./ScheduleJobEditDialog.vue";

export default ScheduleJobEditDialog;

export type editType = 'modify' | 'add' | 'remove';
export type onConfirmOption = {
    oldScheduleJob?: JobOptions,
    newScheduleJob: JobOptions,
    type: editType
}
export type onConfirmCallback = (option: onConfirmOption) => Promise<boolean> | boolean;



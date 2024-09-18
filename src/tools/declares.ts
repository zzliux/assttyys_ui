import type { onConfirmOption as onSchemeSaveConfirmOption } from "@/components/SchemeEditDialog";

export type Scheme = {
    id: number;
    schemeName: string;
    groupNames: string[]; // 该属性方案本身不存，由GroupSchemeNames关联而来
    inner?: boolean;
    star?: boolean;

    /**
     * 功能id的清单
     */
    list: number[];
    config?: {
        [key: number]: {
            [key: string]: string | boolean | number
        }
    };
    commonConfig?: {
        [key: string]: string | boolean | number
    };
}

export type GroupSchemeName = {
    groupName: string,
    schemeNames: string[]
}


// 定义AutoWeb.autoPromise/auto的参数类型和响应类型
export type AutoWebTypes = {
    toast: {
        param: string,
        result: void
    },
    getStatusBarHeight: {
        param: void,
        result: number
    },
    getScheme: {
        param: string,
        result: Scheme
    },
    getGroupSchemeNames: {
        param: void,
        result: GroupSchemeName[]
    },
    getDefaultScheme: {
        param: string,
        result: Scheme
    },
    getSchemeList: {
        param: void,
        result: Scheme[]
    },
    saveScheme: {
        param: onSchemeSaveConfirmOption
        result: { error: number, message: string }
    },
    saveSchemeList: {
        param: Scheme[],
        result: void
    },
    saveGroupSchemeNames: {
        param: GroupSchemeName[],
        result: void
    },
    topScheme: {
        param: Scheme,
        result: void
    }
    removeScheme: {
        param: Scheme,
        result: string, // 'success'
    }
    versionInfo: {
        param: void,
        result: {
            storeVersion: string,
            versionList: {
                version: string,
                desc: string,
            }[]
        }
    },
    setCurrentScheme: {
        param: string,
        result: void
    }
}

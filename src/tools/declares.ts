import type { onConfirmOption as onSchemeSaveConfirmOption } from "@/components/SchemeEditDialog";

export type Scheme = {
    id: number;
    schemeName: string;
    groupNames?: string[];
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
    getGroupNames: {
        param: void,
        result: string[]
    }
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
    saveGroupNames: {
        param: string[],
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

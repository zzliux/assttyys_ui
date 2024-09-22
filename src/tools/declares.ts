import type { onConfirmOption as onSchemeSaveConfirmOption } from "@/components/SchemeEditDialog";

export type FuncConfig = {
    desc: string;
    config: {
        name: string,
        desc: string,
        type: 'switch' | 'integer' | 'text' | 'scheme' | 'list' | 'number',
        data?: string[],
        default: boolean | string | number,
        value?: boolean | string | number,
    }[]
}

export type Func = {
    id: number,
    name: string,
    desc?: string,
    config?: FuncConfig[],
}

export type Scheme = {
    id: number;
    schemeName: string;
    groupNames?: string[]; // 该属性方案本身不存，由GroupSchemeNames关联而来读取方案时无该字段
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
    hidden: boolean,
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
    getSchemeList: {
        param: void,
        result: Scheme[]
    },
    getGroupNames: {
        param: void,
        result: string[]
    },
    saveScheme: {
        param: onSchemeSaveConfirmOption
        result: { error: number, message: string }
    },
    saveGroupSchemeNames: {
        param: GroupSchemeName[],
        result: { error: number, message: string }
    },
    removeScheme: {
        param: Scheme,
        result: { error: number, message: string }
    },
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
    },
}

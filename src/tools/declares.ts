export type Scheme = {
    id: number;
    schemeName: string;
    groupName?: string;
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
    getDefaultScheme: {
        param: string,
        result: Scheme
    },
    getSchemeList: {
        param: void,
        result: Scheme[]
    },
    saveScheme: {
        param: Scheme,
        result: void
    },
    saveSchemeList: {
        param: Scheme[],
        result: void
    },
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

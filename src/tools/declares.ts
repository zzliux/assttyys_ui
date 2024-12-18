import type { onConfirmOption as onSchemeSaveConfirmOption } from "@/components/SchemeEditDialog";

export type SchemePageConfig = {
    showHiddenGroup: boolean,
    currentCollapseVal: string,
    collapseAccordion: boolean,
    hiddenUnStar: boolean,
    scrollSettle: boolean,
};

export type FuncConfig = {
    desc: string;
    config: {
        name: string,
        desc: string,
        type: 'switch' | 'integer' | 'text' | 'scheme' | 'list' | 'number',
        data?: string[],
        default: boolean | string | number,
        value?: boolean | string | number
    }[]
}

export type Func = {
    id: number,
    name: string,
    desc?: string,
    config?: FuncConfig[],
}

export type FuncView = {
    enabled: boolean,
} & Func;

export type Result = { error: number, message: string }

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
    export?: boolean
}

export type CommonConfigItem = {
    desc: string,
    config: {
        name: string,
        desc: string,
        type: 'integer',
        default: number,
        value?: number
    }[]
}

export type GroupSchemeName = {
    groupName: string,
    hidden: boolean,
    schemeNames: string[]
}
export type RepeatModeType = 0 | 1 | 2 | 3;

/**
 * waiting: 啥也没干
 * queueing: 队列中，等待执行
 * running: 执行中
 * done: 运行完成
 */
export type StatusType = 'waiting' | 'queueing' | 'running' | 'done';

// export type SettingItem = {
//     desc: string, // '点击/滑动模式',
//     name: string, // 'tapType',
//     type: string, //'assttyys_setting',
//     stype: 'list', // 'list',
//     data: string[], // ['无障碍', 'Root', 'Shell', 'RootAutomator'],
//     value: string, //'无障碍'
// } | {
//     desc: string, // '推送地址',
//     name: string, // 'oneBot_url',
//     type: string, // 'assttyys_setting',
//     stype: 'text', // 'text',
//     value: string, // 'http://19n=666666'
// }| {
//     desc: string, // '无障碍服务(仅使用无障碍模式时生效)',
//     name: string, //'autoService',
//     type: string, // 'autojs_inner_setting_auto_service',
//     stype?: 'switch',
//     enabled: boolean, // true
// };
export type SettingItem = {
    desc: string,
    name: string,
    type: string,
    stype?: 'list' | 'text' | 'switch',
    data?: string[],
    value?: string,
    enabled?: boolean,
}

export type PackageInfo = {
    appName: string,
    packageName: string, // 获取应用包名，可用于卸载和启动应用
    versionName: string, // 获取应用版本名
    versionCode: number, // 获取应用版本号
    referred: boolean, // 是否关联
}
export type floatyInfo = {
    floatyName: string,
    referred: boolean, // 是否关联
}

export type JobOptions = {
    id?: number;
    name: string; // job名
    desc: string; // job描述
    checked?: boolean; // 是否启用
    lastRunTime?: Date | string; // 上次运行开始时间
    lastStopTime?: Date | string; // 上次运行结束时间
    nextDate?: Date | string; // 下次执行时间
    repeatMode: RepeatModeType; // 重复模式： 0不重复运行，1从开始运行时间计算重复间隔，2从运行结束计算重复间隔，3CRON表达式
    nextOffset?: string; // 运行间隔偏移，单位分钟，随机数，如-10,10
    interval: string; // 间隔时间（min）or cront expression
    status?: StatusType; // 状态
    config?: Record<string, string>; // 其它配置 包含关联的方案
    runningCallback?: Function; // 开始运行时执行的回调
    level?: string; //执行任务优先级
    inner?: boolean;
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
    getDefaultSchemeList: {
        param: void,
        result: Scheme[]
    },
    getGroupNames: {
        param: void,
        result: string[]
    },
    saveScheme: {
        param: onSchemeSaveConfirmOption,
        result: Result
    },
    saveGroupSchemeNames: {
        param: GroupSchemeName[],
        result: Result
    },
    removeScheme: {
        param: Scheme,
        result: Result
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
    getScheduleList: {
        param: void,
        result: JobOptions[]
    }
    // 偷个懒，schedule直接全部保存
    saveScheduleList: {
        param: JobOptions[],
        result: Result
    },
    scheduleChange: {
        param: JobOptions,
        result: void
    },
    setScheduleLazyMode: {
        param: boolean,
        result: void
    },
    getScheduleLazyMode: {
        param: void,
        result: boolean
    },
    getSettings: {
        param: void,
        result: SettingItem[]
    },
    saveSetting: {
        param: SettingItem,
        result: Result
    },
    startActivityForLog: {
        param: void,
        result: void
    },
    clearStorage: {
        param: void,
        result: void
    },
    getToSetDefaultLaunchAppList: {
        param: void,
        result: PackageInfo[]
    },
    getIconByPackageName: {
        param: string, // package_name
        result: string, // base64 data url: 'data:image/png;base64,' + android.util.Base64.encodeToString(baos.toByteArray(), android.util.Base64.NO_WRAP);
    },
    saveToSetDefaultLaunchAppList: {
        param: string[],
        result: Result
    },
    getFuncList: {
        param: void,
        result: Func[]
    },
    getCommonConfig: {
        param: void,
        result: CommonConfigItem[]
    },
    copyToClip: {
        param: string,
        result: void
    },
    getClip: {
        param: void,
        result: string
    },
    webloaded: {
        param: void,
        result: void
    },
    exit: {
        param: void,
        result: void
    },
    getAppInfo: {
        param: void,
        result: { msg: string }
    },
    getDeviceId: {
        param: void,
        result: string
    },
    openURL: {
        param: string,
        result: void
    },
    startScript: {
        param: void,
        result: void
    },
    getToFloat: {
        param: void,
        result: floatyInfo[]
    },
    saveToFloat: {
        param: string[],
        result: Result
    },
}

import { AutoWeb } from "./AutoWeb";
import type { Func, FuncConfig, GroupSchemeName, Scheme } from "./declares";
import groupColors from "./GroupColors";


// 非时间种子的随机数
export const uuid = () => {
    const tempUrl = URL.createObjectURL(new Blob());
    const tempId = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return tempId.substring(tempId.lastIndexOf("/") + 1)
}

export const groupSchemeList = (groupSchemeNames: GroupSchemeName[], schemeList: Scheme[]): Record<string, Scheme[]> => {
    const schemeListMap = schemeList.reduce((acc: Record<string, Scheme>, cur: Scheme) => {
        acc[cur.schemeName] = cur;
        return acc;
    }, {});
    const ret: Record<string, Scheme[]> = {};
    for (let groupSchemeName of groupSchemeNames) {
        if (!ret[groupSchemeName.groupName]) {
            ret[groupSchemeName.groupName] = [];
        }
        for (let schemeName of groupSchemeName.schemeNames) {
            if (schemeListMap[schemeName]) {
                ret[groupSchemeName.groupName].push(schemeListMap[schemeName]);
            }
        }
    }
    return ret;
}

export const groupedSchemeListToGroupSchemeNames = (groupedSchemeList: Record<string, Scheme[]>): GroupSchemeName[] => {
    return Object.keys(groupedSchemeList).map(key => {
        return {
            groupName: key,
            hidden: false,
            schemeNames: groupedSchemeList[key].map(scheme => scheme.schemeName)
        }
    });
}


export const deepClone = <T>(obj: T): T => {
    if (obj === null) return null as unknown as T;
    if (typeof obj !== 'object') return obj;

    let clone: any = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key]);
        }
    }

    return clone;
}

export const deepEqual = (a: any, b: any): boolean => {
    // 如果两者都是对象或者数组，进行深度比较
    if (typeof a === 'object' && typeof b === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) {
            return false;
        }
        if (a === null || b === null) {
            return a === b;
        }
        if (a.prototype !== b.prototype) {
            return false;
        }

        let keysA = Object.keys(a);
        let keysB = Object.keys(b);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (let key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
                return false;
            }
        }

        return true;
    } else {
        // 如果不是对象或数组，直接比较值
        return a === b;
    }
}


export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number = 100): T => {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    return ((...args: Parameters<T>) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = undefined; // 清除定时器引用
        }, delay);
    }) as T;
}

export const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number = 100): T => {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let lastExecTime = 0;

    return ((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastExecTime >= delay) {
            if (timerId) {
                clearTimeout(timerId);
                timerId = undefined;
            }
            fn(...args);
            lastExecTime = now;
        } else if (!timerId) {
            timerId = setTimeout(() => {
                fn(...args);
                timerId = undefined;
                lastExecTime = Date.now();
            }, delay - (now - lastExecTime));
        }
    }) as T;
}

export const getGroupColor = (groupName: string): string => {
    // 计算hash值
    let sum = 0;
    for (let i = 0; i < groupName.length; i++) {
        sum += groupName.charCodeAt(i);
    }
    return groupColors[sum % groupColors.length];
}

export const getAncestorBySelector = (element: HTMLElement, selector: string): HTMLElement => {
    // 从当前元素开始向上遍历DOM树
    let ancestor = element;
    while (ancestor !== null) {
        // 检查当前元素是否匹配选择器
        if (ancestor.matches(selector)) {
            return ancestor; // 返回匹配的祖先元素
        }
        ancestor = ancestor.parentElement; // 移动到父元素
    }
    // 如果没有找到匹配的祖先元素，则返回null
    return null;
}

export const random = function (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const mergeOffsetTime = function (date: Date, offsetStr: string) {
    let offsetTime = 0;
    if (date && offsetStr) {
        const parts = offsetStr?.split(',');
        if (parts.length === 2) {
            const [offsetMinuteLow, offsetMinuteHigh] = parts.map(item => parseInt(item));
            if (Number.isInteger(offsetMinuteLow) && Number.isInteger(offsetMinuteHigh)) {
                offsetTime = random(offsetMinuteLow * 60 * 1000, offsetMinuteHigh * 60 * 1000);
            }
        }
    }
    try {
        return new Date(date.getTime() + offsetTime);
    } catch (e) {
        return null;
    }
}

// 将日期转换为yyyy-mm-dd hh:ii:ss格式
export const toStdFormatDateStr = function (date: Date | string): string {
    if (!date) return;

    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
    }

    const year = parsedDate.getFullYear() - 2000;
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
    const seconds = String(parsedDate.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

function getSingleDefaultConfig(func: Func) {
    const ret: { [key: string]: string | number | boolean } = {};
    if (func.config) {
        for (let configGroup of func.config) {
            for (let config of configGroup.config) {
                ret[config.name] = config.default;
            }
        }
    }
    if (Object.keys(ret).length) {
        return ret;
    }
    return null;
}

export async function getCommonConfig() {
    const defaultCommonConfig = await AutoWeb.autoPromise('getCommonConfig');
    const ret: { [key: string]: string | number | boolean } = {};
    for (let configGroup of defaultCommonConfig) {
        for (let config of configGroup.config) {
            ret[config.name] = config.default;
        }
    }
    return ret;
}

export async function simplifySchemeList(schemeList: Scheme[]) {
    const defaultFuncList = await AutoWeb.autoPromise('getFuncList');
    const allDefaultConfig: { [key: string]: { [key: string]: string | number | boolean } } = {};
    defaultFuncList.forEach(func => {
        const v = getSingleDefaultConfig(func);
        if (v) {
            allDefaultConfig[func.id] = v;
        }
    });
    const allDefaultCommonConfig = await getCommonConfig();
    schemeList.forEach(expScheme => {
        delete expScheme.id;
        delete expScheme.inner;
        delete expScheme.export;
        // 删除默认功能配置
        for (let funcId in expScheme.config) {
            const defaultConfig = allDefaultConfig[funcId];
            if (!defaultConfig) {
                delete expScheme.config[funcId];
                continue;
            }
            let flag = true;
            for (let configKey in expScheme.config[funcId]) {
                if (defaultConfig[configKey] == expScheme.config[funcId][configKey]) {
                    delete expScheme.config[funcId][configKey];
                } else {
                    flag = false;
                }
            }
            if (flag) {
                delete expScheme.config[funcId]
            }
        }
        if (expScheme.config && Object.keys(expScheme.config).length === 0) {
            delete expScheme.config;
        }

        // 删除默认公共配置
        let flag = true;
        for (let commonConfigKey in expScheme.commonConfig) {
            if (allDefaultCommonConfig[commonConfigKey] == expScheme.commonConfig[commonConfigKey]) {
                delete expScheme.commonConfig[commonConfigKey];
            } else {
                flag = false;
            }
        }
        if (flag) {
            delete expScheme.commonConfig;
        }

    });
    return schemeList;
}


export function bueatifyTime(date: Date | string): string {
    if (!date) return;
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
    }

    const ms: number = parsedDate.getTime() - new Date().getTime();
    const absMs = Math.abs(ms);
    const d = Math.floor(absMs / 1000 / 60 / 60 / 24);
    const h = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((absMs % (1000 * 60)) / 1000);

    let str = '';
    if (d) str += `${d}天`;
    if (h) str += `${h}时`;
    if (m) str += `${m}分`;
    if (!str || s) str += `${s}秒`;
    if (ms < 0) {
        str = str + '前';
    } else {
        str = str + '后';
    }
    // if (ms < -180000) {
    //     str = '已错过' + str;
    // } else if (ms < 0) {
    //     str = '即将执行';
    // } else {
    //     str = '将于' + str + '后执行';
    // }
    return str;
}
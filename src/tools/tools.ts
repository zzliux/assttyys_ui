import type { Scheme } from "./declares";

// 非时间种子的随机数
export const uuid = () => {
    const tempUrl = URL.createObjectURL(new Blob());
    const tempId = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return tempId.substring(tempId.lastIndexOf("/") + 1)
}

export const groupSchemeList = (schemeList: Scheme[]): Record<string, Scheme[]> => {
    const ret: Record<string, Scheme[]> = {};
    for (let i = 0; i < schemeList.length; i++) {
        const scheme = schemeList[i];
        if (scheme.groupNames?.length > 0) {
            for (let j = 0; j < scheme.groupNames.length; j++) {
                const groupName = scheme.groupNames[j];
                if (!ret[groupName]) {
                    ret[groupName] = [];
                }
                ret[groupName].push(scheme);
            }
        } else {
            if (!ret['未分组']) {
                ret['未分组'] = [];
            }
            ret['未分组'].push(scheme);
        }
    }
    return ret;
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
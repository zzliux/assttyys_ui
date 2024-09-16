import type { Scheme } from "./declares";

// 非时间种子的随机数
export const uuid = () => {
    const tempUrl = URL.createObjectURL(new Blob());
    const tempId = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return tempId.substring(tempId.lastIndexOf("/") + 1)
}

export const categorySchemeList = (schemeList: Scheme[]) => {
    const unstaredUserSchemeList = [];
    const unstaredInnerSchemeList = [];
    const staredSchemeList = [];
    for (let i = 0; i < schemeList.length; i++) {
        const scheme = schemeList[i];
        if (scheme.star) {
            staredSchemeList.push(scheme);
        } else if (!scheme.star && !scheme.inner) {
            unstaredUserSchemeList.push(scheme);
        } else if (!scheme.star && scheme.inner) {
            unstaredInnerSchemeList.push(scheme);
        }
    }
    return {
        unstaredUserSchemeList,
        unstaredInnerSchemeList,
        staredSchemeList,
    };
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
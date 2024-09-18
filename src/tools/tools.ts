import type { GroupSchemeName, Scheme } from "./declares";

// 非时间种子的随机数
export const uuid = () => {
    const tempUrl = URL.createObjectURL(new Blob());
    const tempId = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return tempId.substring(tempId.lastIndexOf("/") + 1)
}

export const groupSchemeList = (groupSchemeNames: GroupSchemeName[], schemeList: Scheme[]): Record<string, Scheme[]> => {
    const ret: Record<string, Scheme[]> = {};
    for (let scheme of schemeList) {
        let flag = false;
        for (let groupSchemeName of groupSchemeNames) {
            if (groupSchemeName.schemeNames.includes(scheme.schemeName)) {
                flag = true;
                if (!ret[groupSchemeName.groupName]) {
                    ret[groupSchemeName.groupName] = [];
                }
                ret[groupSchemeName.groupName].push(scheme);
            }
        }
        if (!flag) {
            if (!ret['未分组']) {
                ret['未分组'] = [];
            }
            ret['未分组'].push(scheme);
        }
    }
    return ret;
}

export const groupedSchemeListToGroupSchemeNames = (groupedSchemeList: Record<string, Scheme[]>): GroupSchemeName[] => {
    return Object.keys(groupedSchemeList).map(key => {
        return {
            groupName: key,
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
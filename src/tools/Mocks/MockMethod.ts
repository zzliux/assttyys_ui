import { type AutoWebTypes, type GroupSchemeName, type JobOptions, type Scheme } from '../declares';
import store from './store';
import SchemeList from './initDatas/SchemeList';
import ScheduleDefaultList from './initDatas/ScheduleList';
import type { onConfirmOption } from '@/components/SchemeEditDialog';
import { getNextByCron } from '../cron';
import { mergeOffsetTime } from '../tools';

if (localStorage.getItem('debug')) {
    // 1. 初始化schemeList
    const schemeList = store.get('schemeList');
    if (!schemeList) {
        console.log('初始化schemeList', SchemeList);
        store.put('schemeList', SchemeList);
    }

    // 2. 初始化groupSchemeNames
    const groupSchemeNames = store.get('groupSchemeNames');
    if (!groupSchemeNames) {

        const toSaveMap: Record<string, GroupSchemeName> = {}
        SchemeList.forEach(scheme => {
            if (!scheme.groupNames || !(scheme.groupNames?.length)) {
                scheme.groupNames = ['未分组'];
            }
            scheme.groupNames.forEach(groupName => {
                if (!toSaveMap[groupName]) {
                    toSaveMap[groupName] = {
                        groupName, hidden: false, schemeNames: []
                    };
                }
                if (!toSaveMap[groupName].schemeNames.includes(scheme.schemeName)) {
                    toSaveMap[groupName].schemeNames.push(scheme.schemeName);
                }
            });
        });
        const toSave = Object.keys(toSaveMap).map(key => toSaveMap[key]);
        console.log('初始化groupSchemeNames', toSave);
        store.put('groupSchemeNames', toSave);
    }

    // 3. 初始化scheduleList
    let savedScheduleList = store.get('scheduleList');
    if (!savedScheduleList) {
        console.log('初始化scheduleList', ScheduleDefaultList);
        store.put('scheduleList', ScheduleDefaultList);
        savedScheduleList = ScheduleDefaultList;
    }
    // 3.1 cron更新下次执行时间，时间字段转回date类型
    savedScheduleList.forEach((item: JobOptions) => {
        ['lastRunTime', 'nextDate', 'lastStopTime'].forEach(keyName => {
            try {
                item[keyName as 'lastRunTime' | 'nextDate' | 'lastStopTime'] = new Date(item[keyName as keyof JobOptions] as string);
            } catch (e) {
                console.log(`${item.name}中${keyName}转换失败：${item[keyName as keyof JobOptions]}`)
                item[keyName as 'lastRunTime' | 'nextDate' | 'lastStopTime'] = null;
            }
        })
        if (item.repeatMode === 3) {
            item.nextDate = mergeOffsetTime(getNextByCron(item.interval), item.nextOffset);
        }
        // jobToSchedule(item); // autojs端特有，用于将job加入schedule，mock做不到该逻辑，先注释
    });
    store.put('scheduleList', savedScheduleList);
}

const updateGroupSchemeNamesBySchemeUpdate = (option: onConfirmOption): void => {
    const { type, oldScheme, newScheme } = option;
    if (oldScheme && (!oldScheme.groupNames || oldScheme.groupNames.length === 0)) {
        oldScheme.groupNames = ['未分组'];
    }
    if (newScheme && (!newScheme.groupNames || newScheme.groupNames.length === 0)) {
        newScheme.groupNames = ['未分组'];
    }

    let groupSchemeNames: GroupSchemeName[] = store.get('groupSchemeNames');
    if ('modify' === type) {
        // 直接找到原来的分组，将原来的分组中的名字修改为新的名字
        const deletedGroupSchemeNames = oldScheme.groupNames.filter(groupName => !newScheme.groupNames.includes(groupName));
        const commonGroupNames = oldScheme.groupNames.filter(groupName => newScheme.groupNames.includes(groupName));
        const addedGroupSchemeNames = newScheme.groupNames.filter(groupName => !oldScheme.groupNames.includes(groupName));
        // 1. 删除分组中删除旧的方案名
        deletedGroupSchemeNames.forEach(groupName => {
            const groupSchemeName = groupSchemeNames.find(groupSchemeName => groupSchemeName.groupName === groupName);
            if (groupSchemeName) {
                const index = groupSchemeName.schemeNames.findIndex(schemeName => schemeName === oldScheme.schemeName);
                groupSchemeName.schemeNames.splice(index, 1);
            }
        });

        // 2. 公共分组中更新方案名
        commonGroupNames.forEach(groupName => {
            const groupSchemeName = groupSchemeNames.find(groupSchemeName => groupSchemeName.groupName === groupName);
            if (groupSchemeName) {
                const index = groupSchemeName.schemeNames.findIndex(schemeName => schemeName === oldScheme.schemeName);
                groupSchemeName.schemeNames.splice(index, 1, newScheme.schemeName);
            }
        });

        // 3. 新增分组中新增方案名
        addedGroupSchemeNames.forEach(groupName => {
            const groupSchemeName = groupSchemeNames.find(groupSchemeName => groupSchemeName.groupName === groupName);
            if (!groupSchemeName) {
                groupSchemeNames.push({
                    groupName, hidden: false, schemeNames: [newScheme.schemeName]
                });
            } else {
                groupSchemeName.schemeNames.push(newScheme.schemeName);
            }
        });

        // 4. 删除空分组
        groupSchemeNames = groupSchemeNames.filter(groupSchemeName => groupSchemeName.schemeNames.length > 0);
    } else if ('copy' === type || 'add' === type) {
        const addedGroupSchemeNames = newScheme.groupNames;
        // 3. 新增分组中新增方案名
        addedGroupSchemeNames.forEach(groupName => {
            const groupSchemeName = groupSchemeNames.find(groupSchemeName => groupSchemeName.groupName === groupName);
            if (!groupSchemeName) {
                groupSchemeNames.push({
                    groupName, hidden: false, schemeNames: [newScheme.schemeName]
                });
            } else {
                groupSchemeName.schemeNames.push(newScheme.schemeName);
            }
        });
    } else if ('remove' === type) {
        // 1. 删除分组中删除旧的方案名
        oldScheme.groupNames.forEach(groupName => {
            const groupSchemeName = groupSchemeNames.find(groupSchemeName => groupSchemeName.groupName === groupName);
            if (groupSchemeName) {
                const index = groupSchemeName.schemeNames.findIndex(schemeName => schemeName === oldScheme.schemeName);
                groupSchemeName.schemeNames.splice(index, 1);
            }
        });

        // 4. 删除空分组
        groupSchemeNames = groupSchemeNames.filter(groupSchemeName => groupSchemeName.schemeNames.length > 0);
    }
    store.put('groupSchemeNames', groupSchemeNames);
}


export const MockMethod: {
    [key in keyof AutoWebTypes]: (params: AutoWebTypes[key]['param']) => AutoWebTypes[key]['result']
} = {
    toast: (_params) => {
        return;
    },
    getStatusBarHeight: () => {
        return 20;
    },
    getScheme: (schemeName) => {
        const schemeList = store.get('schemeList');
        return schemeList.find((scheme: Scheme) => scheme.schemeName === schemeName);
    },
    getGroupSchemeNames: () => {
        return store.get('groupSchemeNames');
    },
    getSchemeList: () => {
        return store.get('schemeList');
    },
    getDefaultSchemeList: () => {
        return SchemeList;
    },
    getGroupNames: () => {
        return store.get('groupSchemeNames').map((groupSchemeName: GroupSchemeName) => groupSchemeName.groupName);
    },
    saveScheme: (params: onConfirmOption) => {
        const schemeList = store.get('schemeList');
        const { type, oldScheme, newScheme } = params;
        if (type === 'modify') {
            const index = schemeList.findIndex((scheme: Scheme) => scheme.schemeName === oldScheme.schemeName);
            if (index === -1) {
                return { error: 1, message: '未找到该方案' };
            }
            schemeList[index] = newScheme;
            store.put('schemeList', schemeList);
            updateGroupSchemeNamesBySchemeUpdate(params);
            return { error: 0, message: 'success' };
        } else if (type === 'add' || type === 'copy') {
            const index = schemeList.findIndex((scheme: Scheme) => scheme.schemeName === newScheme.schemeName);
            if (index !== -1) {
                return { error: 1, message: '方案名重复' };
            }
            schemeList.push(newScheme);
            store.put('schemeList', schemeList);
            updateGroupSchemeNamesBySchemeUpdate(params);
            return { error: 0, message: 'success' };
        } else if (type === 'remove') {
            const index = schemeList.findIndex((scheme: Scheme) => scheme.schemeName === oldScheme.schemeName);
            if (index === -1) {
                return { error: 1, message: '未找到该方案' };
            }
            schemeList.splice(index, 1);
            store.put('schemeList', schemeList);
            updateGroupSchemeNamesBySchemeUpdate(params);
            return { error: 0, message: 'success' };
        }
        return { error: 1, message: '未知错误' };
    },
    saveGroupSchemeNames: (params) => {
        store.put('groupSchemeNames', params);
        return { error: 0, message: 'success' };
    },
    removeScheme: (params) => {
        const schemeList = store.get('schemeList');
        const index = schemeList.findIndex((scheme: Scheme) => scheme.schemeName === params.schemeName);
        if (index === -1) {
            return { error: 1, message: '未找到该方案' };
        }
        schemeList.splice(index, 1);
        updateGroupSchemeNamesBySchemeUpdate({
            type: 'remove', oldScheme: params, newScheme: null,
        });
        store.put('schemeList', schemeList);
        return { error: 0, message: 'success' }
    },
    versionInfo: () => {
        // TODO
        return {
            storeVersion: '1.0.0',
            versionList: [
                {
                    version: '1.0.0',
                    desc: '初始版本'
                }
            ]
        };
    },
    setCurrentScheme: (params) => {
        // TODO
        return;
    },
    getScheduleList: () => {
        return store.get('scheduleList');
    },
    saveScheduleList: (scheduleList: JobOptions[]) => {
        store.put('scheduleList', scheduleList);
        return { error: 0, message: 'success' };
    },
    scheduleChange: (job: JobOptions) => {
		// jobToSchedule(job);
		// schedule.immediateTimerInterval();
    }
};

export default MockMethod;

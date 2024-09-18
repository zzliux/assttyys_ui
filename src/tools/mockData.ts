import type { onConfirmOption as onSchemeSaveConfirmOption } from "@/components/SchemeEditDialog";
import type { GroupSchemeName, Scheme } from "./declares";

const mockData: {
    [key: string]: any;
} = {
    getScheme: function (_schemeName: string) {
        // for (let i = 0; i < defaultSchemeList.length; i++) {
        //     if (schemeName === defaultSchemeList[i].schemeName) {
        //         return defaultSchemeList[i];
        //     }
        // }
        // return defaultSchemeList[0];
        return {
            schemeName: '百鬼夜行',
            star: true,
            inner: true,
            list: [3, 17, 18, 19, 20, 21],
            config: {
                '3': {
                    'type': '关闭'
                },
                '19': {
                    'bossPosition': '随机'
                }
            },
            commonConfig: {
                'loopDelay': 200,
                'afterClickDelayRandom': 200,
                'colorSimilar': 93,
                'multiColorSimilar': 98
            },
            id: 11
        };
    },
    getDefaultScheme: function (_schemeName: string) {
        // for (let i = 0; i < defaultSchemeList.length; i++) {
        //     if (schemeName === defaultSchemeList[i].schemeName) {
        //         return defaultSchemeList[i];
        //     }
        // }
        // return defaultSchemeList[0];
        return {
            'schemeName': '百鬼夜行',
            'star': true,
            'inner': true,
            'list': [3, 17, 18, 19, 20, 21],
            'config': {
                '3': {
                    'type': '关闭'
                },
                '19': {
                    'bossPosition': '随机'
                }
            },
            'commonConfig': {
                'loopDelay': 200,
                'afterClickDelayRandom': 200,
                'colorSimilar': 93,
                'multiColorSimilar': 98
            },
            'id': 11
        };
    },
    getDeletedSchemeNames: ['通用准备退出'],
    getSchemeList: [{ 'id': 1, 'schemeName': '通用准备退出', 'star': true, 'list': [0, 1, 2, 3], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 2, 'schemeName': '组队乘客', 'star': true, 'list': [0, 1, 2, 3, 4], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 3, 'schemeName': '组队司机', 'star': true, 'list': [0, 1, 2, 3, 5], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '5': { 'type': '有人就开' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 4, 'schemeName': '个人御魂', 'star': false, 'list': [0, 1, 2, 3, 6], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 5, 'schemeName': '个人突破', 'star': true, 'list': [0, 1, 2, 3, 7, 10, 8, 9, 11], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '7': {}, '8': { 'count': '2', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出', 'type': '个人突破', 'cdWaitTime': '30,60', 'cdSwitchSchemeEnable': false, 'cdSwitchScheme': '个人突破' }, '9': { 'priority': '4->5->3->2->1->0' }, '10': { 'type': '个人突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 5, 'schemeName': '个人突破_降级', 'star': true, 'list': [0, 1, 2, 3, 8, 9, 10, 11], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': true, 'jspd_times_1': 27, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': true }, '2': {}, '3': { 'type': '关闭' }, '8': { 'count': '2', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出', 'type': '个人突破', 'cdWaitTime': '30,60', 'cdSwitchSchemeEnable': false, 'cdSwitchScheme': '个人突破' }, '9': { 'priority': '0->1->2->3->4->5' }, '10': { 'type': '个人突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 6, 'schemeName': '寮突破', 'star': true, 'list': [0, 1, 2, 3, 8, 9, 10, 12], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '8': { 'count': '2', 'afterCountOper': '关闭界面', 'next_scheme': '通用准备退出', 'type': '寮突破', 'cdWaitTime': '30,60', 'cdSwitchSchemeEnable': false, 'cdSwitchScheme': '个人突破' }, '9': { 'priority': '4->5->3->2->1->0' }, '10': { 'type': '寮突破' }, '12': { 'count': '3', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 7, 'schemeName': '个人探索', 'star': true, 'list': [0, 15, 1, 2, 3, 13, 14, 29], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '关闭BUFF', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '14': { 'type': '打经验', 'swipeTime': '4', 'swipeSpeed': '慢' }, '15': { 'type': '打手', 'dog_food_type': '素材', 'handle_position': '20%' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 8, 'schemeName': '组队探索_队长', 'star': false, 'list': [0, 15, 1, 2, 3, 5, 14], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '5': { 'type': '有人就开' }, '14': { 'type': '打经验', 'swipeTime': '4', 'swipeSpeed': '慢' }, '15': { 'type': '队长', 'dog_food_type': '素材', 'handle_position': '20%' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 8, 'schemeName': '组队探索_打手', 'star': false, 'list': [0, 15, 1, 2, 3, 4, 25], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '15': { 'type': '打手', 'dog_food_type': '素材', 'handle_position': '20%' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 9, 'schemeName': '地鬼日常', 'star': true, 'list': [1, 2, 16], 'config': { '1': { 'exitBeforeReady': false }, '2': {} }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 10, 'schemeName': '逢魔日常', 'star': true, 'list': [1, 2, 3, 23, 24, 26, 8], 'config': { '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '8': { 'count': '2', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出', 'type': '个人突破', 'cdWaitTime': '30,60', 'cdSwitchSchemeEnable': false, 'cdSwitchScheme': '个人突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 11, 'schemeName': '百鬼夜行', 'star': false, 'list': [3, 17, 18, 19, 20, 21], 'config': { '3': { 'type': '关闭' }, '19': { 'bossPosition': '随机' }, '20': { 'mode': '普通模式' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 12, 'schemeName': '抽厕纸', 'star': false, 'list': [3, 22], 'config': { '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 13, 'schemeName': '例_个人探索30次_转个人突破', 'star': true, 'list': [0, 15, 1, 2, 3, 13, 14], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': true, 'jspd_times_2': 30, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': true, 'next_scheme': '例_个人突破_结束后转寮突破', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '14': { 'type': '打经验', 'swipeTime': '4', 'swipeSpeed': '慢' }, '15': { 'type': '打手', 'dog_food_type': '素材', 'handle_position': '20%' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['切换方案样例'] }, { 'id': 14, 'schemeName': '例_个人突破_结束后转寮突破', 'star': true, 'list': [0, 1, 2, 3, 7, 10, 8, 9, 11, 25], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '7': {}, '8': { 'count': '2', 'afterCountOper': '切换方案', 'next_scheme': '寮突破', 'type': '个人突破', 'cdWaitTime': '30,60', 'cdSwitchSchemeEnable': false, 'cdSwitchScheme': '个人突破' }, '9': { 'priority': '4->5->3->2->1->0' }, '10': { 'type': '个人突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['切换方案样例'] }, { 'id': 15, 'schemeName': '组队_自动匹配流程', 'star': true, 'list': [0, 1, 2, 3, 5, 27], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '5': { 'type': '有人就开' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 16, 'schemeName': '继续育成', 'star': false, 'list': [3, 28], 'config': { '3': { 'type': '关闭' }, '28': { 'count': '5' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 17, 'schemeName': '斗技', 'star': false, 'list': [0, 1, 2, 3, 30], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 18, 'schemeName': '结界卡_继续合成', 'star': false, 'list': [0, 3, 31], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 19, 'schemeName': '道馆', 'star': true, 'list': [0, 1, 2, 3, 32], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 20, 'schemeName': '个人突破_卡级_进攻', 'star': true, 'list': [0, 1, 2, 3, 10, 7, 8, 9, 11], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': true, 'jspd_times_1': 2, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': true, 'next_scheme': '个人突破_卡级_退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '7': {}, '8': { 'count': '2', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出', 'type': '个人突破', 'cdWaitTime': '30,60', 'cdSwitchSchemeEnable': false, 'cdSwitchScheme': '个人突破' }, '9': { 'priority': '4->5->3->2->1->0' }, '10': { 'type': '个人突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['个人突破卡级'] }, { 'id': 21, 'schemeName': '个人突破_卡级_退出', 'star': true, 'list': [0, 1, 2, 3, 8, 9, 10, 11], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': true, 'jspd_times_1': 1, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': true, 'next_scheme': '个人突破_卡级_进攻', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': true }, '2': {}, '3': { 'type': '关闭' }, '8': { 'count': '2', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出', 'type': '个人突破', 'cdWaitTime': '30,60', 'cdSwitchSchemeEnable': false, 'cdSwitchScheme': '个人突破' }, '9': { 'priority': '0->1->2->3->4->5' }, '10': { 'type': '个人突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['个人突破卡级'] }, { 'id': 22, 'schemeName': '秘闻', 'star': true, 'list': [0, 51, 1, 2, 3, 34], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': true, 'jspd_times_1': 15, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '51': { 'greenType': '自定义文本', 'greenPosition': '245,500', 'greenText': '绿标专用', 'greenTextMatchMode': '模糊', 'preSearch': true } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 23, 'schemeName': '悬赏', 'star': true, 'list': [0, 1, 2, 3, 29, 41, 42, 43, 44, 45, 46, 47, 48, 49], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '47': { 'scheme_switch_enabled': false, 'next_scheme': '地鬼日常' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 24, 'schemeName': '金币妖怪', 'star': true, 'list': [0, 1, 2, 3, 39, 35, 36, 37, 38, 40], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '40': { 'scheme_switch_enabled': false, 'next_scheme': '寮突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 25, 'schemeName': '宴会', 'star': true, 'list': [3, 1003, 1000, 1001, 1002, 1004], 'config': { '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 26, 'schemeName': '关闭BUFF', 'star': false, 'list': [1, 2, 3, 29, 40, 501, 502], 'config': { '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '40': { 'scheme_switch_enabled': false, 'next_scheme': '寮突破' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 27, 'schemeName': '开启BUFF_打探索', 'star': false, 'list': [501, 50], 'config': { '50': { 'scheme_switch_enabled': true, 'next_scheme': '个人探索', 'buff_type': '经验' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 28, 'schemeName': '悬赏_庭院打开悬赏界面', 'star': false, 'list': [52], 'config': { '52': { 'scheme_switch_enabled': true, 'next_scheme': '悬赏' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 29, 'schemeName': '返回庭院', 'star': false, 'list': [503], 'config': {}, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 30, 'schemeName': '式神寄养', 'star': true, 'list': [999, 998, 997, 994, 995], 'config': { '994': { 'count': '3', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出', 'maxTimeForwait': '10' }, '995': { 'maxTimeForwait': '10', 'afterCountOper': '停止脚本', 'isAutoFosterCare': true, 'next_scheme': '返回庭院' }, '997': { 'priority': '太鼓6->太鼓5->太鼓4->太鼓3->斗鱼6->斗鱼5->斗鱼4' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['式神寄养'] }, { 'id': 31, 'schemeName': '定时任务-启动游戏-式神寄养', 'star': true, 'list': [993], 'config': { '993': { 'area': '', 'package_name': 'com.netease.onmyoji', 'is_shutdown_the_game_before': true, 'next_scheme': '式神寄养' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['式神寄养'] }, { 'id': 32, 'schemeName': '式神指定寄养', 'star': true, 'list': [3, 999, 998, 996, 994, 995], 'config': { '3': { 'type': '关闭' }, '994': { 'count': '3', 'afterCountOper': '停止脚本', 'next_scheme': '通用准备退出' }, '995': { 'maxTimeForwait': '10', 'afterCountOper': '停止脚本', 'isAutoFosterCare': true, 'next_scheme': '返回庭院' }, '996': { 'friendName': '老王' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['定时任务'] }, { 'id': 33, 'schemeName': '狩猎战', 'star': false, 'list': [0, 1, 2, 3, 507], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 34, 'schemeName': '庭院进入寮每日活动', 'star': false, 'list': [505, 506], 'config': {}, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 35, 'schemeName': '六道萤草', 'star': false, 'list': [0, 1, 2, 3, 24, 201, 202, 203, 204, 205, 206], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' }, '202': { '腐草为萤': 0, '妖力化身': 0, '六道净化': 0, '萤火之光': 0, 'priority': '腐草为萤,妖力化身,六道净化,萤火之光' }, '203': { 'ospPush': false, 'overTimes': '0' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 95 } }, { 'id': 36, 'schemeName': '定时任务-启动游戏-每日寮活动', 'star': true, 'list': [993], 'config': { '993': { 'area': '', 'package_name': 'com.netease.onmyoji', 'is_shutdown_the_game_before': true, 'next_scheme': '庭院进入寮每日活动' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['定时任务'] }, { 'id': 99, 'schemeName': '伊吹之擂', 'star': false, 'list': [0, 3, 24, 99, 100], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 } }, { 'id': 100, 'schemeName': '活动_战场巡逻', 'inner': true, 'star': false, 'list': [0, 1, 2, 3, 101], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 101, 'schemeName': '活动_战场探索', 'inner': true, 'star': false, 'list': [0, 3, 24, 102, 103, 104], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 102, 'schemeName': '活动_前线作战', 'inner': true, 'star': false, 'list': [0, 1, 2, 3, 24, 105, 106], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false, 'greenType': '自定义坐标', 'greenPosition': '628,511' }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 103, 'schemeName': '活动_不朽之木_三途轮回', 'inner': true, 'star': false, 'list': [0, 1, 2, 3, 24, 107], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 104, 'schemeName': '流火之擂', 'inner': true, 'star': false, 'list': [0, 1, 2, 3, 30, 109, 110], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 105, 'schemeName': '红叶行狩', 'inner': true, 'star': false, 'list': [0, 1, 2, 3, 24, 111], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 106, 'schemeName': '活动_梦境徊游', 'inner': true, 'star': false, 'list': [0, 1, 2, 3, 112], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 107, 'schemeName': '活动_梦旅竞速', 'inner': true, 'star': false, 'list': [0, 3, 113, 114], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 108, 'schemeName': '活动_风暴试炼', 'inner': true, 'star': false, 'list': [0, 1, 2, 3, 24, 115, 116], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 109, 'schemeName': '化四季_小怪', 'inner': true, 'star': true, 'list': [0, 1, 2, 3, 24, 117], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }, { 'id': 110, 'schemeName': '化四季_boss', 'inner': true, 'star': true, 'list': [0, 1, 2, 3, 24, 118], 'config': { '0': { 'jspd_enabled_longtime_nodo': true, 'jspd_times_longtime_nodo': 10, 'jspd_enabled_zjsj': false, 'jspd_times_zjsj': 30, 'jspd_txpl_zjsj': 60, 'jspd_enabled_1': false, 'jspd_times_1': 20, 'jspd_enabled_2': false, 'jspd_times_2': 20, 'stop_with_launched_app_exit': false, 'scheme_switch_enabled': false, 'next_scheme': '通用准备退出', 'pause_enabled': false, 'define_run_time': '10,30', 'define_pause_time': '2,7' }, '1': { 'exitBeforeReady': false }, '2': {}, '3': { 'type': '关闭' } }, 'commonConfig': { 'loopDelay': 200, 'afterClickDelayRandom': 200, 'colorSimilar': 93, 'multiColorSimilar': 98 }, 'groupNames': ['活动'] }],
    getUnStaredSchemeList: function () {
        return this['getSchemeList'].filter((item: Scheme) => !item.star);
    },
    getStaredSchemeList: function () {
        return this['getSchemeList'].filter((item: Scheme) => item.star);
    },
    getSettings: function (_arg: any) {
        return [{
            desc: '音量上键停脚本及程序',
            name: 'stop_all_on_volume_up',
            type: 'autojs_inner_setting',
            enabled: true
        }, {
            desc: '前台服务',
            name: 'foreground_service',
            type: 'autojs_inner_setting',
            enabled: false
        }, {
            desc: '点击/滑动模式',
            name: 'tapType',
            type: 'assttyys_setting',
            stype: 'list',
            data: ['无障碍', 'Root', 'Shell', 'RootAutomator'],
            value: 'Root'
        }, {
            desc: 'ospUserToken',
            name: 'osp_user_token',
            type: 'assttyys_setting',
            stype: 'text',
            value: '123'
        }, {
            desc: '推送图片缩放大小，取值范围(0,1]，1为原始大小图片，默认值0.5',
            name: 'osp_user_token',
            type: 'assttyys_setting',
            stype: 'text',
            value: '0.5'
        }]
    },
    getToSetDefaultLaunchAppList(_arg: any) {
        return [{
            appName: 'assttyys_ng',
            packageName: 'com.example.script161',
            versionName: '1.0.0',
            versionCode: 1,
            appIcon: '',
            referred: false
        }, {
            appName: '魅族游戏框架',
            packageName: 'com.meizu.gamecenter.service',
            versionName: '5.4.0',
            versionCode: 5004000,
            appIcon: '',
            referred: false
        }, {
            appName: 'assttyys',
            packageName: 'com.xixdaoq.rsicybi',
            versionName: '0.0.4_build_20201001',
            versionCode: 1,
            appIcon: '',
            referred: false
        }, {
            appName: '阴阳师',
            packageName: 'com.netease.onmyoji.mz',
            versionName: '1.6.6',
            versionCode: 103,
            appIcon: '',
            referred: true
        }, {
            appName: 'AutoJsPro',
            packageName: 'org.autojs.autojspro',
            versionName: 'Pro 8.7.4-0',
            versionCode: 8070400,
            appIcon: '',
            referred: false
        }]
    },
    saveScheme: function (option: onSchemeSaveConfirmOption) {
        const error = Math.random() > 0.5 ? 1 : 0;
        if (error) {
            return {
                error, message: `保存失败，方案[${option.newScheme.schemeName}]已存在。`
            }
        }
        return {
            error: 0
        }
    },
    topScheme: function (_arg: any) {
        return 'success';
    },
    saveSchemeList: function (_arg: any) {
        return 'success';
    },
    removeScheme: function (_arg: any) {
        return 'success';
    },
    versionInfo: function (_arg: any) {
        return {
            storeVersion: '20240904_02',
            versionList: [{
                version: '20240904_02',
                desc: '002退出结算适配阴阳师/英杰技能升级提示'
            }, {
                version: '20240905_01',
                desc: '修复002退出结算适配阴阳师/英杰技能升级提示'
            }, {
                version: '20240905_02',
                desc: '优化：993启动游戏登陆页的取点，屏蔽的无响应弹窗的识别操作'
            }, {
                version: '20240906_01',
                desc: '优化：993启动游戏中关闭弹窗的误识别；\n修复：013点击困28坐标偏移'
            }]
        }
    },
    getStatusBarHeight: 30,
    setCurrentScheme: 'sucess',
    startScript: [{
        appName: 'assttyys',
        packageName: 'com.xixdaoq.rsicybi',
        versionName: '0.0.4_build_20201001',
        versionCode: 1,
        appIcon: '',
        referred: false
    }, {
        appName: '阴阳师',
        packageName: 'com.netease.onmyoji.mz',
        versionName: '1.6.6',
        versionCode: 103,
        appIcon: '',
        referred: true
    }],
    launchPackage: true,
    saveSetting: 'sucess',
    toast: function (_arg: any) { },
    initFloaty: function (_arg: any) { },
    startActivityForLog: function (_arg: any) { },
    saveToSetDefaultLaunchAppList: function (_arg: any) { },
    openOpenSource(_arg: any) { },
    mailTo(_arg: any) { },
    copyToClip(_arg: any) { },
    copyPToClip(_arg: any) { },
    webloaded(_arg: any) { },
    getAppInfo: { msg: '' },
    starScheme: function (opt: any) {
        return { star: opt.star }
    },
    getShapedScreenConfig: [{
        device: 'xiaomi 11(3200*1440)',
        enabled: true
    }, {
        device: 'meizu 16th plus(2160*1080)',
        enabled: false
    }],
    setShapedScreenConfigEnabled: {},
    getIconByPackageName: null,
    // getClip: JSON.stringify(_.cloneDeep(defaultSchemeList).slice(0, 4).map(item => {
    //     item.groupName = '导出测试分组'
    //     return item;
    // }), null, 4),
    getClip: JSON.stringify([]),
    getScheduleList: [
        {
            id: 1,
            name: '式神寄养',
            desc: '自动续式神寄养，建议把执行时间提前5分钟，启动前需要退出游戏',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 2,
            interval: '359',
            nextOffset: '0,5',
            level: '10',
            config: {
                scheme: '定时任务-启动游戏-式神寄养',
            }
        },
        {
            id: 2,
            name: '寮活动',
            desc: '自动参加寮活动，目前只支持道馆、狩猎',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 0 19 * * *',
            nextOffset: '0,1',
            level: '10',
            config: {
                scheme: '定时任务-启动游戏-每日寮活动',
            }
        },
        {
            id: 3,
            name: '逢魔',
            desc: '自动参加逢魔活动',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 25 17 * * *',
            nextOffset: '-10,30',
            level: '10',
            config: {
                scheme: '定时任务-启动游戏-每日逢魔',
            }
        },
        {
            id: 4,
            name: '喂猫喂狗',
            desc: '自动喂猫喂狗',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 10 5,16,23 * * *',
            nextOffset: '0,30',
            level: '5',
            config: {
                scheme: '定时任务-启动游戏-喂猫喂狗',
            }
        },
        {
            id: 5,
            name: '寮突',
            desc: '自动寮突',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 10 7 * * *',
            nextOffset: '0,30',
            level: '1',
            config: {
                scheme: '定时任务-启动游戏-寮突',
            }
        },
        {
            id: 6,
            name: '地鬼',
            desc: '自动地鬼',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 0 10 * * *',
            nextOffset: '0,30',
            level: '6',
            config: {
                scheme: '定时任务-启动游戏-地鬼',
            }
        },
        {
            id: 7,
            name: '寮活动(阴门)',
            desc: '寮活动(阴门), 周五至周日',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 0 20 * * 5,6,0',
            nextOffset: '0,5',
            level: '10',
            config: {
                scheme: '庭院进入寮每日活动(包含阴门)',
            }
        },
        {
            id: 8,
            name: '寮活动(狩猎)',
            desc: '寮活动(狩猎), 周一至周四',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 59 18 * * 1-4',
            nextOffset: '0,1',
            level: '10',
            config: {
                scheme: '定时任务-启动游戏-庭院进入寮每日活动(包含阴门)',
            }
        },
        {
            id: 9,
            name: '寮活动(道馆)',
            desc: '寮活动(道馆), 周一至周四',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 5 19 * * 1-4',
            nextOffset: '0,1',
            level: '10',
            config: {
                scheme: '庭院进入寮每日活动(不包含阴门)',
            }
        },
        {
            id: 10,
            name: '寮活动(狭间)',
            desc: '寮活动(狭间), 周五至周日',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 59 18 * * 5,6,0',
            nextOffset: '0,1',
            level: '10',
            config: {
                scheme: '定时任务-启动游戏-庭院进入寮每日活动(狭间)',
            }
        },
        {
            id: 11,
            name: '寮活动(宴会)',
            desc: '寮活动(宴会), 周五或周日',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 5 19 * * 5,0',
            nextOffset: '0,1',
            level: '10',
            config: {
                scheme: '庭院进入寮每日活动(不包含阴门)',
            }
        },
        {
            id: 12,
            name: '寮活动(首领)',
            desc: '寮活动(首领), 周六',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 5 19 * * 6',
            nextOffset: '0,1',
            level: '10',
            config: {
                scheme: '庭院进入寮每日活动(不包含阴门)',
            }
        },
        {
            id: 13,
            name: '悬赏',
            desc: '自动悬赏',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 0 7,1 * * *',
            nextOffset: '0,30',
            level: '1',
            config: {
                scheme: '定时任务-启动游戏-悬赏',
            }
        },
        {
            id: 14,
            name: '重启模拟器',
            desc: '自动判断十分钟后是否有定时任务，否则重启模拟器，注意，目前jio并没有自启动功能，请配合模拟器脚本共同使用',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 0 4 * * *',
            nextOffset: '0,0',
            level: '0',
            config: {
                scheme: '重启模拟器',
            }
        },
        {
            id: 15,
            name: '每日签到与领取邮箱奖励',
            desc: '每日签到与领取邮箱奖励',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 10 1 * * *',
            nextOffset: '0,30',
            level: '1',
            config: {
                scheme: '定时任务-启动游戏-每日签到与收取邮件',
            }
        },
        {
            id: 16,
            name: '经验妖怪',
            desc: '经验妖怪',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 5 0 * * *',
            nextOffset: '0,30',
            level: '6',
            config: {
                scheme: '定时任务-启动游戏-经验妖怪',
            }
        },
        {
            id: 17,
            name: '金币妖怪',
            desc: '金币妖怪',
            checked: false,
            lastRunTime: null,
            nextDate: null,
            repeatMode: 3,
            interval: '0 5 0 * * *',
            nextOffset: '0,30',
            level: '6',
            config: {
                scheme: '定时任务-启动游戏-金币妖怪',
            }
        }
    ],
    saveScheduleList: 'success',
    scheduleChange: null,
    getGroupNames: function (_arg: any): string[] {
        const savedSchemeList = this['getSchemeList'];
        const groupNames = new Set<string>();
        groupNames.add('未分组');
        savedSchemeList.forEach((item: Scheme) => {
            item.groupNames?.forEach((groupName: string) => {
                groupNames.add(groupName);
            });
        });
        return Array.from(groupNames);
    },
    getGroupSchemeNames: function (): GroupSchemeName[] {
        // const groupNames = this.getGroupNames();
        // return groupNames.map((groupName: string) => {
        //     return {
        //         groupName,
        //         schemeNames: this['getSchemeList']
        //             .filter((item: Scheme) => item.groupNames?.includes(groupName))
        //             .map((item: Scheme) => item.schemeName)
        //     };
        // });
        return [
            {
                "groupName": "未分组",
                "schemeNames": [
                    "组队乘客",
                    "通用准备退出",
                    "组队司机",
                    "个人御魂",
                    "个人突破",
                    "个人突破_降级",
                    "寮突破",
                    "个人探索",
                    "组队探索_队长",
                    "组队探索_打手",
                    "地鬼日常",
                    "逢魔日常",
                    "百鬼夜行",
                    "抽厕纸",
                    "组队_自动匹配流程",
                    "继续育成",
                    "斗技",
                    "结界卡_继续合成",
                    "道馆",
                    "秘闻",
                    "悬赏",
                    "金币妖怪",
                    "宴会",
                    "关闭BUFF",
                    "开启BUFF_打探索",
                    "悬赏_庭院打开悬赏界面",
                    "返回庭院",
                    "狩猎战",
                    "庭院进入寮每日活动",
                    "六道萤草",
                    "伊吹之擂"
                ]
            },
            {
                "groupName": "切换方案样例",
                "schemeNames": [
                    "通用准备退出",
                    "例_个人探索30次_转个人突破",
                    "例_个人突破_结束后转寮突破"
                ]
            },
            {
                "groupName": "个人突破卡级",
                "schemeNames": [
                    "个人突破_卡级_进攻",
                    "个人突破_卡级_退出"
                ]
            },
            {
                "groupName": "式神寄养",
                "schemeNames": [
                    "式神寄养",
                    "定时任务-启动游戏-式神寄养"
                ]
            },
            {
                "groupName": "定时任务",
                "schemeNames": [
                    "式神指定寄养",
                    "定时任务-启动游戏-每日寮活动"
                ]
            },
            {
                "groupName": "活动",
                "schemeNames": [
                    "活动_战场巡逻",
                    "活动_战场探索",
                    "活动_前线作战",
                    "活动_不朽之木_三途轮回",
                    "流火之擂",
                    "红叶行狩",
                    "活动_梦境徊游",
                    "活动_梦旅竞速",
                    "活动_风暴试炼",
                    "化四季_小怪",
                    "化四季_boss"
                ]
            }
        ];
    },
    saveGroupNames: function (groupNames: string[]) {
        return 'success';
    },
    clearStorage: null,
    exit: null,
    setScheduleLazyMode: 'success',
    getScheduleInstance: { lazyMode: true }
};


export default mockData;

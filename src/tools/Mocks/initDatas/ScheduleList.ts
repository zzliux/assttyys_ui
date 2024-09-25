import type { JobOptions } from "@/tools/declares";

const ScheduleDefaultList: JobOptions[] = [
    {
        "id": 1,
        "name": "式神寄养",
        "desc": "自动续式神寄养，建议把执行时间提前5分钟，启动前需要退出游戏",
        "checked": true,
        "lastRunTime": "2024-06-28T15:27:25.697Z",
        "nextDate": "2024-06-28T21:30:10.894Z",
        "repeatMode": 2,
        "interval": "359",
        "level": "10",
        "config": {
            "scheme": "定时任务-启动游戏-式神寄养"
        },
        "lastStopTime": "2024-06-28T15:28:57.643Z",
        "nextOffset": "0,5"
    },
    {
        "id": 2,
        "name": "寮活动",
        "desc": "自动参加寮活动，目前只支持道馆、狩猎",
        "checked": false,
        "lastRunTime": "2023-05-28T00:45:33.279Z",
        "nextDate": "2024-06-29T10:59:00.498Z",
        "repeatMode": 3,
        "interval": "0 59 18 * * *",
        "level": "10",
        "config": {
            "scheme": "定时任务-启动游戏-每日寮活动"
        },
        "lastStopTime": "2023-05-28T00:45:35.447Z"
    },
    {
        "id": 3,
        "name": "逢魔",
        "desc": "自动参加逢魔活动",
        "checked": true,
        "lastRunTime": "2024-06-28T09:29:02.274Z",
        "nextDate": "2024-06-29T09:51:38.767Z",
        "repeatMode": 3,
        "interval": "0 27 17 * * *",
        "level": "10",
        "config": {
            "scheme": "定时任务-启动游戏-每日逢魔"
        },
        "lastStopTime": "2024-06-28T09:40:33.836Z",
        "nextOffset": "-10,30"
    },
    {
        "id": 4,
        "name": "喂猫喂狗",
        "desc": "自动喂猫喂狗",
        "checked": false,
        "lastRunTime": "2024-05-20T21:28:24.556Z",
        "nextDate": "2024-06-28T21:16:20.330Z",
        "repeatMode": 3,
        "interval": "0 10 5,16,23 * * *",
        "level": "5",
        "config": {
            "scheme": "定时任务-启动游戏-喂猫喂狗"
        },
        "lastStopTime": "2024-05-20T21:28:31.317Z",
        "nextOffset": "0,30"
    },
    {
        "id": 5,
        "name": "寮突",
        "desc": "自动寮突",
        "checked": false,
        "lastRunTime": "2023-07-18T23:48:47.042Z",
        "nextDate": "2024-06-28T23:10:00.502Z",
        "repeatMode": 3,
        "interval": "* 10 7 * * *",
        "level": "1",
        "config": {
            "scheme": "定时任务-启动游戏-寮突"
        },
        "lastStopTime": "2023-07-18T23:48:57.810Z"
    },
    {
        "id": 6,
        "name": "地鬼",
        "desc": "自动地鬼",
        "checked": false,
        "lastRunTime": null,
        "nextDate": "2024-06-29T02:00:00.504Z",
        "repeatMode": 3,
        "interval": "* 0 10 * * *",
        "level": "6",
        "config": {
            "scheme": "定时任务-启动游戏-地鬼"
        }
    },
    {
        "id": 7,
        "name": "寮活动(阴门)",
        "desc": "寮活动(阴门), 周五至周日",
        "checked": true,
        "lastRunTime": "2024-06-28T12:05:53.886Z",
        "nextDate": "2024-06-29T12:02:07.318Z",
        "repeatMode": 3,
        "interval": "0 0 20 * * 5,6,0",
        "level": "10",
        "config": {
            "scheme": "庭院进入寮每日活动(包含阴门)"
        },
        "lastStopTime": "2024-06-28T12:10:54.873Z",
        "nextOffset": "0,20"
    },
    {
        "id": 8,
        "name": "寮活动(狩猎)",
        "desc": "寮活动(狩猎), 周一至周四",
        "checked": true,
        "lastRunTime": "2024-06-27T11:00:23.248Z",
        "nextDate": "2024-07-01T11:00:51.715Z",
        "repeatMode": 3,
        "interval": "0 0 19 * * 1-4",
        "level": "10",
        "config": {
            "scheme": "定时任务-启动游戏-庭院进入寮每日活动(包含阴门)"
        },
        "lastStopTime": "2024-06-27T11:04:12.288Z",
        "nextOffset": "0,1"
    },
    {
        "id": 9,
        "name": "寮活动(道馆)",
        "desc": "寮活动(道馆), 周一至周四",
        "checked": true,
        "lastRunTime": "2024-06-28T11:01:23.222Z",
        "nextDate": "2024-06-29T11:01:24.258Z",
        "repeatMode": 3,
        "interval": "0 1 19 * * *",
        "level": "10",
        "config": {
            "scheme": "庭院进入寮每日活动(不包含阴门)"
        },
        "lastStopTime": "2024-06-28T11:28:27.407Z",
        "nextOffset": "0,1"
    },
    {
        "id": 10,
        "name": "寮活动(狭间)",
        "desc": "寮活动(狭间), 周五至周日",
        "checked": false,
        "lastRunTime": "2024-02-11T10:59:02.284Z",
        "nextDate": "2024-06-29T10:59:00.511Z",
        "repeatMode": 3,
        "interval": "0 59 18 * * 5,6,0",
        "level": "10",
        "config": {
            "scheme": "定时任务-启动游戏-庭院进入寮每日活动(不包含阴门)"
        },
        "lastStopTime": "2024-02-11T11:26:37.251Z"
    },
    {
        "id": 11,
        "name": "寮活动(宴会)",
        "desc": "寮活动(宴会), 周五或周日",
        "checked": true,
        "lastRunTime": "2024-06-26T11:26:05.504Z",
        "nextDate": "2024-06-30T11:20:25.622Z",
        "repeatMode": 3,
        "interval": "0 20 19 * * 3,0",
        "level": "9",
        "config": {
            "scheme": "庭院进入寮每日活动(不包含阴门)"
        },
        "lastStopTime": "2024-06-26T11:37:38.550Z",
        "nextOffset": "0,1"
    },
    {
        "id": 12,
        "name": "寮活动(首领)",
        "desc": "寮活动(首领), 周六",
        "checked": true,
        "lastRunTime": "2024-06-22T11:19:03.791Z",
        "nextDate": "2024-06-29T11:05:27.861Z",
        "repeatMode": 3,
        "interval": "0 5 19 * * 6",
        "level": "9",
        "config": {
            "scheme": "庭院进入寮每日活动(不包含阴门)"
        },
        "lastStopTime": "2024-06-22T11:27:13.685Z",
        "nextOffset": "0,1"
    },
    {
        "id": 13,
        "name": "悬赏",
        "desc": "自动悬赏",
        "checked": true,
        "lastRunTime": "2024-06-28T13:50:54.756Z",
        "nextDate": "2024-06-29T01:23:38.363Z",
        "repeatMode": 3,
        "interval": "0 0 9,21 * * *",
        "level": "2",
        "config": {
            "scheme": "定时任务-启动游戏-悬赏"
        },
        "inner": true,
        "lastStopTime": "2024-06-28T13:53:34.673Z",
        "nextOffset": "0,60"
    },
    {
        "id": 14,
        "name": "重启模拟器",
        "desc": "自动判断十分钟后是否有定时任务，否则重启模拟器，注意，目前jio并没有自启动功能，请配合模拟器脚本共同使用",
        "checked": false,
        "lastRunTime": null,
        "nextDate": "2024-06-28T20:00:00.518Z",
        "repeatMode": 3,
        "interval": "* 0 4 * * *",
        "level": "0",
        "config": {
            "scheme": "重启模拟器"
        },
        "inner": true
    },
    {
        "id": 15,
        "name": "每日签到与领取邮箱奖励",
        "desc": "每日签到与领取邮箱奖励",
        "checked": true,
        "lastRunTime": "2024-06-27T22:22:30.762Z",
        "nextDate": "2024-06-28T22:20:40.413Z",
        "repeatMode": 3,
        "interval": "0 10 6 * * *",
        "level": "1",
        "config": {
            "scheme": "定时任务-启动游戏-每日签到与收取邮件"
        },
        "inner": true,
        "lastStopTime": "2024-06-27T22:24:15.403Z",
        "nextOffset": "10,20"
    },
    {
        "id": 16,
        "name": "经验妖怪",
        "desc": "经验妖怪",
        "checked": false,
        "lastRunTime": null,
        "nextDate": "2024-06-28T16:05:00.520Z",
        "repeatMode": 3,
        "interval": "* 5 0 * * *",
        "level": "6",
        "config": {
            "scheme": "定时任务-启动游戏-经验妖怪"
        },
        "inner": true
    },
    {
        "id": 17,
        "name": "金币妖怪",
        "desc": "金币妖怪",
        "checked": true,
        "lastRunTime": "2024-06-28T02:06:38.121Z",
        "nextDate": "2024-06-29T01:55:10.901Z",
        "repeatMode": 3,
        "interval": "0 5 10 * * *",
        "level": "6",
        "config": {
            "scheme": "定时任务-启动游戏-金币妖怪"
        },
        "inner": true,
        "lastStopTime": "2024-06-28T02:07:00.725Z",
        "nextOffset": "-10,10"
    },
    {
        "id": 18,
        "name": "押注",
        "desc": "",
        "checked": false,
        "lastRunTime": null,
        "nextDate": "2024-06-28T15:50:00.524Z",
        "repeatMode": 3,
        "interval": "0 50 11,13,15,17,19,21,23 * * *",
        "level": "1",
        "config": {
            "scheme": "对弈竞猜"
        }
    },
    {
        "id": 19,
        "name": "对弈竞猜",
        "desc": "对弈竞猜",
        "checked": false,
        "lastRunTime": "2024-02-16T15:45:01.495Z",
        "nextDate": "2024-06-28T15:45:00.526Z",
        "repeatMode": 3,
        "interval": "0 45 11,13,15,17,19,21,23 * * ? *",
        "level": "10",
        "config": {
            "scheme": "定时任务-启动游戏-对弈竞猜"
        },
        "inner": true,
        "lastStopTime": "2024-02-16T15:45:14.885Z"
    }
];

export default ScheduleDefaultList;
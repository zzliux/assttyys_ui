import { createWebHashHistory, createRouter } from 'vue-router';
import SchemeManagementPage from './SchemeManagementPage.vue';
import FunctionManagementPage from './FunctionManagementPage.vue';
import SettingsPage from './SettingsPage.vue';
import SchedulerPage from './SchedulerPage.vue';


const routes = [
    { name: 'SchemeManagementPage', path: '/', component: SchemeManagementPage },
    { name: 'SchemeManagementPage', path: '/SchemeManagementPage', component: SchemeManagementPage },
    { name: 'FunctionManagementPage', path: '/FunctionManagementPage', component: FunctionManagementPage },
    { name: 'SettingPage', path: '/SettingPage', component: SettingsPage },
    { name: 'SchedulerPage', path: '/SchedulerPage', component: SchedulerPage },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const routesDefine = [
    // { name: 'ASSTTYYS' },
    { name: '方案管理', path: '/SchemeManagementPage' },
    { name: '定时任务', path: '/SchedulerPage' },
    { name: '设置', path: '/SettingPage' },
    // { name: '功能管理', parent: '方案管理', path: '/FunctionManagementPage' },
]
export { routesDefine };
export default router;

import { createWebHashHistory, createRouter } from 'vue-router';
import SchemeManagementPage from './SchemeManagementPage.vue';
import FunctionManagementPage from './FunctionManagementPage.vue';

const routes = [
    { path: '/SchemeManagementPage', component: SchemeManagementPage },
    { path: '/FunctionManagementPage', component: FunctionManagementPage },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const routesDefine = [
    { name: 'ASSTTYYS' },
    { name: '方案管理', parent: 'ASSTTYYS', path: '/SchemeManagementPage' },
    { name: '定时任务', parent: 'ASSTTYYS', path: '/SchedulerPage' },
    { name: '设置', parent: 'ASSTTYYS', path: '/SettingPage' },
    { name: '功能管理', parent: '方案管理', path: '/FunctionManagementPage' },
]
export { routesDefine };
export default router;

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

export default router;

import { createWebHashHistory, createRouter } from 'vue-router';
import SchemeManagementPage from './SchemeManagementPage.vue';
import FunctionManagementPage from './FunctionManagementPage.vue';
import SettingsPage from './SettingsPage.vue';
import SchedulerPage from './SchedulerPage.vue';
import OauthGithub from './OauthGithub.vue';
import Home from './Home.vue';


const routes = [
    { name: 'Home', path: '/', component: Home },
    { name: 'SchemeManagementPage', path: '/SchemeManagementPage', component: SchemeManagementPage },
    { name: 'FunctionManagementPage', path: '/FunctionManagementPage', component: FunctionManagementPage },
    { name: 'SettingPage', path: '/SettingPage', component: SettingsPage },
    { name: 'SchedulerPage', path: '/SchedulerPage', component: SchedulerPage },
    { name: 'OAuth', path: '/OAuth', component: OauthGithub },
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
];

// 修改为使用外部浏览器进行登录认证，不使用内部登录
// 处理github回调过来时的登录认证
// if (window.location.href.includes('?code=')) {
//     const [_all, url, code] = window.location.href.match(/^(.+)\?code=([^&#]+)/);
//     // const code = window.location.href.split('?code=')[1];
//     sessionStorage.setItem('code', code);
//     // TODO 该方式会丢失context-path，如果是二级目录部署，或file://文件协议访问，该回跳的方式就会有问题
//     window.location.href = `${url}#/OAuth`;
//     // router.push('/OAuth');
// }


export { routesDefine };
export default router;

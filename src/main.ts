import './assets/main.css';

import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css';

import App from './App.vue';
import router from './pages/router';
import { AutoWeb } from './tools/AutoWeb';

const app = createApp(App);

app.use(ElementPlus, {
    locale: zhCn,
});
app.use(router);
app.config.performance = true;

app.mount('#app');

declare global {
    interface Window {
        routeBack: () => void;
        routeBackFlag: boolean;
        loadScheduleData: Function;
        resumeValidUser: Function;
    }
}
window.routeBack = function () {
    // if (window.history.state.back) {
    //     router.back();
    if (!(router.currentRoute.value.name as string).includes('SchemeManagementPage') && window.history.state.back) {
        router.back();
    } else {
        if (window.routeBackFlag) {
            AutoWeb.autoPromise('exit');
        } else {
            window.routeBackFlag = true;
            AutoWeb.autoPromise('toast', '再按一次退出程序');
            setTimeout(() => {
                window.routeBackFlag = false;
            }, 1500)
        }
    }
}
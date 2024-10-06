import FullLoading from "@/components/DebouncedFullLoading";
import { type AutoWebTypes } from "./declares";
import MockMethod from "./Mocks/MockMethod";
import { uuid } from "./tools";

// 搞不定@auto.pro/web的编译毛病，直接copy过来了
let emit: any = prompt;


export const AutoWeb = {
    setMode(mode: string) {
        emit = (window as any)[mode] || prompt;
    },
    devicelly(deviceFn: string, ngFn: Function, self: any, once = false) {
        (window as any)[deviceFn] = (...option: any) => {
            const result = ngFn.apply(self || this, option);
            if (once) {
                delete (window as any)[deviceFn];
            }
            return result;
        };
    },
    removeDevicelly(deviceFn: string) {
        delete (window as any)[deviceFn];
    },
    auto<Key extends keyof AutoWebTypes>(eventname: Key, params?: AutoWebTypes[Key]['param'], callback?: (arg: AutoWebTypes[Key]['result']) => void) {
        if (callback) {
            const EVENT_ID = eventname + uuid()
            this.devicelly(EVENT_ID, callback, this, true);
            return emit(eventname, JSON.stringify({
                params,
                PROMPT_CALLBACK: EVENT_ID
            }));
        }
        else {
            return emit(eventname, JSON.stringify(params));
        }
    },

    autoPromise<Key extends keyof AutoWebTypes>(eventname: Key, params?: AutoWebTypes[Key]['param'], timeout = 30000): Promise<AutoWebTypes[Key]['result']> {
        FullLoading.show();
        return new Promise((resolve, reject) => {
            const tmid = setTimeout(() => {
                reject(new Error('timeout'));
                FullLoading.close();
            }, timeout);
            this.auto(eventname, params, (result: AutoWebTypes[Key]['result']) => {
                clearTimeout(tmid);
                resolve(result);
                FullLoading.close();
            });
        })
    }
};


// // 调试模式
// localStorage.setItem('debug', '1');
if (localStorage.getItem('debug')) {
    (window as any)['promptMock'] = function <Key extends keyof AutoWebTypes>(key: Key, paramStr?: string) {
        setTimeout(() => {
            const param = JSON.parse(paramStr);
            let result: any;
            result = MockMethod[key](param.params);
            console.log(`[autoweb::request:${key}]`, param.params);
            console.log(`[autoweb::response:${key}]`, result);
            (window as any)[param.PROMPT_CALLBACK](result);
        }, Math.floor(Math.random() * 9999999) % 190 + 10); // 模拟异步延时
    };
    AutoWeb.setMode('promptMock')
}
import { type AutoWebTypes } from "./declares";
import mockData from "./mockData";
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

    autoPromise<Key extends keyof AutoWebTypes>(eventname: Key, params?: AutoWebTypes[Key]['param'], timeout = 10000): Promise<AutoWebTypes[Key]['result']> {
        return new Promise((resolve, reject) => {
            const tmid = setTimeout(() => {
                reject(new Error('timeout'));
            }, timeout);
            this.auto(eventname, params, (result: AutoWebTypes[Key]['result']) => {
                clearTimeout(tmid);
                resolve(result);
            });
        })
    }
};


// 调试模式
if (localStorage.getItem('debug')) {
    (window as any)['promptMock'] = function <Key extends keyof AutoWebTypes>(key: Key, paramStr?: string) {
        const param = JSON.parse(paramStr);
        let result: any;
        if (typeof mockData[key] === 'function') {
            result = mockData[key](param.params);
        } else {
            result = mockData[key];
        }
        (window as any)[param.PROMPT_CALLBACK](result);
    };
    AutoWeb.setMode('promptMock')
}
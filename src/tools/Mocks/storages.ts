// 实现autojs的storage，以便于在前端进行调试开发
// 使用localStorage实现
export class Storage {
    name: string;

    constructor(name: string) {
        this.name = name;
        if (!localStorage.getItem(name)) {
            localStorage.setItem(name, '{}');
        }
    }
    get(key: string, defaultValue?: any) {
        const data = localStorage.getItem(this.name);
        const val = data ? JSON.parse(data)[key] : undefined;
        return val || defaultValue;
    }
    put(key: string, value: any) {
        const data = localStorage.getItem(this.name);
        const obj = data ? JSON.parse(data) : {};
        obj[key] = value;
        localStorage.setItem(this.name, JSON.stringify(obj));
    }
    remove(key: string) {
        const data = localStorage.getItem(this.name);
        if (data) {
            const obj = JSON.parse(data);
            delete obj[key];
            localStorage.setItem(this.name, JSON.stringify(obj));
        }
    }
    contains(key: string) {
        const data = localStorage.getItem(this.name);
        return data ? Object.keys(JSON.parse(data)).includes(key) : false
    }
    clear() {
        localStorage.removeItem(this.name);
    }
}


export const storages = {
    create(name: string) {
        return new Storage(name);
    },
    remove(name: string) {
        localStorage.removeItem(name);
    }
}

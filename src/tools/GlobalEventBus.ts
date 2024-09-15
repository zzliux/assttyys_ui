import mitt from 'mitt';
import type { Scheme } from './declares';

type Events = {
    // scheme卡片的操作事件，主要用于通知其它模块如方案管理页对展示数据进行更新
    'Event.SchemeItemCard.Operation': {
        type: 'copy' | 'modify' | 'delete' | 'toTop',
        targetScheme: Scheme,
        newScheme?: Scheme, // copy/modify/toTop操作时会返回一个新对象出来
    },
};

const emitter = mitt<Events>();

export default emitter;

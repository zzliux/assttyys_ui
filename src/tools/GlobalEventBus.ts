import mitt from 'mitt';
import type { GroupSchemeName, Scheme } from './declares';

type Events = {
    // scheme卡片的操作事件，主要用于通知其它模块如方案管理页对展示数据进行更新
    'Event.SchemeItemCard.Operation': {
        type: 'copy' | 'modify' | 'remove',
        targetScheme: Scheme,
        newScheme?: Scheme, // copy/modify/toTop操作时会返回一个新对象出来
    } | {
        type: 'reSort',
        targetScheme: Scheme,
        groupSchemeNames: GroupSchemeName[],
    },
};

const emitter = mitt<Events>();

export default emitter;

import mitt from 'mitt';

type Events = {
    'Event.FixedCollapse.ModelUpdate': string, // 由FixedCollapse传递给FixedCollapseItem的model更新事件
    'Event.FixedCollapseItem.ModelUpdate': string, // 由FixedCollapseItem传递给FixedCollapse的model更新事件
};

const emitter = mitt<Events>();

export default emitter;

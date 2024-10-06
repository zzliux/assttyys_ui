import type { CommonConfigItem } from "@/tools/declares";

const CommonConfig: CommonConfigItem[] = [{
	desc: '通用配置',
	config: [
		{
			name: 'loopDelay',
			desc: '循环延时',
			type: 'integer',
			default: 200,
		},
		{
			name: 'afterClickDelayBase',
			desc: '点击后延时基数',
			type: 'integer',
			default: 0,
		},
		{
			name: 'afterClickDelayRandom',
			desc: '点击后延时随机数',
			type: 'integer',
			default: 200,
		},
		{
			name: 'colorSimilar',
			desc: '多点比色相似度(%)',
			type: 'integer',
			default: 93,
		},
		{
			name: 'multiColorSimilar',
			desc: '多点找色相似度(%)',
			type: 'integer',
			default: 97,
		}
	]
}];

export default CommonConfig;
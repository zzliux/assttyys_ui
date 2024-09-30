import { type SettingItem } from '../../declares';

const SettingList: SettingItem[] = [{
    desc: '点击/滑动模式',
    name: 'tapType',
    type: 'assttyys_setting',
    stype: 'list',
    data: ['无障碍', 'Root', 'Shell', 'RootAutomator'],
    value: '无障碍'
},
{
    desc: '无障碍服务(仅使用无障碍模式时生效)',
    name: 'autoService',
    type: 'autojs_inner_setting_auto_service',
    enabled: true
},
{
    desc: '截图权限',
    name: 'screenCapturePermission',
    type: 'autojs_inner_settings_capture_permission',
    enabled: true
},
{
    desc: '悬浮窗权限',
    name: 'floatyPerminssion',
    type: 'autojs_inner_setting_floaty_permission',
    enabled: true
},
{
    desc: '音量上键停脚本及程序',
    name: 'stop_all_on_volume_up',
    type: 'autojs_inner_setting',
    enabled: false
},
{
    desc: '前台服务',
    name: 'foreground_service',
    type: 'autojs_inner_setting',
    enabled: true
},
{
    desc: '忽略电池优化',
    name: 'ignoreBatteryOptimization',
    type: 'autojs_inner_setting_power_manage',
    enabled: true
},
{
    desc: '允许不受信任触摸的事件穿透',
    name: 'unTrunstedTouchStatus',
    type: 'autojs_inner_setting_unTrunstedTouchStatus',
    enabled: true
},
{
    desc: '悬浮选择方案后是否直接启动脚本',
    name: 'floaty_scheme_direct_run',
    type: 'assttyys_setting',
    enabled: true
},
{
    desc: '悬浮启动脚本是否启动关联应用',
    name: 'floaty_scheme_openApp',
    type: 'assttyys_setting',
    enabled: false
},
{
    desc: '调试绘制',
    name: 'floaty_debugger_draw',
    type: 'assttyys_setting',
    stype: 'switch',
    enabled: false
},
{
    desc: 'OCR扩展类型',
    name: 'ocrType',
    type: 'assttyys_setting',
    stype: 'list',
    data: ['MlkitOcr', 'YunxiOcr'],
    value: 'MlkitOcr'
},
{
    desc: 'OCR扩展',
    name: 'ocr_extend',
    type: 'assttyys_setting_ocr_extend',
    enabled: true
},
{
    desc: '关联应用停止模式',
    name: 'kill_related_app_mode',
    type: 'assttyys_setting',
    stype: 'list',
    data: ['root', 'android api'],
    value: 'android api'
},
{
    desc: '消息推送方式',
    name: 'push_type',
    type: 'assttyys_setting',
    stype: 'list',
    data: ['关闭推送', 'Gotify', 'oneBot', 'pushplus', 'Server酱'],
    value: 'oneBot'
},
{
    desc: 'OneBot版本',
    name: 'oneBot_version',
    type: 'assttyys_setting',
    stype: 'list',
    data: ['11', '12'],
    value: '12'
},
{
    desc: '推送地址',
    name: 'oneBot_url',
    type: 'assttyys_setting',
    stype: 'text',
    value: 'http://192.168.31.55:16727/icqq/1989781937/V12/send_message?user_id=416918875&access_token=666666'
},
{
    desc: '推送内容前缀',
    name: 'msgPush_prefix',
    type: 'assttyys_setting',
    stype: 'text',
    value: '[MuMu][zz]'
},
{
    desc: '推送图片缩放大小，取值范围(0,1]，1为原始大小图片，默认值0.5',
    name: 'msgPush_imageScale',
    type: 'assttyys_setting',
    stype: 'text',
    value: '0.5'
},
{
    desc: '远程日志地址',
    name: 'remote_log_url',
    type: 'assttyys_setting',
    stype: 'text',
    value: ''
}];

export default SettingList;

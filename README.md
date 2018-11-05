# vktool
wechat lite app plugin

由于wx很多方式在插件中得不到支持，项目改写为微信组件方式，请移步
https://github.com/myzingy/wx-vktool

	
vktool promise date_format cache
	
1，wx接口promise化 2，提供help函数

插件封装了wx.request api，想提供便捷的接口访问能力；但wx框架视此行为为插件内请求，所以不要使用插件request方法；

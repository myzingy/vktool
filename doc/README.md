# vktool
提供方便快捷开发方式，提高开发效率；请先在app.json引入本插件
## 基本使用：推荐使用方式1
### 使用方式1，直接注入 app.js 中
直接注入到app.js 中，之后通过getApp()方式调用；
#### 第一步 在 app.js 引入
````
// app.js
var {vk,regeneratorRuntime} = requirePlugin("myPlugin")
App({
  ...vk,
  regeneratorRuntime:regeneratorRuntime,
  onLaunch: function () {
      this.config({
          requst:{
            ret:'code',
              code:0,
          }
      })
  },
  onHide(){
      this.cache_clear()
  }
})
````
#### 第二步 在页面中调用
````
// pages/order/list.js
const {regeneratorRuntime} = getApp()
Page({
  onLoad: async function() {
    console.log(getApp());
    getApp().cache('cache.over','默认是永久缓存');
    getApp().cache('cache.timeout.5min',{tip:'第三参数是过期时间，单位秒，5分钟就传300'},300);
    let data= await getApp().cache('cache.over');
    console.log('data',data);
    getApp().requst({
        url:'https://www.test.com/?s=App.Reserve.SellerInfo',
        data:{
            seller_id:1,
            seller_openid:'o9pcQ0cbjRKnRWczcOJaaSRGP1lE',
            manager_id:500
        }
    })
  }
})
````

### 使用方式2，只在具体页面中单独使用
在单个 Page 中引入使用，如 /pages/order/list.js中 
````
// pages/order/list.js
var {vk,regeneratorRuntime} = requirePlugin("myPlugin")
Page({
  onLoad: async function() {
    console.log(vk);
    vk.cache('cache.over','默认是永久缓存');
    vk.cache('cache.timeout.5min',{tip:'第三参数是过期时间，单位秒，5分钟就传300'},300);
    let data= await vk.cache('cache.over');
    console.log('data',data);
    vk.requst({
        url:'https://www.test.com/?s=App.Reserve.SellerInfo',
        data:{
            seller_id:1,
            seller_openid:'o9pcQ0cbjRKnRWczcOJaaSRGP1lE',
            manager_id:500
        }
    })
  }
})
````

# helper 函数

###以下函数根据引用方式，可以通过 getApp() 或 vk 进行调用

# date_format(ns,format='YYYY年MM月DD日')
将时间戳（整型10位）格式化为format中定义的格式

format 指令如下：
 YYYY年 MM月 DD日 HH时 II分 SS秒 WEEK周几 DAY(今天/明天/日期)
 
 示例 
 
     getApp().date_format(1539588251,'MM-DD HH:II')  //10-15 15:24
     
     getApp().date_format(1539588251,'周WEEK MM-DD HH:II')  //周一 10-15 15:24 
     
     getApp().date_format(1539588251,'\`DAY/MM-DD\` HH:II')  //今天 15:24  
     getApp().date_format(1542266651,'\`DAY/MM-DD\` HH:II')  //11-15 15:24 
     
     \`DAY/MM-DD\` 会计算是不是今天或明天，如果不是，则使用MM-DD
 
### strtotime
将 日期时间串 转化为时间戳（整型10位）
getApp().strtotime('2018-11-15 15:24:11') //1542266651
getApp().strtotime('2018/11/15 15:24:11') //1542266651

### time
获取当前时间戳
getApp().time() //1542266651

### toast(msg,icon='none')
getApp().toast('提示信息')   //wx.showToast 的封装

### cache(key,value,timeout=-1)  
    带有过期时间的异步存储，需要使用await then 方式；timeout单位是秒， 默认-1为永久存储

 保存信息： 
 
     cache('键值','数据',600)//保存10分钟，10分钟后失效
     cache('键值','数据').then(res=>{})
     await cache('键值','数据')
 
 读取信息：
 
1. 使用then
    ````
    getApp().cache('键值').then(data=>{
        console.log(data) //数据
    }).catch(res=>{
        //没有找到'键值'对应的数据或数据已失效
    })
    ````
2. 使用await
    ````
    try{
        let d=await getApp().cache('键值');
        console.log(data) //数据
    }catch(e){}
    ````
    
### cache_clear
    请将此函数放在 app.js onHide 中，自动清理过期缓存，防止垃圾缓存造成系统负担
    目前wx组件接口不支持getStorageInfo，无法正常工作
    
### val(e)
    获取 input/textarea 值，e必须是bind事件传入的event 
   
### attr(e,key="")
    获取 dom 上自定义的data-key="value" 的值，e必须是bind事件传入的event，key 就是 data-key 后面的key，key为空时，返回所有自定义的 data 的键值对数据；
    
### http_build_query(param,url='')
     将 param 键值对拼接成 url 参数，如 key1=val1&key2=val2
     如果传递了 url，则会拼接 url?key1=val1&key2=val2,
     如果 url中已经有 ? 则自动变为 url&key1=val1&key2=val2
     
### promise(wxapi,param={})
    微信api promise化，可以使用 then 或 await 进行处理,param 微信api所要传递的参数
    如：网络请求
    getApp().promise('wx.request',{
        url:'https://www.test.com/api',
        data:{p:1}
    }).then(res=>{
        console.log(res)
    });
    
    如：获得系统信息
    let sys= await getApp().promise('getSystemInfo');
    console.log(sys)
   
### requst(param,fouce=false)   
    网络请求的封装，实现了
        自动缓存，缓存未失效时，直接使用缓存数据；
        loading 效果，可以通过 config 自定义
        全局错误处理，需要通过 config 配置
网络请求        
````
getApp().requst({
    url:'https://www.test.com/?s=App.Reserve.SellerInfo',
    data:{
        seller_id:1,
        seller_openid:'o9pcQ0cbjRKnRWczcOJaaSRGP1lE',
        manager_id:500
    }
    //支持 wx.requst 所有参数，以下为扩展参数
    
    loading:true,   //显示loading效果，默认不显示
    timeout:600,    //缓存十分钟，默认不缓存，-1为永久缓存
    
}).then(res=>{
    console.log(res);
})
````
### config(conf={})
    配置插件，处理数据更加灵活,conf 参数请查看源码说明    
    

## 组件库
### nav
### formids

![链接](./example.jpeg)






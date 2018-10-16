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
 
 date_format(1539588251,'MM-DD HH:II')  //10-15 15:24
 
 date_format(1539588251,'周WEEK MM-DD HH:II')  //周一 10-15 15:24 
 
 date_format(1539588251,'\`DAY/MM-DD\` HH:II')  //今天 15:24  
 date_format(1542266651,'\`DAY/MM-DD\` HH:II')  //11-15 15:24 
 
 \`DAY/MM-DD\` 会计算是不是今天或明天，如果不是，则使用MM-DD
 
### strtotime
将 日期时间串 转化为时间戳（整型10位）
strtotime('2018-11-15 15:24:11') //1542266651
strtotime('2018/11/15 15:24:11') //1542266651

### time
获取当前
### config
## 组件库
### nav
### formids

![链接](./example.jpeg)






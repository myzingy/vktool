const {regeneratorRuntime} = getApp()
Page({
  onLoad: async function() {
    console.log(getApp());
    getApp().cache('cache.over','默认是永久缓存');
    getApp().cache('cache.timeout.5min',{tip:'第三参数是过期时间，单位秒，5分钟就传300'},300);
    let data= await getApp().cache('cache.over');
    console.log('data',data);
    getApp().requst({
        url:'https://xt05.colorcun.com/?s=App.Reserve.SellerInfo',
        data:{
            seller_id:1,
            seller_openid:'o9pcQ0cbjRKnRWczcOJaaSRGP1lE',
            manager_id:500
        }
    })
  }
})
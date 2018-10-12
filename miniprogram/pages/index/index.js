var {vk,regeneratorRuntime} = requirePlugin("myPlugin")
Page({
  onLoad: async function() {
    console.log(vk);
    vk.cache('cache.over','默认是永久缓存');
    vk.cache('cache.timeout.5min',{tip:'第三参数是过期时间，单位秒，5分钟就传300'},300);
    let data= await vk.cache('cache.over');
    console.log('data',data);

  }
})
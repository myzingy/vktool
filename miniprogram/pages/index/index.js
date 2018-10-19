const {regeneratorRuntime} = getApp()
Page({
  data:{
    loading:{},
    dates:[],
  },
  onLoad: async function() {
    console.log(getApp());
    // getApp().cache('cache.over','默认是永久缓存');
    // getApp().cache('cache.timeout.5min',{tip:'第三参数是过期时间，单位秒，5分钟就传300'},300);
    // let data= await getApp().cache('cache.over');
    // console.log('data',data);
    // getApp().requst({
    //     url:'https://xt05.colorcun.com/?s=App.Reserve.SellerInfo',
    //     data:{
    //         seller_id:1,
    //         seller_openid:'o9pcQ0cbjRKnRWczcOJaaSRGP1lE',
    //         manager_id:500
    //     }
    // })
    let dates=[];
    let formats=['YYYY年MM月DD日','YYYY==MM==DD','YYYY-MM-DD HH:II:SS','YYYY-MM-DD [周WW] HH:II:SS'];
    formats.forEach(format=>{
      dates.push({
        format:format,
        val:getApp().date_format(1234567890,format)
      });
    })
    let loc
    try {
      loc=await getApp().promise('wx.getLocation',{
        type:'gcj02',
      })
    }catch (e){
      console.log(e);
      loc={用户为授权或获取位置失败:e.errMsg};
    }

    this.setData({
      dates:dates,
      location:JSON.stringify(loc),
    })
  },
  onShow(){

  },
  async tapEvent(e){
    let type=getApp().attr(e,'type');
    console.log('type',type);
    this.setData({
      [`loading.`+type]:true,
    })
    switch(type){
      case 'cwrite':
        await getApp().cache('cache.over','这是缓存串，也可以是object');
        break;
      case 'cread':
        try {
          let info=await getApp().cache('cache.over');
          getApp().toast(info);
        }catch (e){
          getApp().toast('没有任何缓存');
        }
        break;
      case 'cwrite5':
        await getApp().cache('cache.5s',{info:'我只会缓存5秒'},5);
        break;
      case 'cread5':
        try {
          let data = await getApp().cache('cache.5s');
          getApp().toast(data.info||'5秒缓存已过期');
        }catch (e){
          getApp().toast('没有任何缓存');
        }
        break;
    }
    this.setData({
      [`loading.`+type]:false,
    })
  },
  goHome(e){
    console.log(e)
    wx.reLaunch({
      url:'/pages/index/index'
    })
  },
  navigateGo(e){
    console.log(e)
    wx.navigateTo({
      url:'./view'
    });
  }
})
// components/nav/nav.js
import {vk,regeneratorRuntime} from '../../index';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    backgroundColor:{
      type:String,
        value:'#ffffff'
    },
      color:{
          type:String,
          value:'#000000'
      },
    hasHome:{
        type:Boolean,
          value:false
      },
  },

  /**
   * 组件的初始数据
   */
  data: {
    disHome:false,
      disBack:false,
  },

    attached(){
        this.init();
    },
  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      wx.navigateBack()
    },
      home(){
        if(!this.data.disHome) return;
        this.triggerEvent('home');
      },
      async init(){
        let wxBarHeight=68;
        let disBack = false;
        let disHome = false;
        let pages=getCurrentPages();

        if (pages.length > 1) {
            disBack = true;
        } else {
            if (this.data.hasHome) {
                disHome = true;
            }
        }
        let statusBarHeight=40;
        try{
          let system = await vk.promise('wx.getSystemInfo');
          console.log('system',system);
          statusBarHeight=system.statusBarHeight
            *(system.system.toLowerCase().indexOf('ios')>-1?2:system.pixelRatio);
        }catch(e){}
        this.setData({
            statusBarHeight: statusBarHeight,
            disHome: disHome,
            disBack: disBack,
            statusBarHeightFull:wxBarHeight + statusBarHeight,
        })
        console.log('this.setData',this.data);
      },
  }
})

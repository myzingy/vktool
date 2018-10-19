Component({
    properties:{
        url:String,
        openType:{
            type: String,
            value:'navigate',
        },
    },
    data:{

    },
    methods:{
        formSubmit: function(e) {
            console.log('formids',e.detail.formId)
            if("the formId is a mock one"!=e.detail.formId){
                let formids=wx.getStorageSync('formids') || [];
                formids.push(e.detail.formId);
                formids=[...new Set(formids)];
                wx.setStorage({key:'formids',data:formids});
            }
            this.triggerEvent("click");
            if(this.data.url || this.data.openType!='navigate'){
                let obj={url:this.data.url};
                switch (this.data.openType){
                    case 'navigate':
                        wx.navigateTo(obj)
                        break;
                    case 'redirect':
                        wx.redirectTo(obj)
                        break;
                    case 'switchTab':
                        wx.switchTab(obj)
                        break;
                    case 'reLaunch':
                        wx.reLaunch(obj)
                        break;
                    case 'navigateBack':
                        wx.navigateBack(obj)
                        break;
                    case 'exit':
                        break;
                }
            }
        },
    },
    attached(){
        //console.log('this.data',this.data);
    }
})
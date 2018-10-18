import regeneratorRuntime from '../lib/regenerator/runtime-module'
/**
 * 时间戳转为时间
 * @param ns
 * @param format
 * @returns {string|*}
 */
function date_format(ns,format) {
    var result;
    var time = new Date(ns*1000);
    //result=format || 'YYYY年MM月DD日 HH时II分SS秒 WW';
    result=format || 'YYYY年MM月DD日';
    //console.log(format);
    result=result.toUpperCase();
    result=result.replace('YYYY',time.getFullYear());
    var m=time.getMonth()+1;
    result=result.replace('MM',m>9?m:"0"+m);
    var d=time.getDate();
    result=result.replace('DD',d>9?d:'0'+d);
    var hh=time.getHours();
    result=result.replace('HH',hh>9?hh:'0'+hh);
    var ii=time.getMinutes();
    result=result.replace('II',ii>9?ii:'0'+ii);
    var ss=time.getSeconds();
    result=result.replace('SS',ss>9?ss:'0'+ss);
    var week;
    switch (time.getDay()) {
        case 0:week="日";break
        case 1:week="一";break
        case 2:week="二";break
        case 3:week="三";break
        case 4:week="四";break
        case 5:week="五";break
        case 6:week="六";break
    }
    result=result.replace('WW',week);
    if(format.indexOf('DAY')>0){
        // 获取当天 0 点的时间戳
        var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;

        var day1 = timeStamp+86400//今天结束
        var day2 = day1+86400//明天结束

        //console.log('ns<day.getTime()',timeStamp,ns,day1,day2)

        if(ns>=timeStamp && ns<day1){
            result=result.replace('DAY','今天');
        }else{
            if(ns>=day1 && ns<day2){
                result=result.replace('DAY','明天');
            }else{
                result=result.replace('DAY','');
            }
        }
    }
    if(format.indexOf('`')>0){
        result=result.replace(/`(.*)\/(.*)`/ig,function($0,$1,$2){
            return $1||$2;
        });
    }
    return result;
}


/**
 * 时间串转为时间戳
 * @param datestr 1970/01/01 01:01:01
 * @returns int(10)
 */
function strtotime(datestr)
{
    datestr=datestr.replace(/-/g,'/');
    return parseInt(new Date(datestr)/1000);
}


module.exports = {
    _config:{
        requst:{
            method:'POST',
            dataType:'json',
            header:{

            },
            statusKey:'Response',//Response 则使用网络请求状态判断，其它值则使用res.StatusKey 进行判断
            statusCode:200, //正常返回结果 StatusKey的值 == StatusCode 视为正常结果

            msgKey:'msg',   //错误信息的key
            infoCode:201,   //一般性 toast 提示信息，如字段必填等
            errorCode:-1,  //严重错误，如登录超时
            infoFun:(res)=>{
                this.toast(res[this._config.requst.msgKey])
            },
            errorFun:(res=>{
                this.toast(res[this._config.requst.msgKey])
            }),
        }
    },
    config(conf){
        Object.keys(conf).forEach(key=>{
            this._config[key]={...conf[key],...this._config[key]}
        })
    },
    date_format: date_format,
    strtotime:strtotime,
    time(hhiiss=''){
        if(hhiiss==''){
            return parseInt(new Date()/1000);
        }
    },

    toast:function(title,icon='none'){
        wx.showToast({
            title:title,
            mask:true,
            icon:icon
        })
    },

    /**
     * 读取或设置 异步缓存
     * @param key
     * @param value
     * @param timeout (s)
     * @returns {*}
     */
    cache:async function(key,value,timeout=-1){
        if(value){
            if(timeout!=-1){
                timeout=this.time()+timeout
            }
            return this.promise('wx.setStorage',{
                key:key,
                data:{
                    data:value,
                    timeout:timeout
                }
            })
        }else{
            let cache=await this.promise('wx.getStorage',{
                key:key,
            })
            if(cache.data){
                if(cache.data.timeout==-1 || cache.data.timeout>this.time()){
                    return cache.data.data;
                }
            }
            return false;
        }
    },
    /**
     * 请将此函数放在 app.js onHide 中，自动清理过期缓存，防止垃圾缓存造成系统负担
     * 目前wx组件接口不支持getStorageInfo，无法正常工作
     */
    cache_clear(){
        console.log('obHide');
        let time=new Date()/1000;
        this.promise('wx.getStorageInfo').then(res=>{
            console.log(res.keys);
            if(res.keys.length>0){
                res.keys.forEach(key=>{
                    this.promise('wx.getStorage',{key:key}).then(ca=>{
                        if(ca.data.timeout && ca.data.timeout<time && ca.data.timeout!=-1){
                            wx.removeStorage({key:key})
                        }
                    })
                })
            }
        })
    },

    val:function(e){
        return e.detail.value;
    },

    attr:function(e,key=""){
        if(!key){
            return e.currentTarget.dataset;
        }
        return e.currentTarget.dataset[key];
    },

    http_build_query(obj,url=''){
        let ps=[]
        for(let i in obj){
            if(typeof obj[i]=='undefined' || obj[i]==null) continue;
            ps.push(i+'='+obj[i].toString())
        }
        ps=ps.join('&');
        if(!url){
            return ps;
        }
        url+=(url.indexOf('?')>-1?'&':'?')+ps;
        return url;
    },

    promise(wxapi,param={}){
        return new Promise(function(success,fail){
            param.success=function(res){
                console.log(wxapi+'.success',param,res)
                success(res)
            }
            param.complete=function(res){
                console.log(wxapi+'.complete',param,res)
            }
            param.fail=function(res){
                console.log(wxapi+'.fail',param,res)
                fail(res)
            }
            let apikey=wxapi.replace('wx.','');
            if(wx[apikey]){
                wx[apikey](param)
            }else{
                fail({errMsg:wxapi+' is undefined'})
            }
        })
    },

    /**
     * 网络请求封装
     * @param param
     * @param fouce
     * @returns {*}
     */
    async requst(param,fouce=false){
        let requst_url=this.http_build_query(param.data||{},param.url);
        let cache_key=requst_url.replace(/http.*\//,'');
        console.log('requst.url',requst_url,cache_key)
        if(fouce=='clear' || fouce=='clean'){
            return this.promise('wx.removeStorage',{key:cache_key})
        }
        let cache_data=false;
        if(!fouce){//从缓存中获取
            try {
                cache_data= await this.promise('wx.getStorage',{key:cache_key})
                if(cache_data) {
                    cache_data.isCache=true;
                    return cache_data;
                }
            }catch (e){}

        }
        let res=await this.promise('wx.request',param);
        if(this._config[`request.statusKey`]=='Response'){

        }


    }
}








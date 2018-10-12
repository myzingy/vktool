//app.js
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
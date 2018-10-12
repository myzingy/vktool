//app.js
var {vk,regeneratorRuntime} = requirePlugin("myPlugin")
App({
  onLaunch: function () {
  },
  onHide(){
      vk.cache_clear()
  }
})
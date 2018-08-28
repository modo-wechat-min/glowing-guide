let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    hidden: false,
    scoreObj:"",
  },
  onLoad: function (options) {
    this.getStore();
  },
getStore(){
  let UserID = util.getStorage("userID", true);
  let openId = util.getStorage("openId");
  let _this = this;
  wx.request({
    url: ports.modoHttp + "API/WeChatMiniProgram/GetUserBalance?UserID=" + UserID + "&OpenID=" + openId,
    method: 'get',
    success: function (res) {
      console.log(res)
      _this.setData({
        scoreObj: res.data,
        hidden: true,
      })
    },
  })
}
})
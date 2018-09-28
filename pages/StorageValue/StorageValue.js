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
  let UserID = util.getStorage("userID");
  let openId = util.getStorage("openId");
  let _this = this;
  wx.request({
    url: ports.modoHttp + "API/WeChatMiniProgram/GetUserBalance?UserID=" + UserID + "&OpenID=" + openId,
    method: 'get',
    header: {
      "Authorization": openId,
    }, 
    success: function (res) {
      _this.setData({
        scoreObj: res.data,
        hidden: true,
      })
    },
    complete: function (res) {
      if (res.statusCode === 401) {
        util.throwMsg("非法请求");
        util.setStorage('userID', "", false);
        return;
      }
    }
  })
}
})
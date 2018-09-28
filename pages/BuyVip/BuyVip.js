let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    options:"",
    isVip:"",
    ImageUrl: ports.imgUrl + 'buy-vip.jpg',
  },
  onLoad: function (options) {
    this.checkUserIsMember();
    this.setData({
      options: options ? options:{},
    })
  },
  checkUserIsMember(){
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/CheckUserIsMember?UserID=" + UserID ,
      method: 'get',
      header: {
        "Authorization": OpenID,
      },
      success: function (res) {
        _this.setData({
          isVip: res.data,
        });
        if (res.data){
          wx.setNavigationBarTitle({
            title: "VIP会员",//页面标题为路由参数
          })
        }
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
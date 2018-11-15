let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');

Page({
  data: {
    resData: {},
    UserID: "",
    OpenID: "",
    ImageUrl: [
      ports.imgUrl + 'vip_bai.png',
      ports.imgUrl + 'vip_huang.png',
      ports.imgUrl + 'vip_bo.png',
      ports.imgUrl + 'vip_zuan.png',
    ],
    swiperCurrent: 0,
    upgradeArray: []
  },
  onLoad: function(options) {
    this.setData({
      UserID: util.getStorage("userID"),
      OpenID: util.getStorage("openId"),
    })
    this.getMemberShipCardForUpgrade();
  },

  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //获取可升级会员
  getMemberShipCardForUpgrade() { 
    let _this = this;
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/getMemberShipCardForUpgrade?UserID=" + _this.data.UserID,
      method: 'get',
      header: {
        "Authorization": _this.data.OpenID,
      },
      success: function(res) {
        console.log(res)
        _this.setData({
          resData: res.data,
          upgradeArray: res.data.MemberShipCardTypes,
        })
      },

    })
  },
  
})
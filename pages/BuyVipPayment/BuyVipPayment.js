let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({

  data: {
    cardId: 1,
    Mobile: "",
    cardObj:""
  },
  onLoad: function(options) {
    if (!util.checkIsLogin()) {
      return;
    }
    this.getSettingInfo();
    this.getCardPrice();
  },
  getSettingInfo() {
    let _this = this;
    let OpenID = util.getStorage("openId");
    let UserID = util.getStorage("userID");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/UserSet?UserID=" + UserID + "&OpenID=" + OpenID,
      method: 'get',
      header: {
        "Authorization": OpenID,
      },
      success: function(res) {
        _this.setData({
          Mobile: res.data.Mobile,
        })
      },
      complete: function(res) {
        if (res.statusCode === 401) {
          util.throwMsg("非法请求");
          util.setStorage('userID', "", false);
          return;
        }
      }
    })
  },
  getCardPrice() {
    let _this = this;
    // let UserID = util.getStorage("userID");
    // let OpenID = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetMemberShipData",
      method: 'get',
      // header: {
      //   "Authorization": OpenID,
      // },
      success: function (res) {
        console.log(res)
        _this.setData({
          cardObj: res.data,
        })
      },
      
    })
  },
  buyFn() {
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    console.log(ports.modoHttp + "API/WeChatMiniProgram/PayMemberShip?userId=" + UserID + "&openId=" + OpenID + "&cardId=" + _this.data.cardId + "&price=" + this.data.cardObj.Price)
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/PayMemberShip?userId=" + UserID + "&openId=" + OpenID + "&cardId=" + _this.data.cardId + "&price=" + this.data.cardObj.Price,
      method: 'get',
      header: {
        "Authorization": OpenID,
      },
      success: function(res) {
        console.log(res)
        let PayMessage = res.data;
        wx.requestPayment({
          timeStamp: PayMessage.timeStamp,
          nonceStr: PayMessage.nonceStr,
          package: PayMessage.package,
          signType: PayMessage.signType,
          paySign: PayMessage.paySign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({ changed: true });
            },2000)
          },
          'fail': function(res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
    })
  }
})
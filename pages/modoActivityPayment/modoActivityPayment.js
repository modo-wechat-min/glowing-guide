let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    imgSrc: ports.imgUrl + 'modo_activity_2.jpg',
    options:"",
  },
  onLoad(options){
    this.setData({
      options: options, 
    })
    this.isRequering=false;
  },
  onShow() {
    this.userID = util.getStorage("userID");
    this.openId = util.getStorage("openId");
  },
  buyLuckPackageFn: function (e) {
    var type = e.currentTarget.dataset.type;
    let _this = this;
    if (_this.isRequering) {
      return;
    }
    _this.isRequering = true;
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/GetLuckyPayDate",
      method: 'post',
      header: {
        "Authorization": _this.openId,
      },
      data: {
        UserID: _this.userID,
        OpenID: _this.openId,
        Type: type,
      },
      success: function (res) {
        _this.isRequering = false;
        if (res.data.Code === "FAIL") {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 2000
          })
          return;
        }
        let PayMessage = res.data.PayDate;
        wx.requestPayment({
          timeStamp: PayMessage.timeStamp,
          nonceStr: PayMessage.nonceStr,
          package: PayMessage.package,
          signType: PayMessage.signType,
          paySign: PayMessage.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack();
            }, 2000)
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
            })
          },
        })
      },
    })
  }
})
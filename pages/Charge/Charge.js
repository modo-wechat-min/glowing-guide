let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    chargeObj: "",
    choseIndex: 0,
    hidden: false,
    cradNumber: 1,
  },
  onLoad: function(options) {
    this.getDate();
  },
  phone(e) {
    let phone = "4000-777-365";
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  changeNumber(e) {
    let number = e.currentTarget.dataset.number;
    let cradNumber = this.data.cradNumber;
    if (number == -1 && cradNumber == 1) {
      util.throwMsg("不能再少了，亲！");
      return;
    }
    this.setData({
      cradNumber: cradNumber + number,
    })
  },
  choseObj(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      choseIndex: index,
    })
  },
  getDate() {
    let _this = this;
    let openId = util.getStorage("openId");
    console.log(openId)
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/RechargeCardList",
      method: 'get',
      header: {
        "Authorization": openId,
      },
      success: function(res) {
        _this.setData({
          chargeObj: res.data,
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
  },
  buyCard() {
    let _this = this;
    let data = _this.data
    let openId = util.getStorage("openId");
    let UserID = util.getStorage("userID");
    let cardId = data.chargeObj[data.choseIndex].ID;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/BuyRechargeCard?CardID=" + cardId + "&Count=" + data.cradNumber + "&UserID=" + UserID + "&OpenID=" + openId,
      method: 'get',
      header:{
        "Authorization": openId,
      },
      success: function(res) {
        let PayMessage = res.data;
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
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
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
      },
    })
  }
})
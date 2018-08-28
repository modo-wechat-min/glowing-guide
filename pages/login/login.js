let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
let timer = null;
Page({
  data: {
    loginImageUrl: ports.imgUrl + 'login.png',
    phone: "",
    code: "",
    time: 0,
    user: null,
    url: "",
  },
  onLoad(options) {
    this.setData({
      user: wx.getStorageSync('user'),
      url: options.url,
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendFun() {
    if (!this.testAccount(this.data.phone)) {
      return false;
    } else {
      if (this.data.time == 0) {
        let _this = this;
        _this.setData({
          time: 120,
        })
        wx.request({
          url: ports.modoHttp + "api/WeChatMiniProgram/SendCode",
          method: 'post',
          data: {
            Phone: _this.data.phone
          },
          success: function(res) {
            if (res.data.Code == "SUCCESS") {
              timer = setInterval(function() {
                _this.setData({
                  "time": _this.data.time - 1,
                })
                if (_this.data.time == 0) {
                  clearInterval(timer)
                }
              }, 1000)
              wx.showToast({
                title: '发送成功',
                icon: "none",
              })
            } else {
              util.getOpenId();
              wx.showToast({
                title: res.data.ErrorMessage,
                icon: "none",
              })
            }
          },
        })
      } else {
        return false;
      }
    }
  },
  //登录
  loginFun() {
    let _this = this;
    if (!this.testAccount(this.data.phone)) {
      return false;
    }
    if (this.data.code.length != 6) {
      util.throwMsg("请输入正确验证码");
      return false;
    }
    let openId = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/Login",
      method: 'post',
      data: {
        Phone: _this.data.phone,
        Code: _this.data.code,
        OpenID: openId,
      },
      success: function(res) {
        if (res.data.Code == "SUCCESS") {
          util.setStorage("userID", res.data.TypeValueID);
          if (_this.data.url.indexOf("/OrderLists/OrderLists") || _this.data.url.indexOf("/personal/personal")) {
            wx.switchTab({
              url: ".." + _this.data.url,
              success: function(e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
            return false;
          }
          wx.navigateTo({
            url: ".." + _this.data.url,
          })
        } else {
          util.throwMsg(res.data.ErrorMessage);
        }
      },
    })
  },
  testAccount(phone) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
      util.throwMsg("请输入正确手机号！");
      return false;
    } else {
      return true;
    }
  }
})
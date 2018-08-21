let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
let timer = null;
Page({
  data: {
    loginImageUrl: ports.imgUrl + 'login.png',
    phone: "",
    code: "",
    time: 0,
    user:null,

  },
  onLoad(){
    this.setData({
      user: wx.getStorageSync('user'),
    })
    console.log(this.data.user)
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
          time: 5,
        })
        wx.request({
          url: ports.modoHttp + "api/WeChatMiniProgram/SendCode",
          method: 'post',
          data:{
            Phone: _this.data.phone
          },
          success: function(res) {
            console.log(res)
            if (res.data.Code == "SUCCESS") {
              timer = setInterval(function() {
                console.log(_this.data.time)
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
        wx.showToast({
          title: '请输入正确验证码',
          icon: "none",
        })
        return false;
      }
    let openId=util.getStorage("openId");
    console.log(openId, _this.data.phone, _this.data.code)
      wx.request({
        url: ports.modoHttp + "api/WeChatMiniProgram/Login", 
        method: 'post',
        data: {
          Phone: _this.data.phone, 
          Code: _this.data.code, 
          OpenID: openId,
          Url: "564564654",
        },
        success: function (res) { 
          if (res.data.Code == "SUCCESS") {
            util.setStorage("userID", res.data.TypeValueID)
          }else{
            util.throwMsg(res.data.ErrorMessage);
          }
        },
      })
  },
  testAccount(phone) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: "none",
      })
      return false;
    } else {
      return true;
    }
  }
})
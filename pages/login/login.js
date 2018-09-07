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
              _this.setData({
                time:0,
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
    let openId = util.getStorage("openId");
    if (openId){
      this.login();
    }else{
      util.getOpenId(this.login);
    }
  },
  testAccount(phone) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
      util.throwMsg("请输入正确手机号！");
      return false;
    } else {
      return true;
    }
  },
  login(){
    let _this = this;
    let openId = util.getStorage("openId");
    if (!this.testAccount(this.data.phone)) {
      return false;
    }
    if (this.data.code.length != 6) {
      util.throwMsg("请输入正确验证码");
      return false;
    }
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/Login",
      method: 'post',
      data: {
        Phone: _this.data.phone,
        Code: _this.data.code,
        OpenID: openId,
      },
      success: function (res) {
        if (res.data.Code == "SUCCESS") {
          util.setStorage("userID", res.data.TypeValueID);
          let url = _this.data.url ? _this.data.url : util.getStorage('historyUrl');
          let options = util.getStorage('options');
          if (url.indexOf("/OrderLists/OrderLists") > -1 || url.indexOf("/personal/personal") > -1) {
            wx.switchTab({
              url: ".." + url,
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
            return false;
          } else if (url.indexOf("/BranchDetails/BranchDetails") > -1 || url.indexOf("RoomTypeDetails") > -1) {
            url += '?BranchID= ' + options.BranchID + '&StartDate=' + options.StartDate + "&EndDate=" + options.EndDate + "&days=" + options.days + "&RoomTypeID=" + options.RoomTypeID;
          }
          wx.navigateTo({
            url: ".." + url,
          })
        } else {
          util.throwMsg(res.data.ErrorMessage); 
        }
      },
    })
  }
})
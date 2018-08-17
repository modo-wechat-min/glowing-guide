let ports = require('../../utils/ports.js');
const app = getApp()

Page({
  data: {
    userInfo: {},//获取用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bgImg:ports.imgUrl + "personal.png",
    bgImg2: ports.imgUrl + "personal2.jpg",
    result:"",
  },
 
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
     this.getInit();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getInit() {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/UserCenter?UserID=" + 0 +"&OpenID="+"djsl",
      method: 'get',
      success: function (res) {
        console.log(res.data);
        _this.setData({
          result: res.data, //获取当前轮播图片的下标
        })
      },
    })
  }
})
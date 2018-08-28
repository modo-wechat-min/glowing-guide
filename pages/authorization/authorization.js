let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    rightImageUrl: ports.imgUrl + 'right.png',
    url:"",
  },
  
  onLoad: function (options) {
    this.setData({
      url: options.url,
    })
    if (!this.data.canIUse) {
      //在非异步的情况下 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
        }
      })
    } 
  },
  getUserInfo: function (e) {
    let _this=this;
    app.globalData.userInfo = e.detail.userInfo;
    //成功返回上个页面
    if (e.detail.errMsg =="getUserInfo:ok"){
      if (_this.data.url.indexOf("/OrderLists/OrderLists")>0 || _this.data.url.indexOf("/personal/personal")>0) {
        wx.switchTab({
          url: ".." + _this.data.url,
          success: function (e) {
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
    }
  }
})

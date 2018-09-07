let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    rightImageUrl: ports.imgUrl + 'right.png',
    url: "",
  },
  onLoad: function(options) {
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
  getUserInfo: function(e) { 
    let _this = this;
    let url = ".." + _this.data.url; 
    util.setStorage('historyUrl', url);
    if (url.indexOf("BranchDetails") > -1 || url.indexOf("RoomTypeDetails") > -1) {  
      let options =util.getStorage('options');
      url = url + '?BranchID= ' + options.BranchID + '&StartDate=' + options.StartDate + "&EndDate=" + options.EndDate + "&days=" + options.days + "&RoomTypeID=" + options.RoomTypeID;
    }
    app.globalData.userInfo = e.detail.userInfo;
    // console.log(e.detail)
    //成功返回上个页面
    
    if (e.detail.errMsg == "getUserInfo:ok") {
      util.getOpenId();
      if (_this.data.url.indexOf("/home/home") > -1 || _this.data.url.indexOf("/OrderLists/OrderLists") > -1 || _this.data.url.indexOf("/personal/personal") > -1) {
        wx.switchTab({
          url: url,
          success: function(e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return; 
            page.onLoad();
          }
        })
        return false;
      }
      wx.navigateTo({
        url: url,
      })
    }
  }
})
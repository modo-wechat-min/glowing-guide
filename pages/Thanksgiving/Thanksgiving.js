let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityImg: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.activityFn();
  },
  activityFn: function () {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/HomeActiveInfo",
      method: 'get',
      success: function (res) {
        _this.setData({
          activityImg: ports.imgUrl + res.data.ListActiveInfor[0].ImageUrl[2] , //首页背景图
        })
      },
    })
  },
  
})
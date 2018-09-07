let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    dateActive: false,
    date: util.initMonth(),
    detailsObj: "",
  },
  onLoad: function(options) {
    this.getDetails();
  },
  getPicker() {
    this.setData({
      dateActive: true,
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      dateActive: false,
    })
    this.getDetails();
  },
  bindDateCancel: function(e) {
    this.setData({
      dateActive: false,
    })
  },
  getDetails() {
    let _this = this;
    let UserID = util.getStorage("userID");
    _this.setData({
      hidden: false,
    })
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/MyBalanceRecord?UserID=" + UserID + "&Date=" + _this.data.date,
      method: 'get',
      success: function(res) {
        _this.setData({
          detailsObj: res.data,
          hidden: true,
        })
      }
    })
  }
})
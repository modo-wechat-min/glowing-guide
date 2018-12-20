let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    priceLists: [],
    hidden: false,
  },
  onLoad: function(options) {
    //获取价格列表
    let _this = this;
    let UserID = util.getStorage("userID") ? util.getStorage("userID"):0;
    let OpenID = util.getStorage("openId"); 
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/RoomPriceList?startDate=" + options.startTime + "&endDate=" + options.endTime + "&RoomTypeID=" + options.RoomTypeID + "&OpenID=" + OpenID + "&UserID=" + UserID + "&PricePlan=" + options.planId,
      method: 'get',
      success: function(res) {
        _this.setData({
          priceLists: res.data,
          hidden: true,
        })
      },
    })
  },
})
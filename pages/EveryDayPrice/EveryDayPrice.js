let ports = require('../../utils/ports.js');
Page({
  data: {
    priceLists: [],
    hidden: false,
  },
  onLoad: function(options) {
    //获取价格列表
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/RoomPriceList?startDate=" + options.startTime + "&endDate=" + options.endTime + "&RoomTypeID=" + options.RoomTypeID,
      method: 'get',
      success: function(res) {
        console.log(res)
        _this.setData({
          priceLists: res.data,
          hidden: true,
        })
      },
    })
  },
})
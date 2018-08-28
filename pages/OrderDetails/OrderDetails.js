let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    orderObj:null,
    modoImgHttp: ports.modoImgHttp,
    hidden: false,
  },

  onLoad: function(options) {
    this.getOrderInfo(options.TypeValueID)
  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: '4000-777-365'
    })
  },
  delete() {
    util.deleteOrder(this.data.orderObj.BillID);
    wx.navigateBack({ changed: true });
  },
  getOrderInfo(TypeValueID){
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetBillDetail?BillID=" + TypeValueID,
      method: 'get',
      success: function (res) {
        console.log(res)
        _this.setData({
          orderObj: res.data,
          hidden: true,
        })
      },
    })
  }
})
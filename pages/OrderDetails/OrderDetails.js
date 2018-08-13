let ports = require('../../utils/ports.js');
Page({
  data: {
    imgurl: ports.imgUrl + 'img_1.png',
    type: 1, //1表示待支付，2表示已取消，3支付完成
  },

  onLoad: function(options) {

  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: '4000-777-365'
    })
  },
  delete() {
    wx.showModal({
      title: '提示',
      content: '确定删除订单吗',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }

      }
    })
  }
})
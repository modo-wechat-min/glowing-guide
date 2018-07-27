let ports = require('../../utils/ports.js');
Page({
  data: {
    wifiImageUrl: ports.imgUrl + 'wifi.jpg',
    array: ['1001', '1002', '1003', '1004'],
    index:0,
    isdown:true,
  },
  onLoad: function (options) {
  
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      isdown: true,
    })
  },
  isdown(){
    this.setData({
      isdown: !this.data.isdown,
    })
  },
  bindPickerCancel(){
    this.setData({
      isdown: true,
    })
  }
})
let util = require('../../utils/util.js');
Page({
  data: {
    array: ['男', '女'], 
    index:0,
    date: util.initTime(0),

  },

  onLoad: function (options) {
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  onUnload (){
    // 返回提交数据
  }
})
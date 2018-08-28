let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    dateActive: false,
    date: util.initMonth(),
  },
  onLoad: function(options) {

  },
  getPicker(){
    this.setData({
      dateActive: true,
    })
  },
  bindDateChange: function(e) {
    console.log(e)
    this.setData({
      date: e.detail.value,
      dateActive: false,
    })
  },
  bindDateCancel:function(e){
    this.setData({
      dateActive: false,
    })
  }
})
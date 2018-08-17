let util = require('../../utils/util.js');
Page({
  data: {
    startTime:"",
    endTime:"",
    days:0,
    minPrice:"",
    maxPrice:"",
  },
  onLoad: function (options) {
    this.setData({
      startTime:options.startTime,
      endTime:options.endTime,
      minPrice: options.minPrice,
      maxPrice: options.maxPrice,
    })
  },
  toGetDate: function () { // 获取日期
    var _this = this;
    wx.navigateTo({
      url: '../date/date?startTime=' + _this.data.startTime + '&endTime=' + _this.data.endTime,
    })
  },
  minPriceFun(e){
    console.log(55)
    this.setData({
      minPrice: e.detail.value,
    })
  },
  maxPriceFun(e){
    this.setData({
      maxPrice: e.detail.value,
    })
  },
  reset(){
    this.setData({
      startTime: "",
      endTime: "",
      days: 0,
      minPrice: "",
      maxPrice: "",
    })
  },
  pageBack(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一级页面
    var days = (new Date(util.getDayString(this.data.endTime)) - new Date(util.getDayString(this.data.startTime))) / 1000 / 60 / 60 / 24;
    prevPage.setData({
      'startTime': this.data.startTime,
      "endTime": this.data.endTime,
      "minPrice": this.data.minPrice,
      "maxPrice": this.data.maxPrice,
      "days": days,
    });
    wx.navigateBack({ changed: true });
  },
})
let util = require('../../utils/util.js');
Page({
  data: {
    startTime: "",
    endTime: "",
    days: 0,
    minPrice: "",
    maxPrice: "",
    tradingArea: ["三里屯", "中关村", "西直门", "望京", "国贸CBD", "五道口", "西单", "王府井", "崇文门"],
    tradingIndex: null,
    KeyWord: "",
    options:"",
  },
  onLoad: function(options) {
    let tradingIndex = null;
    if (options.KeyWord) {
      tradingIndex = this.data.tradingArea.indexOf(options.KeyWord);
    }
    this.setData({
      startTime: options.startTime,
      endTime: options.endTime,
      minPrice: options.minPrice,
      maxPrice: options.maxPrice,
      KeyWord: options.KeyWord,
      tradingIndex: tradingIndex,
      options: options,
    })
  },
  toGetDate: function() { // 获取日期
    var _this = this;
    wx.navigateTo({
      url: '../date/date?startTime=' + _this.data.startTime + '&endTime=' + _this.data.endTime,
    })
  },
  minPriceFun(e) {
    console.log(55)
    this.setData({
      minPrice: e.detail.value,
    })
  },
  maxPriceFun(e) {
    this.setData({
      maxPrice: e.detail.value,
    })
  },
  reset() {
    this.setData({
      startTime: this.data.options.startTime,
      endTime: this.data.options.endTime,
      days: 0,
      minPrice: 0,
      maxPrice: 0,
      tradingIndex: null,
    })
  },
  getTradingArea(e) {
    let tradingIndex = e.currentTarget.dataset.index;
    if (tradingIndex == this.data.tradingIndex) {
      tradingIndex = null;
    }
    this.setData({
      tradingIndex: tradingIndex,
    })
  },
  pageBack(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一级页面
    var KeyWord = this.data.tradingArea[this.data.tradingIndex] ? this.data.tradingArea[this.data.tradingIndex] : "";
    var days = (new Date(util.getDayString(this.data.endTime)) - new Date(util.getDayString(this.data.startTime))) / 1000 / 60 / 60 / 24;
    prevPage.setData({
      'startTime': this.data.startTime,
      "endTime": this.data.endTime,
      "minPrice": this.data.minPrice,
      "maxPrice": this.data.maxPrice,
      "days": days,
      'KeyWord': KeyWord,
    });
    prevPage.getBranchLists();
    wx.navigateBack({
      changed: true
    });
  },
})
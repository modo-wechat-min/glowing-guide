let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    startTime: "",
    endTime: "",
    days: 0,
    minPrice: "",
    maxPrice: "",
    tradeArray: [],
    KeyWord: "",
    options: "",
    hidden: false,
    index: 0,//城市默认
    array: ['不限', '北京', '南京'],
  },
  onLoad: function(options) {
    this.setData({
      startTime: options.startTime,
      endTime: options.endTime,
      days: options.days,
      minPrice: options.minPrice == 0 ? "" : options.minPrice,
      maxPrice: options.maxPrice == 0 ? "" : options.maxPrice,
      KeyWord: options.KeyWord,
      options: options,
      index: options.index == 0 ? 1 : options.index,
      tradeArray: options.tradeArray,
    })
    this.getTradings();
  },
  toGetDate: function() { // 获取日期
    var _this = this;
    wx.navigateTo({
      url: '../date/date?startTime=' + _this.data.startTime + '&endTime=' + _this.data.endTime,
    })
  },
  minPriceFun(e) {
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
    let array = this.data.tradeArray;
    array = array.map(function(item, key) {
      item.isChosen = false;
      return item;
    })
    this.setData({
      startTime: util.initTime(0),
      endTime: util.initTime(1),
      days: 1,
      minPrice: "",
      maxPrice: "",
      tradeArray: array,
    })
  },
  getTradingArea(e) {
    let index = e.currentTarget.dataset.index;
    let array = this.data.tradeArray;
    array[index].isChosen = !array[index].isChosen
    this.setData({
      tradeArray: array,
    })
  },
  pageBack(e) {
    var array = this.data.tradeArray;
    array = array.filter(function(item, key, array) {
      if (item.isChosen) {
        return item;
      }
    })
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一级页面
    var days = (new Date(util.getDayString(this.data.endTime)) - new Date(util.getDayString(this.data.startTime))) / 1000 / 60 / 60 / 24;
    prevPage.setData({
      'startTime': this.data.startTime,
      "endTime": this.data.endTime,
      "minPrice": this.data.minPrice == "" ? 0 : this.data.minPrice,
      "maxPrice": this.data.maxPrice == "" ? 0 : this.data.maxPrice,
      "days": days,
      "index": this.data.index,
      "tradeArray": array,
    });
    prevPage.getBranchLists();
    wx.navigateBack({
      changed: true
    });
  },
  getTradings() {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetBranchTrad?CityID=" + _this.data.index,
      method: 'get',
      success: function(res) {
        console.log(res);
        let array = res.data;
        let tradeArray = _this.data.tradeArray ? JSON.parse(_this.data.tradeArray) : "";
        array = array.map(function(item, key, arr) {
          item.isChosen = false;
          if (tradeArray.length > 0) {
            tradeArray.map(function(item2, key2) {
              if (item2.ID == item.ID) {
                item.isChosen = true;
              }
            })
          }
          return item;
        })
        _this.setData({
          tradeArray: array, //获取当前轮播图片的下标
          hidden: true,
        })

      },
    })
  }
})
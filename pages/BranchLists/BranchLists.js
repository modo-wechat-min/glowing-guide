let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
var demo = new QQMapWX({
  key: 'GN2BZ-EHZ62-Y62U5-CX56F-EV4EQ-XBFN4' // 必填
});
Page({
  data: {
    hidden: false,
    imgurl: ports.imgUrl + 'img_1.png',
    index: 0,
    array: ['不限', '北京', '南京'],
    startTime: "",
    endTime: "",
    minPrice: 0,
    maxPrice: 0,
    branchLists: [],
    imgPorts: ports.modoImgHttp,
    disArray: [],
    days: 1,
    KeyWord: "",
  },
  onLoad: function(options) {
    if (options.StartDate) {
      this.setData({
        startTime: options.StartDate,
        endTime: options.EndDate,
        days: options.days,
        index: options.CityIndex,
      })
    } else {
      this.defaultSet();
    }
    this.getBranchLists();
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    this.getBranchLists();
  },
  toOption() {
    wx.navigateTo({
      url: '../condition/condition?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + "&minPrice=" + this.data.minPrice + "&maxPrice=" + this.data.maxPrice + "&KeyWord=" + this.data.KeyWord,
    })
  },
  getBranchLists() {
    this.setData({
      hidden: false,
    })
    let _this = this;
    console.log(ports.modoHttp + "API/WeChatMiniProgram/GetBranchList?StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&CityID=" + this.data.index + "&KeyWord=" + this.data.KeyWord + "&MinPrice=" + this.data.minPrice + "&MaxPrice=" + this.data.maxPrice);
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetBranchList?StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&CityID=" + this.data.index + "&KeyWord=" + this.data.KeyWord + "&MinPrice=" + this.data.minPrice + "&MaxPrice=" + this.data.maxPrice,
      method: 'get',
      success: function(res) {
        console.log(res)
        _this.setData({
          branchLists: res.data, //获取当前轮播图片的下标
          hidden:true,
        })
        _this.getDistance();
      },
    })
  },
  getDistance() {
    let _this = this;
    let lists = this.data.branchLists;
    if (lists.length==0){
      return false;
    }
    var newLists = lists.map(function(item, key, ary) {
      var obj = {};
      obj.latitude = item.Dimension;
      obj.longitude = item.Longitude;
      return obj;
    });
    demo.calculateDistance({
      to: newLists,
      success: function(res) {
        _this.setData({
          disArray: res.result.elements,
        })
      },
      fail: function(res) {
        console.log(res);
      },
    });
  },
  goBranchDetails(e) {
    var branchId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../BranchDetails/BranchDetails?BranchID=' + branchId + '&StartDate=' + this.data.startTime + "&EndDate=" + this.data.endTime + "&days=" + this.data.days,
    })
  },
  defaultSet() {
    this.setData({
      startTime: util.initTime(0),
      endTime: util.initTime(1),
      days: 1,
      index: 0,
      minPrice: 0,
      maxPrice: 0,
      KeyWord: "",
    })
  },
  defaultFun() {
    this.defaultSet();
    this.getBranchLists();
  }
})
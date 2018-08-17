let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    homeImageUrl: ports.imgUrl + 'home_1.jpg',
    homeImageUrl2: ports.imgUrl + 'home_2.jpg',
    startTime: "",
    endTime: "",
    days: 1,
    index: 0,
    array: ['北京', '南京'],
  },
  onLoad: function() {
    this.setData({
      startTime: util.initTime(0),
      endTime: util.initTime(1)
    })
  },
  toGetDate: function() { // 获取日期
    var _this = this;
    wx.navigateTo({
      url: '../date/date?startTime=' + _this.data.startTime + '&endTime=' + _this.data.endTime,
    })
  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: '4000-777-365'
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  goBranchLists() {
    wx.navigateTo({
      url: '../BranchLists/BranchLists?CityIndex=' + this.data.index + '&StartDate=' + this.data.startTime + '&EndDate=' + this.data.endTime + '&days=' + this.data.days,
    })
  },
})
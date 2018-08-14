let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    branchName: "",
    branchId: "",
    branchLists: [],
    homeImageUrl: ports.imgUrl + 'home_1.jpg',
    homeImageUrl2: ports.imgUrl + 'home_2.jpg',
    startTime: "",
    endTime: "",
    days: 1,

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
  serch() {
    wx.navigateTo({
      url: '../BranchDetails/BranchDetails?BranchID=' + this.data.branchId + '&StartDate=' + this.data.startTime + '&EndDate=' + this.data.endTime + '&days=' + this.data.days,
    })
  }

})
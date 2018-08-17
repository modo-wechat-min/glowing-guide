let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
var demo = new QQMapWX({
  key: 'GN2BZ-EHZ62-Y62U5-CX56F-EV4EQ-XBFN4' // 必填
});
Page({
  data: {
    imgurl: ports.imgUrl + 'img_1.png',
    index: 0,
    array: ['北京', '南京'],
    startTime: "",
    endTime: "",
    minPrice: "",
    maxPrice: "",
    branchLists: [],
    imgPorts: ports.modoImgHttp,
    disArray: [],
    days:1,
  },
  onLoad: function (options) {
    this.setData({
      startTime: options.StartDate,
      endTime: options.EndDate,
      days: options.days,
      index: options.CityIndex,
    })
    this.getBranchLists();

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  toOption() {
    wx.navigateTo({
      url: '../condition/condition?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + "&minPrice=" + this.data.minPrice + "&maxPrice=" + this.data.maxPrice,
    })
  },
  getBranchLists() {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "/API/WeChatMiniProgram/GetBranchList?StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime,
      method: 'get',
      success: function (res) {
        // console.log(res.data);
        _this.setData({
          branchLists: res.data, //获取当前轮播图片的下标
        })
        _this.getDistance();
      },
    })
  },
  getDistance() {
    let _this = this;
    let lists = this.data.branchLists;
    var newLists = lists.map(function (item, key, ary) {
      var obj = {};
      obj.latitude = item.Dimension;
      obj.longitude = item.Longitude;
      return obj;
    });
    demo.calculateDistance({
      to: newLists,
      success: function (res) {
        _this.setData({
          disArray: res.result.elements,
        })
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },
  goBranchDetails(e){
    var branchId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../BranchDetails/BranchDetails?BranchID=' + branchId + '&StartDate=' + this.data.startTime + "&EndDate=" + this.data.endTime +"&days="+this.data.days,
    })
  }
})
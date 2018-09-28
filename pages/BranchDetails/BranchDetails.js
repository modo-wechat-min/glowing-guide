let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
var timer;
Page({
  data: {
    isFresh: "",
    hidden: false,
    branchId: 0,
    startTime: "",
    endTime: "",
    branchObj: {},
    typeObj: null, 
    RoomTypeID: "",
    modoImgHttp: ports.modoImgHttp, 
    modoHttp2: ports.modoHttp2,
    days: 1,
    itemIndex: 0,
    imgIndex: 1,
    marker: [],
    latitude: "",
    longitude: "",
    options: "",
    defaultImg: ports.imgUrl +"default.jpg",
    isVip: false,
  },
  onLoad: function(options) {
    this.setData({
      branchId: options.BranchID,
      startTime: options.StartDate,
      endTime: options.EndDate,
      days: options.days,
      options: options,
    })
    this.getBranchInfo();
    this.checkUserIsMember();
  },
  getBranchInfo() {
    let _this = this;
    _this.setData({
      hidden: false,
    })
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/BranchDetail?BranchID=" + parseInt(_this.data.branchId) + "&StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime,
      method: 'get',
      success: function(res) {
        console.log(res);
        let latitude = res.data.Dimension;
        let longitude = res.data.Longitude;
        var array=[];
        var array = _this.swithFun(longitude, latitude);
        longitude = array[0];
        latitude = array[1]; 
        let marker = [];
        marker[0] = {
          iconPath: "../../image/location.png",
          id: 0,
          latitude: latitude, 
          longitude: longitude,
          width: 50,
          height: 50
        }
        _this.setData({
          branchObj: res.data,
          marker: marker,
          latitude: latitude,
          longitude: longitude,
          hidden: true,
        })
      },
    })
  },
  phone(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  toGetDate: function() { // 获取日期
    wx.navigateTo({
      url: '../date/date?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + '&days=' + this.data.days + "&isFresh=" + true,
    })
  },
  toBook(e) {
    this.setData({
      RoomTypeID: e.currentTarget.dataset.type,
    })
    util.setStorage('options', this.data.options);
    util.checkRight(this.bookFun);

  },
  bookFun() {
    if (!util.checkIsLogin()) {
      return;
    }
    wx.navigateTo({
      url: '../OrderEdit/OrderEdit?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + '&days=' + this.data.days + "&BranchID=" + this.data.branchId + "&RoomTypeID=" + this.data.RoomTypeID,
    })
  },
  goTypePage(e){
    let RoomTypeID = e.currentTarget.dataset.roomtypeid;
    let booknumber = e.currentTarget.dataset.booknumber;
    wx.navigateTo({
      url: '../RoomTypeDetails/RoomTypeDetails?StartDate=' + this.data.startTime + '&EndDate=' + this.data.endTime + '&days=' + this.data.days + "&BranchID=" + this.data.branchId + "&RoomTypeID=" + RoomTypeID + "&booknumber=" + booknumber,
    })
  },
  getItemDetails(e) {
    this.setData({
      itemIndex: e.currentTarget.dataset.index
    })
  },
  swiperPageSwith(e) {
    this.setData({
      imgIndex: e.detail.current + 1,
    })
  },
  
  onShow() {
    if (this.data.isFresh) {
      this.getBranchInfo();
    }
  },
  noteFun() {
    util.throwMsg("该房型已售完");
  },
  
  openLocation: function (e) {
    let data = this.data
    wx.openLocation({
      latitude: parseFloat(data.latitude) , 
      longitude: parseFloat(data.longitude),
      scale: 16,
      name: data.branchObj.Name,
      address: data.branchObj.Address, 
    })
  },
  swithFun(bd_lon, bd_lat){
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      var x = bd_lon - 0.0065;
      var y = bd_lat - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      var gg_lng = z * Math.cos(theta);
      var gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat];
  },
  checkUserIsMember() {
    let _this = this;
    let UserID = util.getStorage("userID");
    if (!UserID){
      return ;
    }
    let OpenID = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/CheckUserIsMember?UserID=" + UserID,
      method: 'get',
      header: {
        "Authorization": OpenID,
      },
      success: function (res) {
        _this.setData({
          isVip: res.data,
        });
        
      },
      complete: function (res) {
        if (res.statusCode === 401) {
          util.throwMsg("非法请求");
          util.setStorage('userID', "", false);
          return;
        }
      }
    })
  },
})
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isFresh:"",
    hidden: false,
    animation: "",
    branchId: 0,
    startTime: "",
    endTime: "",
    branchObj: {},
    typeObj: null,
    RoomTypeID: "",
    modoImgHttp: ports.modoImgHttp,
    modoHttp2: ports.modoHttp2,
    days: 1,
    scale: 0,
    itemIndex: 0,
    imgIndex: 1,
    marker: [],
    latitude: "",
    longitude: "",
    options: "",
  },
  onReady() {
    this.initAnimation();
  },
  onLoad: function(options) { 
    console.log(options)
    var scale;
    //获取rpx与px的比
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        scale = 750 / res.windowWidth //将高度乘以换算后的该设备的rpx与px的比例
      }
    })
    this.setData({
      branchId: options.BranchID,
      startTime: options.StartDate,
      endTime: options.EndDate,
      days: options.days,
      scale: scale,
      options: options,
    })
    this.getBranchInfo();


  },
  getBranchInfo() {
    let _this = this;
    _this.setData({
      hidden: false,
    })
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/BranchDetail?BranchID=" + _this.data.branchId + "&StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime,
      method: 'get',
      success: function(res) {
        console.log(res)
        let latitude = res.data.Dimension;
        let longitude = res.data.Longitude;
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
    util.checkRight(this.bookFun, JSON.stringify(this.data.options));
    
  },
  bookFun(){
    if (!util.checkIsLogin()) {
      return;
    }
    wx.navigateTo({
      url: '../OrderEdit/OrderEdit?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + '&days=' + this.data.days + "&BranchID=" + this.data.branchId + "&RoomTypeID=" + this.data.RoomTypeID,
    })
  },
  initAnimation() {
    this.animation = wx.createAnimation({
      duration: 600,
      transformOrigin: 'left bottom 0',
    })
  },
  closeFun() {
    this.animation.translateY(845 / this.data.scale).step();
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
  },
  openFun(e) {
    console.log(e)
    this.getRoomTypeInfo(e.currentTarget.dataset.roomtypeid);
    this.animation.translateY(-845 / this.data.scale).step();
    this.setData({
      //输出动画
      animation: this.animation.export()
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
  //获取房型信息
  getRoomTypeInfo(type) {
    let RoomTypeID = type;
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/RoomTypeDetail?RoomTypeID=" + RoomTypeID,
      method: 'get',
      success: function(res) {
        console.log(res)
        _this.setData({
          typeObj: res.data,
          RoomTypeID: RoomTypeID,
        })
      },
    })
  },
  toDailyPrice(e) {
    wx.navigateTo({
      url: '../EveryDayPrice/EveryDayPrice?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + "&RoomTypeID=" + this.data.RoomTypeID,
    })
  },
  onShow() {
    if (this.data.isFresh) {
      console.log(66)
      this.getBranchInfo();
    }
  },
  noteFun(){
    util.throwMsg("该房型已售完");
  }
})
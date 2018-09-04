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
    scale: 0,
    itemIndex: 0,
    imgIndex: 1,
    marker: [],
    latitude: "",
    longitude: "",
    options: "",
    defaultImg: ports.defaultImg,
    animation2: "", //自定义轮播组件
    lastX: 0, //滑动开始x轴位置
    lastY: 0, //滑动开始y轴位置
    subImgIndex: 0,
    subImgLength: 0,
    showBox:false,
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
  bookFun() {
    if (!util.checkIsLogin(JSON.stringify(this.data.options))) {
      return;
    }
    wx.navigateTo({
      url: '../OrderEdit/OrderEdit?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + '&days=' + this.data.days + "&BranchID=" + this.data.branchId + "&RoomTypeID=" + this.data.RoomTypeID,
    })
  },
  initAnimation() {
    this.animation2 = wx.createAnimation({
      duration: 600,
      transformOrigin: '0 0 0',
    })
  },
  closeFun() {
    this.setData({
      showBox: false,
    })
  },
  openFun(e) {
     this.getRoomTypeInfo(e.currentTarget.dataset.roomtypeid);
    this.setData({
      showBox:true,
    })

  },
  animationFun(a) {
    let index = this.data.subImgIndex;
    let maxLength = this.data.subImgLength;
    let newIndex = index + a;
    if (newIndex == maxLength && a == 1) {
      newIndex = 0;
    } else if (newIndex == -1 && a == -1) {
      newIndex = maxLength-1
    }
    console.log(a,newIndex)
    this.animation2.translateX(-750 * (newIndex) / this.data.scale).step();
    this.setData({
      //输出动画
      animation2: this.animation2.export(),
      subImgIndex: newIndex,
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
        let length = res.data.Images.length;
        console.log(res)
        _this.setData({
          typeObj: res.data,
          RoomTypeID: RoomTypeID,
          subImgLength: length,
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
      this.getBranchInfo();
    }
  },
  noteFun() {
    util.throwMsg("该房型已售完");
  },
  handletouchmove: function(event) {
    var time = 300;

    let _this = this;
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var tx = currentX - this.data.lastX
    var ty = currentY - this.data.lastY
    var text = ""
    //左右方向滑动
    clearTimeout(timer);
    if (Math.abs(tx) > Math.abs(ty)) {

      if (tx < 0) {
        timer = setTimeout(function() {
          _this.animationFun(1);
          console.log("left")
        }, time)
      }
      // text = "向左滑动" 
      else if (tx > 0) {
        timer = setTimeout(function() {
          _this.animationFun(-1);
          console.log("right")
        }, time)
      }


    }
    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY

  },
  //滑动开始事件
  handletouchtart: function(event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY

  },

})
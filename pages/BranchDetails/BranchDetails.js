let ports = require('../../utils/ports.js');
Page({
  data: {
    imgUrls: [
      ports.imgUrl + 'img_1.png',
      ports.imgUrl + 'img_2.png',
      ports.imgUrl + 'img_3.png'
    ],//輪播圖配置
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    animation:"",
    branchId: "",
    startTime: "",
    endTime: "",
    branchObj:{},
    modoImgHttp: ports.modoImgHttp,
    days:1,
    scale:0,
  },
  onReady(){
    this.initAnimation();
  },
  onLoad: function (options) {
    console.log(options.days);
    var scale;
    //获取rpx与px的比
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        scale=750 / res.windowWidth//将高度乘以换算后的该设备的rpx与px的比例
      }
    }) 
    this.setData({
      branchId: options.BranchID,
      startTime: options.StartDate,
      endTime: options.EndDate,
      days: options.days,
      scale: scale,
    })
    this.getBranchInfo();

    
  },
  getBranchInfo(){
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/BranchDetail",
      method: 'get',
      data: {
        BranchID: _this.data.branchId,
        StartDate: _this.data.startTime,
        EndDate: _this.data.endTime,
      },
      success: function (res) {
        // console.log(56)
        // console.log(res)
        _this.setData({
          branchObj: res.data,
        })
      },
    })
  },
  toGetDate: function () {        // 获取日期
    wx.navigateTo({
      url: '../date/date?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + '&days=' + this.data.days,
    })
  },
  initAnimation(){
    this.animation = wx.createAnimation({
      duration: 600, 
      transformOrigin: 'left bottom 0',
    })
  },
  closeFun(){
    this.animation.translateY(1020 / this.data.scale).step();
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
  },
  openFun() {
    this.animation.translateY(-1020 / this.data.scale).step();
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
  }
})
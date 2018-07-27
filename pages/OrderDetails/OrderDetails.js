// pages/OrderDetails/OrderDetails.js
Page({

  data: {
    toast:false,
    animation:"",
  },

  onLoad: function (options) {
  
  },
  onReady() {
    this.initAnimation();
  },
  initAnimation() {
    this.animation = wx.createAnimation({
      duration: 6000,
      bottom: '-500',
      timingFunction: 'linear',
    })
  },
  closeFun() {
    this.animation.bottom(-500).step({ ducation: 8000 });
    this.setData({
      //输出动画
      animation: this.animation.export(),
      toast: false,
    })
  },
  openFun() {
    this.animation.bottom(0).step({ ducation: 8000 });
    this.setData({
      //输出动画
      animation: this.animation.export(),
      toast:true,
    })
  },
  prevent(){
    
  }
})
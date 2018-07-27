
Page({
  data: {
    nochose:false,
    height:0,
  },
  onLoad(){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },
  nochoseFun(e){
    this.setData({
      nochose: !this.data.nochose,
    })
  }
})
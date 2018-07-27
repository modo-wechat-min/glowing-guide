
Page({

  data: {
      flag:1,//flag的1.2.3.4分别对应四个切换窗口
      height:0,
      orderLists:[],
      boolean:false,
  },
  tapSwitch(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      flag: index, //获取当前轮播图片的下标
    })
  },
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },
  deleteOrder(){
    wx.showModal({
      title: '提示',
      content: '确定删除订单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }

})
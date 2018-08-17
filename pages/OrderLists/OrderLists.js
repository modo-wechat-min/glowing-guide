let ports = require('../../utils/ports.js');
Page({
  data: {
      flag:0,//flag的0.1.2分别对应四个切换窗口
    PageIndex:1,//分页
      height:0,
      orderLists:[],
      boolean:true,
    height:200,
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
    });
    this.getInit();
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

  },
  getInit() {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetMyBill?UserID=" + 0 + "&Type=" + _this.data.flag + "&PageIndex=" + _this.data.PageIndex,
      method: 'get',
      success: function (res) {
        console.log(res.data);
        _this.setData({
          orderLists: res.data, //获取当前轮播图片的下标
        })
      },
    })
  },
  lower: function (e) {
    console.log(e)
  },
})
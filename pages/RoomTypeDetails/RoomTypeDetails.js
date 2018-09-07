let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    options:"",
    typeObj:"",
    modoImgHttp: ports.modoImgHttp, 
    defaultImg: ports.imgUrl + "default.jpg",
  },
  onLoad: function (options) {
    this.setData({
      options: options,
    })
    this.getRoomTypeInfo(); 
  },
  //获取房型信息
  getRoomTypeInfo(type) {
    let options = this.data.options;
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/RoomTypeDetail?RoomTypeID=" + options.RoomTypeID,
      method: 'get',
      success: function (res) {
        _this.setData({
          typeObj: res.data,
        })
      },
    })
  },
  toDailyPrice(e) {
    let options = this.data.options;
    wx.navigateTo({
      url: '../EveryDayPrice/EveryDayPrice?startTime=' + options.StartDate + '&endTime=' + options.EndDate + "&RoomTypeID=" + options.RoomTypeID,
    })
  },
  toBook(e) {
    let options = this.data.options;
    if (options.booknumber <= 0) {
      util.throwMsg("该房型已售完！");
      return;
    }
    util.setStorage('options', options); 
    util.checkRight(this.bookFun);
  },
  bookFun() {
    let options = this.data.options;
    if (!util.checkIsLogin()) {
      return;
    }
    wx.navigateTo({
      url: '../OrderEdit/OrderEdit?startTime=' + options.StartDate + '&endTime=' + options.EndDate + '&days=' + options.days + "&BranchID=" + options.BranchID + "&RoomTypeID=" + options.RoomTypeID,
    })
  },
})
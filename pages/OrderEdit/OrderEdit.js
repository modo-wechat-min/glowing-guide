let ports = require('../../utils/ports.js');
Page({
  data: {
    imgUrls: ports.imgUrl + 'img_1.png',
    startTime: "",
    endTime: "",
    days: "",
    orderObj:null,
    number:1,
  },
  getNum(e) {
    this.setData({

    })
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      branchId: options.BranchID,
      typeId: options.typeId,
      startTime: options.startTime,
      endTime: options.endTime,
      days: options.days,
    });
    this.getOrder();
  },
  getOrder() {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/Booking?BranchID=" + _this.data.branchId + "&StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&RoomTypeID=" + _this.data.branchId + "&UserID=" + _this.data.branchId,
      method: 'get',
      success: function(res) {
        console.log(res)
        _this.setData({
          orderObj: res.data,
        })
      },
    })
  },
  getNumber(e){
    let dataset = e.currentTarget.dataset;
    if (dataset.number){
      this.setData({
        number: this.data.number++,
      })
    }else{
      if (this.data.number<=0){
        return false;
      }
      this.setData({
        number: this.data.number--,
      })
    }
  }
})
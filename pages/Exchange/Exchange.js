let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    listsObj:"",
    hidden:false,
    chosenID:0,
    exchangeNumber:1,
  },

  onLoad: function (options) {
    this.getDate();
  },
  getDate(){
    let _this = this;
    let UserID = util.getStorage("userID");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetVoucher?UserID=" + UserID,
      method: 'get',
      success: function (res) {
        console.log(res)
        _this.setData({
          listsObj: res.data,
          hidden: true,
          nodata: true,
        })
      },
    })
  },
  chosenFun(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      chosenID: index,
    })
  },
  numberFun(e){
    let id = e.currentTarget.dataset.id;
    if (id == -1 && this.data.exchangeNumber==1){
      util.throwMsg("不能再少了，亲！");
      return;
    }
    this.setData({
      exchangeNumber: this.data.exchangeNumber + id,
    })
  },
  exchangeFun(){
    let _this = this;
    let UserID = util.getStorage("userID");
    let data=_this.data;
    if (data.listsObj.voucherNames[data.chosenID].InitValue * 100 * data.exchangeNumber > data.listsObj.Score){
      util.throwMsg("积分不足，亲！");
      return;
    }
    console.log(ports.modoHttp + "API/WeChatMiniProgram/InsertVoucher?UserID=" + UserID + "&VourchId=" + data.listsObj.voucherNames[data.chosenID].ID + "&VourchCount=" + data.exchangeNumber)
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/InsertVoucher?UserID=" + UserID + "&VourchId=" + data.listsObj.voucherNames[data.chosenID].ID +"&VourchCount=" + data.exchangeNumber,
      method: 'get',
      success: function (res) {
        if (res.data.state == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 3000
          })
          setTimeout(function () {
            wx.navigateBack({ changed: true });
          }, 3000)
        } else {
          util.throwMsg(res.data.ErrorMessage);
        }
      },
    })
  }
})
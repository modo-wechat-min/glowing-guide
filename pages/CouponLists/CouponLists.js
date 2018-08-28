let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isComePersonal: false,
    listsObj:null,
    chosenIndex:-1,
    hidden: false,
    nodata:false,
  },
  onLoad(options) {
    this.setData({
      isComePersonal: options.isComePersonal,
    })
    this.getLists();
  },
  getLists() {
    let _this = this;
    let UserID = util.getStorage("userID");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetUserValidVoucher?UserID=" + UserID,
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
  chosenFun(e){
    let index = e.currentTarget.dataset.index;
    if (!this.data.isComePersonal){
      if (index){
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; // 上一级页面
        prevPage.setData({
          couponObj: this.data.listsObj[index],
        });
      }
      console.log(this.data.listsObj[index])
      wx.navigateBack({ changed: true });
    }else{

    }
  },
  goback(){
    wx.navigateBack({ changed: true });
  }
})
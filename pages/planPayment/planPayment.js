let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
  contractObj:"",
    hidden: false,
    height:"",
  },
  onLoad: function (options) {
   let _this=this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          height: res.windowHeight,
        })
      }
    })
    this.init(options.ContractID)
  },
  init(contractId){
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetOrderContractByid?contractid=" + contractId,
      method: 'get',
      success: function (res) {
        console.log(res)
        _this.setData({
          contractObj: res.data,
          hidden: true,
        })
      }
    })
  }
})
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
  contractObj:"",
    hidden: false,
    height:"",
    ContractID:0,
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
    _this.setData({
      ContractID: options.ContractID,
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
        let contractObj=res.data;
        let array = res.data.BudgetList;
        contractObj.BudgetList = array;
        _this.setData({
          contractObj: contractObj,
          hidden: true,
        })
      }
    })
  },
  paymentFun(e){
    let _this = this;
    let dataset=e.currentTarget.dataset;
    console.log(dataset)
    let data = _this.data.contractObj;
    let OpenID = util.getStorage("openId"); 
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/PayContractBudget?openid=" + OpenID + "&branchid=" + data.BranchId + "&billid=" + data.BillId + "&budgetId=" + dataset.id+ "&money=" + dataset.money,
      method: 'get',
      success: function (res) {
        console.log(res)
        let PayMessage = res.data;
        wx.requestPayment({
          timeStamp: PayMessage.timeStamp,
          nonceStr: PayMessage.nonceStr,
          package: PayMessage.package,
          signType: PayMessage.signType,
          paySign: PayMessage.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            _this.init(_this.data.ContractID);
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }


})
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
  contractObj:"",
    hidden: false,
    height:"",
    ContractID:0,
    payArray:[],//需要支付的账单
    payMoney:0,
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
  paymentAddFun(e){
    let dataset = e.currentTarget.dataset;
    let payArray = this.data.payArray;
    let payMoney = this.data.payMoney;
    let contractObj = this.data.contractObj;
    if (dataset.ispay==1){
      return;
    }
    contractObj.BudgetList[dataset.index].isChecked = !contractObj.BudgetList[dataset.index].isChecked;
    if (payArray.indexOf(dataset.id)>-1) {
      payArray = payArray.filter(function(item){
        if (item == dataset.id){
          payMoney = payMoney - dataset.money;
          return false;
        }else{
          return true;
        }
      })
    }else{
      payArray.push(dataset.id);
      payMoney = payMoney + dataset.money;
    }
    this.setData({
      payMoney : payMoney,
      contractObj: contractObj,
      payArray: payArray,
    })

  },
  lookDetails(e){
    let dataset = e.currentTarget.dataset;
    let contractObj = this.data.contractObj;
    contractObj.BudgetList[dataset.index].isWrap = !contractObj.BudgetList[dataset.index].isWrap;
    this.setData({
      contractObj: contractObj, 
    })
  },


  paymentFun(e){
    let _this = this;
    let data = _this.data.contractObj;
    let OpenID = util.getStorage("openId"); 
    let payMoney = this.data.payMoney;
    if (payMoney<=0){
      return;
    }
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/PayContractBudget?openid=" + OpenID + "&branchid=" + data.BranchId + "&billid=" + data.BillId + "&budgetId=" + this.data.payArray.toString() + "&money=" + payMoney,
      method: 'get',
      success: function (res) {
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
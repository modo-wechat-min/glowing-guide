let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
var timer = null;
Page({
  data: {
    orderObj: null,
    modoImgHttp: ports.modoImgHttp,
    hidden: false,
    persons: 1, //展示入住如数
    iconActive: false,
    timerTime:"",
    defaultImg: ports.imgUrl + "default.jpg",
  },

  onLoad: function(options) {
    this.getOrderInfo(options.TypeValueID)
  },
  phone() {
    let orderObj = this.data.orderObj;
    let phone = orderObj.BranchTelephone ? orderObj.BranchTelephone : orderObj.BranchMobile;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  personsFun() {
    let length = this.data.orderObj.MyContact.length;
    if (length <= 1) {
      return false;
    } else {
      let persons = this.data.persons;
      if (persons == 1) {
        persons = length;
      } else {
        persons = 1;
      }
      this.setData({
        persons: persons,
        iconActive: !this.data.iconActive, 
      })
    }
  },
  orderCancel() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: ports.modoHttp + "API/WeChatMiniProgram/CloseBill?billId=" + _this.data.orderObj.BillID,
            method: 'get',
            success: function (res) {
              if (res.data.state == 1) {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 2000
                })
                _this.getOrderInfo();
              } else {
                util.throwMsg(res.data.ErrorMessage);
              }
            },
          })
        } else {
          return;
        }
      }
    })
  },
  getOrderInfo(TypeValueID) {
    let _this = this;
    let openId = util.getStorage("openId");
    let UserID = util.getStorage("userID");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetBillDetail?BillID=" + TypeValueID + "&OpenID=" + openId + "&UserID=" + UserID,
      method: 'get',
      success: function(res) {
        console.log(res)
        console.log(res.data.WeChatPay)
        _this.setData({
          orderObj: res.data,
          hidden: true, 
        })
        //待支付倒计时
        if (res.data.Status == 1) {
          _this.getTimer(res.data.PayEndDate); 
        }
      },
    })
  },
  //支付接口
  payment() {
    if (!this.data.timerTime){
      return false;
    }
    let obj = this.data.orderObj.WeChatPay;
    console.log(obj);
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign, 
      "success":function(){
        wx.switchTab({
          url: '../OrderLists/OrderLists',
        })
      },
      "fail":function(res){
        console.log("支付失败")
console.log(res)
      }
    })
  },
  getTimer(time) {
    clearInterval(timer);
    let _this=this;
    var times = (new Date(time)-new Date())/1000;
    if (times<=0){
      return false;
    }
    timer = setInterval(function() { 
      var day = 0,
        hour = 0, 
        minute = 0,
        second = 0; //时间默认值
      if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      let realTime = "倒计时："+minute + ":" + second ;
      _this.setData({
        timerTime: realTime,
      })
      times--;
    }, 1000);
    if (times <= 0) {
      clearInterval(timer);
      _this.setData({ 
        timerTime: "",
      })
    }
  },
  onUnload(){
    clearInterval(timer);
    wx.switchTab({
      url: '../OrderLists/OrderLists',
    })
  }
})
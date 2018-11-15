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
    ruleIndex:-1,
    defaultImg: ports.imgUrl + "default.jpg",
    unsubscribe: [{
      "step": 0,
      "title": "预定成功",
      "rule": "可自行取消",
    }, {
      "step": 1,
      "title": "入住日16点之前",
      "rule": "收取首晚房费的",
      "subRule": "50%作为违约金"
    }, {
      "step": 2,
      "title": "入住日16点-20点之前",
      "rule": "收取首晚房费的",
      "subRule": "100% 作为违约金"
    }, {
      "step": 3,
      "title": "入住日20点以后",
      "rule": "",
    }],
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
                setTimeout(function(){
                  wx.switchTab({
                    url: '../OrderLists/OrderLists',
                  })
                },2000)
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
        _this.checkRule(res.data);
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
  //判断当前订单走到哪一步，显示退订规则
  checkRule(obj){
      console.log(obj);
    if (obj.Status == 3 || obj.Status == 4){
      this.setData({
        ruleIndex: 3,
      })
    } else if (obj.Status == 2){
      let ruleIndex=0;
      let  orderTime = new Date(obj.StartDate);
      let orderYear = orderTime.getFullYear();
      let orderMonth = orderTime.getMonth();
      let orderDate = orderTime.getDate();
      let nowTime=new Date();
      let nowYear = nowTime.getFullYear();
      let nowMonth = nowTime.getMonth();
      let nowDate = nowTime.getDate();
      let nowHours = nowTime.getHours();
      let nowmin = nowTime.getMinutes();
      let second = nowTime.getSeconds();
      let str16 = nowYear + "/" + nowMonth + "/" + nowDate+" "+"16:00:00";
      let str20 = nowYear + "/" + nowMonth + "/" + nowDate + " " + "20:00:00";
      let time16 = new Date(str16).getTime();
      let time20 = new Date(str20).getTime();
      if (orderYear == nowYear && orderMonth == nowMonth && orderDate == nowDate){
        let _nowStr = nowYear + "/" + nowMonth + "/" + nowDate + " " + nowHours + ":" + nowmin + ":"+second;
        console.log(_nowStr)
        let nowStr = new Date(_nowStr).getTime();
        console.log(time16 - nowStr);
        if (nowStr <= time16){
          ruleIndex = 1;
        } else if (time20 > nowStr && nowStr > time16 ){
          ruleIndex = 2;
        } else if (time20 < nowStr ){
          ruleIndex = 3;  
        }
      }
      this.setData({
        ruleIndex: ruleIndex,
      })
    }else {
      return;
    }
  },
  onUnload(){
    clearInterval(timer);
    wx.switchTab({
      url: '../OrderLists/OrderLists',
    })
  }
})
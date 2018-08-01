// pages/OrderPayment/OrderPayment.js
let leftTime = 1000 * 60 * 15;
Page({
  data: {
    time:"",
    timeout:true,
  },
  onLoad: function(options) {
    var _this=this;
    setInterval(function () { _this.leftTimer() }, 1000);
  },
  leftTimer() {
    // let leftTime = (new Date(enddate)) - new Date(); //计算剩余的毫秒数
    let days = parseInt(leftTime / 1000 / 60 / 60 / 24,10); //计算剩余的天数
    let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时
    let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
    let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);
    if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) {
      this.setData({
        time: minutes + ":" + seconds ,
      })
    }
    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
      window.clearInterval(_ordertimer);
      _ordertimer = null;
    };
    leftTime = leftTime-1000;
  },
  checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {  
      i = "0" + i;  
    }  
    return i; 
  },
})
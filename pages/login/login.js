let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    loginImageUrl: ports.imgUrl + 'login.png',
    phone:"",
    code:"",
  },
  bindPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  bindCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendFun(){
    if (!this.testAccount(this.data.phone)){
      return false;
    }
    //发送验证码模块
  },
  loginFun(){
    if (!this.testAccount(this.data.phone)) {
      return false;
    }
    if (this.data.code.length!=6) {
      wx.showToast({
        title: '请输入正确验证码',
        icon: "none",
      })
      return false;
    }
  },
  testAccount(phone) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: "none",
      })
      return false;
    } else {
      return true;
    }
  }
})
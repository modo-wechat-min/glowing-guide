let util = require('../../utils/util.js');
let ports = require('../../utils/ports.js');
Page({
  data: {
    array: ['女', '男'], 
    index:0,
    date: "",
    isHasBirthDay:false,
    openId:"",
    UserID: "",
    personObj:"",
    hidden: false,
    userInfo: {},//获取用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function (options) {
    this.setData({
      openId: util.getStorage("openId"),
      UserID: util.getStorage("userID"),
    })
    this.getSettingInfo();
    util.getUserInfoFun(this);
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange(e){
    this.setData({
      index: e.detail.value
    })
  },
  getSettingInfo(){
    let _this=this;
    let OpenID = util.getStorage("openId"); 
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/UserSet?UserID=" + _this.data.UserID + "&OpenID=" + _this.data.openId,
      method: 'get',
      header: {
        "Authorization": OpenID,
      },
      success: function (res) {
        let isHasBirthDay = new Date(res.data.BirthDay).getFullYear() > 1900;
        console.log(isHasBirthDay)
        let BirthDay =  res.data.BirthDay;
        _this.setData({
          personObj: res.data,
          index:res.data.Gender,
          date: isHasBirthDay?BirthDay:"",
          hidden: true,
          isHasBirthDay:isHasBirthDay,
        })
      },
      complete: function (res) {
        if (res.statusCode === 401) {
          util.throwMsg("非法请求");
          util.setStorage('userID', "", false);
          return;
        }
      }
    })
  },
  loginOut(){
    util.setStorage('userID', "", false);
    wx.switchTab({
      url: "../home/home",
    })
  },
  onUnload (){
    //提交修改
    let _this = this;
    let data=this.data;
    let personObj = data.personObj;
    let OpenID = util.getStorage("openId"); 
    let url;
    let obj={
      UserID: _this.data.UserID,
      OpenID: _this.data.openId,
      NickName: _this.data.userInfo.nickName,
      Gender: _this.data.index,
    };
    if (data.index == personObj.Gender && (data.date == personObj.BirthDay || data.date =="")){
      return ;
    }
    if (data.date){
      obj.BirthDay = _this.data.date;
    }
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/UpdateUserSet",
      method: 'post',
      header: {
        "Authorization": OpenID,
      },
      data: obj,
      success: function (res) {
        console.log("提交成功")
      },
      complete: function (res) {
        if (res.statusCode === 401) {
          util.throwMsg("非法请求");
          util.setStorage('userID', "", false);
          return;
        }
      }
    })
  }
})
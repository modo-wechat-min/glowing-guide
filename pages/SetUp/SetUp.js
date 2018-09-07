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
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/UserSet?UserID=" + _this.data.UserID + "&OpenID=" + _this.data.openId,
      method: 'get',
      success: function (res) {
        let isHasBirthDay = new Date(res.data.BirthDay).getFullYear() > 1900;
        let nowTime = util.initTime(0,1);
        let BirthDay = isHasBirthDay ? res.data.BirthDay : nowTime;
        _this.setData({
          personObj: res.data,
          index:res.data.Gender,
          date: BirthDay,
          hidden: true,
          isHasBirthDay: isHasBirthDay,
        })
      },
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
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/UpdateUserSet",
      method: 'post',
      data:{
        UserID: _this.data.UserID,
        OpenID: _this.data.openId,
        NickName: _this.data.userInfo.nickName,
        Gender:_this.data.index,
        BirthDay: _this.data.date,
      },
      success: function (res) {
        console.log("提交成功")
      },
    })
  }
})
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    userInfo: {},//获取用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bgImg:ports.imgUrl + "personal.png",
    bgImg2: ports.imgUrl + "personal2.jpg",
    result:"",
  },
 
  onLoad: function () {
    util.getUserInfoFun(this);
    if (!util.checkRight()) {
      return;
    }
    if (!util.checkIsLogin()) {
      return;
    }
     this.getInit();
  },
  
  getInit() {
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/UserCenter?UserID=" + UserID + "&OpenID=" + OpenID,
      method: 'get',
      success: function (res) {
        console.log(res.data);
        _this.setData({
          result: res.data, //获取当前轮播图片的下标
        })
      },
    })
  },
  toPage(e){
    if (!util.checkRight()) {
      return;
    }
    if (!util.checkIsLogin()) {
      return;
    }
    let page = e.currentTarget.dataset.page;
    let url = '../' + page + '/' + page
    if (page =="CouponLists"){
      url +="?isComePersonal="+true;
    }
    wx.navigateTo({
      url: url,
    })
  }
})
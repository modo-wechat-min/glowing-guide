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
  },
  
  getInit() {
    console.log(222222)
    if (!util.checkIsLogin()) { 
      return;
    }
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
    this.setData({
      page: e.currentTarget.dataset.page,
    })
    util.checkRight(this.pageFun)
  },
  pageFun(){
    if (!util.checkIsLogin()) {
      return;
    }
    let page = this.data.page;
    let url = '../' + page + '/' + page
    if (page == "CouponLists") {
      url += "?isComePersonal=" + true;   
    }
    wx.navigateTo({
      url: url,
    })
  },
  onShow(){
    console.log(1111111)
    util.checkRight(this.getInit)
  }
})
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    UserID:"",
    OpenID:"",
    options:"",
    ImageUrl: ports.imgUrl + 'buy-vip.jpg',
    Images:[1,2,3],
    swiperCurrent:0,
    upgradeArray:[{
      
      title:"VIP黄金卡",
      discrible:"购买89元会员卡或者累计消费3000元",
      right: "9.8折丨延迟退房",
      isCanUp:true,
      imgsrc:"http://ph5rc3ls2.bkt.clouddn.com/bg_huang.png"
    }, {
        title: "VIP铂金卡",
        discrible: "购买289元会员卡或者累计消费10000元",
        right: "9.5折丨延迟退房丨免押金",
        isCanUp: true,
        imgsrc: "http://ph5rc3ls2.bkt.clouddn.com/bg_bo.png"
      }, {
        title: "VIP钻石卡",
        discrible: "累计消费20000元",
        right: "8.8折丨延迟退房丨免押金",
        isCanUp: true,
        imgsrc: "http://ph5rc3ls2.bkt.clouddn.com/vip_zuan.png"
      }]
  },
  onLoad: function (options) {
    this.setData({
      options: options ? options:{},
      UserID : util.getStorage("userID"),
      OpenID : util.getStorage("openId"), 
    })
    this.getMemberShipCardForUpgrade(); 
  },
  
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //获取可升级会员
  getMemberShipCardForUpgrade(){
    let _this = this;
    let UserID = util.getStorage("userID");  
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/getMemberShipCardForUpgrade?UserID=" + _this.data.UserID,
      method: 'get',
      header: {
        "Authorization": _this.data.OpenID,
      },
      success: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // if (res.statusCode === 401) {
        //   util.throwMsg("非法请求");
        //   util.setStorage('userID', "", false);
        //   return;
        // }
      }
    })
  }


})
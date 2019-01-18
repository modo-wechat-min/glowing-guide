let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    activityImg: "",
    countObj:null,
  },
  onShow() {
    this.isRequering = false;//是否提交
    if (!util.checkIsLogin()) {
      return;
    }
    this.userID = util.getStorage("userID");
    this.openId = util.getStorage("openId");
    this.activityFn();
    this.getCountFn();
  },
  //获取图片背景
  activityFn: function () {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/HomeActiveInfo",
      method: 'get',
      success: function (res) {
        _this.setData({
          activityImg: ports.imgUrl + res.data.ListActiveInfor[2].ImageUrl[2], //首页背景图 
        })
      },
    })
  },
  getPosition:function(e){
console.log(e)
    let obj = wx.createSelectorQuery();
    let page = obj.selectAll(".main-activity-box");
    let eventX = e.detail.x;
    let eventY = e.detail.y;
    page.boundingClientRect(function (rect) {
        // console.log(rect[0].height)
      let minHeight = rect[0].height*0.2623;
      let maxHeight = rect[0].height * 0.3150;
      let minWidth = rect[0].width * 0.35;
      let maxWidth = rect[0].width * 0.65;
      if ((minHeight < eventY && eventY < maxHeight) && (minWidth < eventX && eventX < maxWidth)){
        wx.navigateTo({
          url: '../BranchLists/BranchLists?CityIndex=' + 0,
        })
      }
      }).exec()  
    let pageImgHeight
  },
  getCountFn:function(){
    let _this = this;
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/GetLuckyCount",
      method: 'get',
      header: {
        "Authorization": _this.openId,
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          countObj: res.data, 
        })
      },
    })
  },
  buyLuckPackageFn:function(e){
    var type = e.currentTarget.dataset.type;
    let _this = this;
    if (_this.isRequering) {
      return;
    }
    _this.isRequering=true;
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/GetLuckyPayDate",
      method: 'post',
      header: {
        "Authorization": _this.openId,
      },
      data:{
        UserID: _this.userID,
        OpenID: _this.openId,
        Type: type,
      },
      success: function (res) {
        _this.isRequering = false;
        if (res.data.Code ==="FAIL"){
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 2000
          })
          return ;
        }
        let PayMessage = res.data.PayDate;
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
            setTimeout(function () {
              wx.navigateBack();
            }, 2000)
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
            })
          },
        })
      },
    })
  }
})
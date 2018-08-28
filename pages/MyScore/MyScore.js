let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    scoreObj: "",
    UserID: 0,
    hidden: false,
    moreScore: false,
  },
  onLoad: function(options) {
    let UserID = util.getStorage("userID", true);
    this.setData({
      UserID: UserID
    })
    this.getScore();
  },
  getScore() {
    let _this = this;
    console.log(_this.data.UserID + "123")
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetMyScoreRecord?UserID=" + _this.data.UserID,
      method: 'get',
      success: function(res) {
        console.log(res)
        _this.setData({
          scoreObj: res.data,
          hidden: true,
        })
      },
    })
  },
  moreFun() {
    this.setData({
      moreScore: !this.data.moreScore,
    })
  }
})
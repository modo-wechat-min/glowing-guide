import { updateVip } from "../../utils/vipUpdate.js";
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    ImageUrl: [
      ports.imgUrl + 'vip_bai.png',
      ports.imgUrl + 'vip_huang.png',
      ports.imgUrl + 'vip_bo.png',
      ports.imgUrl + 'vip_zuan.png',
    ],
    UserID:"",
    OpenID:"",
    rightObj: {},
    vipId:"",
    rightArray: [{ //vipId,0是钻石，1是铂金，2是黄金，3是白银
      vipId: 5,
      lists: [{
        vipType: "订房专属折扣",
        rightContent: "8.8",
        typeId: 0,
      }, {
        vipType: "延迟退房",
        rightContent: "14:00",
        typeId: 1,
      }, {
        vipType: "订房免押金",
        rightContent: "成为钻石会员后，所有房间可以享受免押金预订",
        typeId: 2,
      }]
    }, {
      vipId: 4,
      lists: [{
        vipType: "订房专属折扣",
        rightContent: "9.2",
        typeId: 0,
      }, {
        vipType: "延迟退房",
        rightContent: "14:00",
        typeId: 1,
      }, {
        vipType: "订房免押金",
        rightContent: "成为铂金会员后，所有房间可以享受免押金预订",
        typeId: 2,
      }]
    }, {
      vipId: 1,
      lists: [{
        vipType: "订房专属折扣",
        rightContent: "9.5",
        typeId: 0,
      }, {
        vipType: "延迟退房",
        rightContent: "13:00",
        typeId: 1,
      }]
    }],
    TypeToString:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let rightObj;
    let type = parseInt(options.type);
    let IsExChange = options.IsExChange ? options.IsExChange:"";
    let IsOnlineSale = options.IsOnlineSale ? options.IsOnlineSale:"";
    let TypeToString = options.TypeToString ? options.TypeToString:"";
    
    for (let i = 0; i < this.data.rightArray.length;i++){
      if (this.data.rightArray[i].vipId == type){
        rightObj = this.data.rightArray[i];
      }
    }
    console.log(rightObj)
    this.setData({
      rightObj: rightObj.lists,
      IsExChange: IsExChange,
      IsOnlineSale: IsOnlineSale,
      vipId: type,
      TypeToString: TypeToString,
      UserID: util.getStorage("userID"),
      OpenID: util.getStorage("openId"),
    })
    this.options = options;
  },
  checkRightAndUpdate(){
    util.checkRight(this.upDateFn);
  },
  upDateFn(e) {
    var _this=this;
    if (!util.checkIsLogin()) {
      util.setStorage("vipOption", _this.options);
      return;
    }
    let data = this.data;
    console.log(data.IsExChange, data.IsOnlineSale, data.UserID, data.vipId, data.OpenID);
    updateVip(data.IsExChange, data.IsOnlineSale, data.UserID, data.vipId, data.OpenID);
  }
})
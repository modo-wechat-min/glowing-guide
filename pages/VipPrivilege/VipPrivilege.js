Page({
  data: {
    rightObj:{},
    rightArray: [{   //vipId,0是钻石，1是铂金，2是黄金，3是白银
       vipId:0,
       lists: [{
         vipType: "订房专属折扣",
         rightContent: "成为钻石会员后，所有房间单价在均在原来的基础上享8.8折优惠",
         typeId: 0,
       }, {
           vipType: "延迟退房",
           rightContent: "可享受整日订单延迟退房到14:00",
           typeId: 1,
         }, {
           vipType: "订房免押金",
           rightContent: "成为钻石会员后，所有房间可以享受免押金预订",
           typeId: 2,
         }]
     }, {
         vipId: 1,
         lists: [{
           vipType: "订房专属折扣",
           rightContent: "成为铂金会员后，所有房间单价在均在原来的基 础上享9.2折优惠",
           typeId: 0,
         }, {
           vipType: "延迟退房",
             rightContent: "可享受整日订单延迟退房到14:00",
           typeId: 1,
         }, {
           vipType: "订房免押金",
             rightContent: "成为铂金会员后，所有房间可以享受免押金预订",
           typeId: 2,
         }]
      }, {
        vipId: 2,
        lists: [{
          vipType: "订房专属折扣",
          rightContent: "成为黄金会员后，所有房间单价在均在原来的基础上享9.5折优惠",
          typeId: 0,
        }, {
          vipType: "延迟退房",
            rightContent: "可享受整日订单延迟退房到13:00",
          typeId: 1,
        }]
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       this.setData({
         rightObj: this.data.rightArray[0].lists,
       })
  },
})
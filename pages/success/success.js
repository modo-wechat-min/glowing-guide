Page({
  data:{
    type: "clean",//type类型对应不同状态，buy购买会员卡，clean预约打扫，charge充值，comment评价,payment订单支付成功
  },
   onLoad: function (options) {
     this.setData({
       type: options.type,
     })
   }
})
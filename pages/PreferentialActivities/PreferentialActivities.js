let ports = require('../../utils/ports.js');
Page({
  data: {
    imgUrls: [
      ports.imgUrl +"active_1.jpg",
      ports.imgUrl + "active_2.jpg",
      ports.imgUrl + "active_3.jpg"
    ],
    titles:[{
      title:"每日优惠券",
      subtitle:"次标题"
    },{
        title: "签到领积分",
      subtitle: "次标题"
      }, {
        title: "今日特惠房",
        subtitle: "次标题"
      }]
  },
})
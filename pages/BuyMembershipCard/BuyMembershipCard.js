let ports = require('../../utils/ports.js');
Page({
  data: {
    imgUrls: [
      ports.imgUrl + "vip_1.jpg",
      ports.imgUrl + "vip_2.jpg",
    ],
    titles: [{
      title: "VIP黄金卡",
      content:"享有50元代金券*2",
      discount:"所有房间均享97折优惠",
    }, {
        title: "VIP铂金卡",
        content: "享有100元代金券*5",
        discount: "所有房间均享97折优惠",
    }]
  },
})
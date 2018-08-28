
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  phone(e) {
    let phone = "4000-777-365";
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
})
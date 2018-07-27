let ports = require('../../utils/ports.js');
Page({
  data: {
    bgImageUrl: ports.imgUrl + 'id_card.jpg',
    idImageUrl: ports.imgUrl + 'id_card2.jpg',
    flag: false,
    tempFilePaths: "",
    hasImg: false,
  },

  onLoad: function(options) {

  },
  chooseimage() {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      // 可以指定是原图还是压缩图，默认二者都有  
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
      success: function(res) {
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
        var path = res.tempFilePaths;
        wx.uploadFile({
          url: 'http://192.168.1.183:8085/upload', //仅为示例，非真实的接口地址
          filePath: path[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
            var data = res.data;
            console.log(data)
            //do something
          }
        })
      }
    })
  }
})
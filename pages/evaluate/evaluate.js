
Page({

  data: {
  array:[0,0,0,0,0],
  isHideName:true,
  },
  tempFilePaths:"",
  onLoad: function (options) {
  
  },
  isHideNameFun(){
    this.setData({
      isHideName: !this.data.isHideName,
    })
  },
  
})
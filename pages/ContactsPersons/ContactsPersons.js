let util = require('../../utils/util.js');
let ports = require('../../utils/ports.js');
Page({
  data: {
    listsObj:null,
    choseID:-1,
    index:"", 
    hidden: false,
    nodata:false,
  },
  onLoad: function (options) {
    this.setData({
      index: options.index,
    })
  },
  getLists(){
    util.getContractsLists(this);
  },
  choseThisPerson(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      choseID: id,
    })
  },
  conformPerson(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页面
    var array= prevPage.data.roomArray;
    array[this.data.index] = this.data.listsObj[this.data.choseID];
    prevPage.setData({
      roomArray: array,
    });
    wx.navigateBack({ changed: true });
  },
  onShow(){
    this.getLists();
  }
})
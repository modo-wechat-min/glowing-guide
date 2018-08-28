let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({

  data: {
    array: [0, 0, 0, 0, 0],
    isHideName: true,
    hidden: false,
    orderObj: "",
    note: "",
    billId: "",
    imgPorts: ports.modoImgHttp,
    thisReviewNameScore: 5,
    reviewItemListArray: [],
  },
  onLoad: function(options) {
    this.setData({
      billId: options.TypeValueID
    })
    this.init()
  },
  bindNote(e) {
    this.setData({
      note: e.detail.value
    })
  },
  bindReviewNameScore(e) {
    let dataset = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset)
    this.setData({
      thisReviewNameScore: dataset.index+1,
    })
  },
  init() {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetCommentBill?billId=" + _this.data.billId,
      method: 'get',
      success: function(res) {
        console.log(res.data);
        let reviewItemListArray = res.data.reviewItemList.map(function(item, key, ary) {
          let obj = {};
          obj.ReviewItemValue = 5;
          obj.ReviewItemId = item.ReviewId;
          obj.ReviewShortName = item.ShortName;
          return obj;
        })
        console.log(reviewItemListArray)
        _this.setData({
          orderObj: res.data,
          reviewItemListArray: reviewItemListArray,
          hidden: true,
        })
      },
    })
  },
  publicFun() {
    let _this = this;
    let jsonContent={};
    let data = _this.data;
    let obj = {};
    obj.ReviewItemValue = data.thisReviewNameScore;
    obj.ReviewItemId = data.orderObj.thisReviewId;
    obj.ReviewShortName = data.orderObj.thisReviewName;
    let array=data.reviewItemListArray;
    array.push(obj);
    jsonContent.BillId = data.billId;
    jsonContent.Content = data.note;
    jsonContent.ReviewItemContent = array;
    console.log(JSON.stringify(jsonContent));
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/SendCommentBill" ,
      method: 'post',
      data:{
        jsonStr: JSON.stringify(jsonContent),
      },
      success: function(res) {
        if (res.data.state==1){
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          util.throwMsg(res.data.ErrorMessage);
        }
      },
    })
  },
  evaluateFun(e) {
    let dataset = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset)
    let array = this.data.reviewItemListArray;
    array[dataset.groupindex].ReviewItemValue = dataset.cellindex + 1;
    this.setData({
      reviewItemListArray: array,
    })
    console.log(this.data.reviewItemListArray)
  }
})
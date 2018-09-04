let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
var demo = new QQMapWX({
  key: 'GN2BZ-EHZ62-Y62U5-CX56F-EV4EQ-XBFN4' // 必填
});
Page({
  data: {
    hidden: false,
    imgurl: ports.imgUrl + 'img_1.png',
    index: 0,
    array: ['不限', '北京', '南京'],
    startTime: "",
    endTime: "",
    minPrice: 0,
    maxPrice: 0,
    branchLists: [], //展示列表
    realLists: [], //不变列表
    imgPorts: ports.modoImgHttp,
    days: 1,
    KeyWord: "",
    tradeArray: [],
    orderIndex: 0,
    openOrder: false,
    order: [{
      name: "默认排序",
      id: 0
    }, {
      name: "距离优先",
      id: 1
    }, {
      name: "好评优先",
      id: 2
    }, {
      name: "低价优先",
      id: 3
    }, {
      name: "高价优先",
      id: 4
    }]

  },
  onLoad: function(options) {
    if (options.StartDate) {
      this.setData({
        startTime: options.StartDate,
        endTime: options.EndDate,
        days: options.days,
        index: options.CityIndex,
      })
    } else {
      this.defaultSet();
    }
    this.getBranchLists();
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    this.getBranchLists();
  },
  toOption() {
    wx.navigateTo({
      url: '../condition/condition?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + "&minPrice=" + this.data.minPrice + "&maxPrice=" + this.data.maxPrice + "&KeyWord=" + this.data.KeyWord + "&tradeArray=" + JSON.stringify(this.data.tradeArray) + "&days=" + this.data.days,
    })
  },
  openOrderFun() {
    this.setData({
      openOrder: !this.data.openOrder,
    })
  },
  getBranchLists() {
    this.setData({
      hidden: false,
    })
    let _this = this;
    let array = _this.data.tradeArray;
    array = array.map(function(item, key) {
      return item.ID
    })
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetBranchList?StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&CityID=" + this.data.index + "&KeyWord=" + this.data.KeyWord + "&MinPrice=" + this.data.minPrice + "&MaxPrice=" + this.data.maxPrice + "&Trading=" + array.toString(),
      method: 'get',
      success: function(res) {
        console.log(res)
        _this.setData({
          realLists: res.data,
          branchLists: res.data, //获取当前轮播图片的下标
          hidden: true,
        })
        _this.getDistance();
      },
    })
  },
  getDistance() {
    let _this = this;
    let lists = this.data.branchLists;
    if (lists.length == 0) {
      return false;
    }
    var newLists = lists.map(function(item, key, ary) {
      var obj = {};
      obj.latitude = item.Dimension;
      obj.longitude = item.Longitude;
      return obj;
    });
    demo.calculateDistance({
      to: newLists,
      success: function(res) {
        let elements = res.result.elements;
        let array = _this.data.branchLists;
        array = array.map(function(item, key, arr) {
          Object.assign(item, elements[key]);
          return item;
        })
        _this.setData({
          branchLists: array,
          realLists: array,
        })
      },
    });
  },
  goBranchDetails(e) {
    var branchId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../BranchDetails/BranchDetails?BranchID=' + branchId + '&StartDate=' + this.data.startTime + "&EndDate=" + this.data.endTime + "&days=" + this.data.days,
    })
  },
  getThisOrder(e) {
    let index = e.currentTarget.dataset.index;
    let realLists = this.data.realLists;
    let branchLists = this.data.branchLists;
    let array;
    let name = "distance";
    if (index == 0) {
      array = realLists;
    } else if (index == 1) {
      array = branchLists.sort(compare)
    } else if (index == 2) {
      name = "ScoreAvg"
      array = branchLists.sort(function(obj1, obj2) {
        var val1 = obj1["ScoreAvg"];
        var val2 = obj2["ScoreAvg"];
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      })
    } else if (index == 3) {
      name = "Adjustmentprice"
      array = branchLists.sort(compare)
    } else if (index == 4) {
      array = branchLists.sort(function(obj1, obj2) {
        var val1 = obj1["Adjustmentprice"];
        var val2 = obj2["Adjustmentprice"];
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      })
    }
    this.setData({
      orderIndex: e.currentTarget.dataset.index,
      openOrder: false,
      branchLists: array,
    })

    function compare(obj1, obj2) {
      var val1 = obj1[name];
      var val2 = obj2[name];
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  closeFun() {
    this.setData({
      openOrder: false,
    })
  },
  defaultSet() {
    this.setData({
      startTime: util.initTime(0),
      endTime: util.initTime(1),
      days: 1,
      index: 0,
      minPrice: 0,
      maxPrice: 0,
      KeyWord: "",
    })
  },
})
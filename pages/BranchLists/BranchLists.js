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
    array: ['不限', '北京', '南京','杭州'],
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
    nodata:false,
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
      },{
        name: "房数优先",
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
      url: '../condition/condition?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + "&minPrice=" + this.data.minPrice + "&maxPrice=" + this.data.maxPrice + "&KeyWord=" + this.data.KeyWord + "&tradeArray=" + JSON.stringify(this.data.tradeArray) + "&days=" + this.data.days + "&index=" + this.data.index,
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
    let UserID = util.getStorage("userID") ? util.getStorage("userID"):0;
    let array = _this.data.tradeArray;
    array = array.map(function(item, key) { 
      return item.ID
    })
    let cityId = this.data.index == 3 ? 4 : this.data.index;
    let url = ports.modoHttp + "API/WeChatMiniProgram/GetBranchList?StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&CityID=" + cityId + "&KeyWord=" + this.data.KeyWord + "&MinPrice=" + this.data.minPrice + "&MaxPrice=" + this.data.maxPrice + "&Trading=" + array.toString() + "&UserID=" + UserID; 
    console.log(url);
    wx.request({
      url:url,
      method: 'get',
      success: function(res) {
        console.log(res)
        _this.setData({
          realLists: res.data,
          branchLists: res.data, //获取当前轮播图片的下标
          hidden: true,
          nodata: true,
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
    let name = "";//按什么排序
    let type=true; //true是升序
    if (index == 0) {
      array = realLists;
    } else if (index == 1) {
      type = true;
      name = "distance";
      array = branchLists.sort(compare)
    } else if (index == 2) {
      type = false;
      name = "ScoreAvg"
      array = branchLists.sort(compare)
    } else if (index == 3) {
      type = true;
      name = "Adjustmentprice"
      array = branchLists.sort(compare)
    } else if (index == 4) {
      type = false;
      name = "Adjustmentprice"
      array = branchLists.sort(compare)
    } else if (index == 5){
      type = false;
      name = "RoomNumber"
      array = branchLists.sort(compare)
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
        return type?-1:1;
      } else if (val1 > val2) {
        return type ? 1 : -1;;
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
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    homeImageUrl2: ports.imgUrl + 'home_2.jpg',
    startTime: util.initTime(0),
    endTime: util.initTime(1),
    days: 1,
    index: 0,
    array: ['不限', '北京', '南京'],
    currentCity: "",
    buyMemberUrl: ports.imgUrl + 'activity_member.jpg', 
    imgArrayActivity:[],
  },
  onLoad: function() {
    this.getMapRight();
    this.getLocation();
    // this.GetIsActiveMember();
    // this.bannerCheck();
    this.activityFn();
  },
  toGetDate: function() { // 获取日期
    var _this = this;
    wx.navigateTo({
      url: '../date/date?startTime=' + _this.data.startTime + '&endTime=' + _this.data.endTime,
    })
  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: '4000-777-365'
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  goBranchLists() {
    wx.navigateTo({
      url: '../BranchLists/BranchLists?CityIndex=' + this.data.index + '&StartDate=' + this.data.startTime + '&EndDate=' + this.data.endTime + '&days=' + this.data.days,
    })
  },
  getLocation() {
    //地图授权
    let _this = this
    wx.getLocation({
      type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function(res) {
        // success  
        console.log("success")
        _this.loadCity(res.longitude, res.latitude)
      },
    })
  },
  loadCity: function(longitude, latitude) {
    var _this = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=okwY7l5GUysxj1blQhUWq6NlXjuoi1l3&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        var city = res.data.result.addressComponent.city;
        var index = 0;
        if (city.indexOf("北京") > -1) {
          index = 1;
        } else if (city.indexOf("南京") > -1) {
          index = 2;
        }
        _this.setData({
          index: index
        });
      },
      fail: function() {
        _this.setData({
          currentCity: "获取定位失败"
        });
      },
    })
  },
  //地图授权提醒
  getMapRight() {
    let _this = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          _this.getLocation()
        }
      }
    })
  },
  activityFn: function() {
    let _this = this;
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/HomeActiveInfo",
      method: 'get',
      success: function(res) {
        console.log(res);
        console.log(res.data.ListActiveInfor);
        var imgArray = res.data.ListActiveInfor.map(function(item){
          var subImg=[]
          subImg=item.ImageUrl.map(function(subItem){
             return ports.imgUrl+subItem;
          })
          item.ImageUrl = subImg;
          return item;
        })
        _this.setData({
          imgArrayActivity:imgArray,
        })
        _this.isHaveActivity = res.data.IsActive;
      },
    })
  },
  activityNextFn: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var url;
    if (this.isHaveActivity && index==0) {
      url = "../Thanksgiving/Thanksgiving";
    } else if (this.isHaveActivity && index == 1){
      url = "../modoActivity/modoActivity";
    } else {
      url = '../BranchLists/BranchLists?CityIndex=' + this.data.index + '&StartDate=' + this.data.startTime + '&EndDate=' + this.data.endTime + '&days=' + this.data.days;
    }
    wx.navigateTo({
      url: url,
    })
  }

  // GetIsActiveMember(){
  //   let _this = this;
  //   wx.request({
  //     url: ports.modoHttp + "API/WeChatMiniProgram/GetIsActiveMember",
  //     method: 'get',
  //     success: function (res) {
  //       console.log(res)
  //       _this.setData({
  //         IsActiveMember: res.data, //获取当前轮播图片的下标
  //       })

  //     },
  //   })
  // },
  //判断横幅是否展示
  // bannerCheck(){
  //   let _this = this;
  //   wx.request({
  //     url: ports.modoHttp + "api/WeChatMiniProgram/CheckIsShowGoBuyMember",
  //     method: 'get',
  //     success: function (res) {
  //       _this.setData({
  //         bannerShow: res.data, //获取当前轮播图片的下标
  //       })

  //     },
  //   })
  // }
})
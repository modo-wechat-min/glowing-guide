let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
var timer;
Page({
  data: {
    isFresh: "",
    hidden: false,
    branchId: 0,
    startTime: "",
    endTime: "",
    branchObj: {},
    typeObj: null, 
    RoomTypeID: "",
    modoImgHttp: ports.modoImgHttp, 
    modoHttp2: ports.modoHttp2,
    days: 1,
    itemIndex: 0,
    imgIndex: 1,
    marker: [],
    latitude: "",
    longitude: "",
    options: "",
    defaultImg: ports.imgUrl +"default.jpg",
    UserID: "",
    unsubscribe:[{
      "step":0,
      "title": "预定成功",
      "rule":"可自行取消",
    }, {
        "step": 1,
        "title": "入住日16点之前",
        "rule": "收取首晚房费的",
        "subRule":"50%作为违约金"
      }, {
        "step": 2,
        "title": "入住日16点-20点之前",
        "rule": "收取首晚房费的",
        "subRule": "100% 作为违约金"
      }, {
        "step": 3,
        "title": "入住日20点以后",
        "rule": "",
      }],
  },
  onLoad: function(options) {
    this.setData({
      branchId: options.BranchID,
      startTime: options.StartDate,
      endTime: options.EndDate,
      days: options.days,
      options: options,
      UserID : util.getStorage("userID"),
    })
    this.getBranchInfo();
    
  },
  getBranchInfo() {
    let _this = this;
    _this.setData({
      hidden: false, 
    })
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/BranchDetail?BranchID=" + parseInt(_this.data.branchId) + "&StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&UserID=" + _this.data.UserID,
      method: 'get',
      success: function(res) {
        console.log(res);
        let resObj = res.data;
        let RoomTypes = resObj.RoomTypes;
        //重新排序房型
        //筛选特惠房
        let RoomType1 = RoomTypes.filter(function(item){
            return item.Type == 1;
        })
        //筛选非特惠房
        let RoomType2 = RoomTypes.filter(function (item) {
          return item.Type != 1;
        })
        RoomTypes = RoomType1.concat(RoomType2); 
        resObj.RoomTypes = RoomTypes;
        let latitude = resObj.Dimension;
        let longitude = resObj.Longitude;
        let array=[];
        array = _this.swithFun(longitude, latitude);
        longitude = array[0]; 
        latitude = array[1];  
        let marker = [];
        marker[0] = {
          iconPath: "../../image/location.png",
          id: 0,
          latitude: latitude, 
          longitude: longitude,
          width: 50,
          height: 50
        }
        _this.setData({
          branchObj: resObj,
          marker: marker,
          latitude: latitude,
          longitude: longitude,
          hidden: true,
        })
      },
    })
  },
  phone(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  toGetDate: function() { // 获取日期
    wx.navigateTo({
      url: '../date/date?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + '&days=' + this.data.days + "&isFresh=" + true,
    })
  },
  toBook(e) {
    this.setData({
      RoomTypeID: e.currentTarget.dataset.type,
      planid: e.currentTarget.dataset.planid,
    })
    util.setStorage('options', this.data.options);
    util.checkRight(this.bookFun);

  },
  bookFun() {
    if (!util.checkIsLogin()) {
      return;
    }
    wx.navigateTo({
      url: '../OrderEdit/OrderEdit?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + '&days=' + this.data.days + "&BranchID=" + this.data.branchId + "&RoomTypeID=" + this.data.RoomTypeID + "&PlanID=" + this.data.planid,
    })
  },
  goTypePage(e){
    let RoomTypeID = e.currentTarget.dataset.roomtypeid;
    let booknumber = e.currentTarget.dataset.booknumber;
    wx.navigateTo({
      url: '../RoomTypeDetails/RoomTypeDetails?StartDate=' + this.data.startTime + '&EndDate=' + this.data.endTime + '&days=' + this.data.days + "&BranchID=" + this.data.branchId + "&RoomTypeID=" + RoomTypeID + "&booknumber=" + booknumber,
    })
  },
  getItemDetails(e) {
    let newIndex = e.currentTarget.dataset.index;
    if (newIndex == this.data.itemIndex){
      newIndex=-1;
    }
    this.setData({
      itemIndex: newIndex
    })
  },
  swiperPageSwith(e) {
    this.setData({
      imgIndex: e.detail.current + 1,
    })
  },
  
  onShow() {
    if (this.data.isFresh) {
      this.getBranchInfo();
    }
  },
  noteFun() {
    util.throwMsg("该房型已售完");
  },
  
  openLocation: function (e) {
    let data = this.data
    wx.openLocation({
      latitude: parseFloat(data.latitude) , 
      longitude: parseFloat(data.longitude),
      scale: 16,
      name: data.branchObj.Name,
      address: data.branchObj.Address, 
    })
  },
  swithFun(bd_lon, bd_lat){
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      var x = bd_lon - 0.0065;
      var y = bd_lat - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      var gg_lng = z * Math.cos(theta);
      var gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat];
  },
  
})
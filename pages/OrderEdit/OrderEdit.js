let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    hidden: false,
    isFresh: "", //保证调整时间页面刷新
    branchId: "",
    typeId: "",
    imgUrls: ports.imgUrl + 'img_1.png',
    startTime: "",
    endTime: "",
    days: "",
    orderObj: null,
    number: 1,
    modoImgHttp: ports.modoImgHttp,
    roomArray: [null],
    couponObj: null,
    Remark: "",
    useStorage: 0, //是否使用储值卡
    CanSoldNumber: 0, //可预订数量
    index: 0, //时间索引
    isChecked: false,
  },
  onLoad: function(options) {
    this.setData({
      branchId: options.BranchID,
      typeId: options.RoomTypeID,
      startTime: options.startTime,
      endTime: options.endTime,
      days: options.days,
    });
    this.getOrder();
  },
  changeSwitch() {
    let isChecked=this.data.isChecked;
    if (isChecked){
      this.setData({
        isChecked: !this.data.isChecked,
        useStorage:0,
      })
    }else{
      this.setData({
        isChecked: !this.data.isChecked,
      })
    }
  },
  useStorageFun(e) {
    let Balance = this.data.orderObj.Balance;
    let useValue = e.detail.value;
    let data = this.data;
    let number = data.number;
    let TotalMoney = data.orderObj.TotalMoney;
    let InitValue = data.couponObj ? data.couponObj.InitValue : 0;
    let maxTotal = TotalMoney * number - InitValue;
    if (maxTotal < useValue) {
      util.throwMsg("您输入金额已超出消费金额！");
      this.setData({
        useStorage: this.data.useStorage
      })
    } else if (Balance<useValue){
      util.throwMsg("您输入金额已超出储值金额！");
      this.setData({
        useStorage: this.data.useStorage
      })
    } else {
      this.setData({
        useStorage: useValue
      })
    }

  },
  getOrder() {
    this.setData({
      hidden: false,
    });
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/Booking?BranchID=" + _this.data.branchId + "&StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&RoomTypeID=" + _this.data.typeId + "&UserID=" + UserID + "&OpenID=" + OpenID,
      method: 'get',
      success: function(res) {
        let roomArray = _this.data.roomArray;
        if (res.data.CanSoldNumber < _this.data.number) {
          if (res.data.CanSoldNumber == 0) {
            util.throwMsg("没有可预订房间了，亲！");
          }
          roomArray.length = res.data.CanSoldNumber;
          _this.setData({
            orderObj: res.data,
            number: res.data.CanSoldNumber,
            roomArray: roomArray,
            CanSoldNumber: res.data.CanSoldNumber,
            hidden: true,
          })
        } else {
          _this.setData({
            orderObj: res.data,
            CanSoldNumber: res.data.CanSoldNumber,
            hidden: true,
          })
        }
      },
    })
  },
  toGetDate: function() { // 获取日期
    var _this = this;
    wx.navigateTo({
      url: '../date/date?startTime=' + _this.data.startTime + '&endTime=' + _this.data.endTime + "&isFresh=" + true,
    })
  },
  getNumber(e) {
    let dataset = e.currentTarget.dataset;
    let array = this.data.roomArray;
    if (dataset.number) {
      if (this.data.number == this.data.CanSoldNumber) {
        util.throwMsg("没有更多房间了，亲！");
        return false;
      }
      array.push(null)
      this.setData({
        number: this.data.number + 1,
        roomArray: array,
      })
    } else {
      if (this.data.number <= 1) {
        util.throwMsg("不能再少了，亲！");
        return false;
      }
      array.length = array.length - 1
      this.setData({
        number: this.data.number - 1,
        roomArray: array,
      })
    }
  },
  chosePerson(e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../ContactsPersons/ContactsPersons?index=' + index,
    })
  },
  deletePerson(e) {
    let index = e.currentTarget.dataset.index;
    let array = this.data.roomArray;
    array[index] = null;
    this.setData({
      roomArray: array,
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindRemark(e) {
    this.setData({
      Remark: e.detail.value
    })
  },
  toDailyPrice(e) {
    wx.navigateTo({
      url: '../EveryDayPrice/EveryDayPrice?startTime=' + this.data.startTime + '&endTime=' + this.data.endTime + "&RoomTypeID=" + this.data.typeId,
    })
  },
  onShow() {
    if (this.data.isFresh) {
      this.getOrder();
    }
  },
  bookFun() {
    if (this.data.CanSoldNumber <= 0) {
      return false;
    }
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    let JsonVoucher = []
    if (_this.data.couponObj) {
      JsonVoucher[0] = {};
      JsonVoucher[0].ID = _this.data.couponObj.ID;
    }
    let JsonPerson = [];
    if (_this.data.roomArray[0]) {
      _this.data.roomArray.map(function(item, key, ary) {
        let obj = {};
        obj.ID = item.ID;
        JsonPerson.push(obj);
      })
    }
    console.log(_this.data.number)
    wx.request({
      url: ports.modoHttp + "api/WeChatMiniProgram/CreateBill",
      method: 'post',
      data: {
        UserID: UserID,
        OpenID: OpenID,
        BranchID: _this.data.branchId,
        RoomTypeID: _this.data.typeId,
        RoomCount: _this.data.number,
        StartDate: _this.data.startTime,
        EndDate: _this.data.endTime,
        JsonPerson: JSON.stringify(JsonPerson),
        JsonVoucher: JSON.stringify(JsonVoucher),
        Remark: _this.data.Remark,
        UseBalance: _this.data.useStorage,
        ArriveTime: _this.data.index, //时间索引，就是时间 
      },
      success: function(res) {
        console.log(res)
        let PayMessage = res.data.PayMessage;
        let BillID = res.data.BillID;
        if (res.data.Code == "SUCCESS") {
          wx.requestPayment({
            timeStamp: PayMessage.timeStamp,
            nonceStr: PayMessage.nonceStr,
            package: PayMessage.package,
            signType: PayMessage.signType,
            paySign: PayMessage.paySign,
            'success': function (res) {
              wx.navigateTo({
                url: '../OrderDetails/OrderDetails?TypeValueID=' + BillID,
              })
            },
            'fail': function (res) {
              wx.navigateTo({
                url: '../OrderDetails/OrderDetails?TypeValueID=' + BillID,
              })
            }
          })
        } else {
          util.throwMsg(res.data.ErrorMessage);
        }
      },
    })
  },
  isUseStorageFun() {
    this.setData({
      isUseStorage: !this.data.isUseStorage,
    })
  },
})
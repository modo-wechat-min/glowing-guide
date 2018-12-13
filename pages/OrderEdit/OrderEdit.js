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
    useStorage: "", //是否使用储值卡
    CanSoldNumber: 0, //可预订数量
    index: 0, //时间索引
    isChecked: false,
    defaultImg: ports.imgUrl + "default.jpg",
  },
  onLoad: function(options) {
    this.setData({
      branchId: options.BranchID,
      typeId: options.RoomTypeID,
      startTime: options.startTime,
      endTime: options.endTime,
      days: options.days,
      PlanID: options.PlanID,
    });
    this.getOrder();
  },
  changeSwitch() {
    let isChecked=this.data.isChecked;
    if (isChecked){
      this.setData({
        isChecked: !this.data.isChecked, 
        useStorage:"",
      })
    }else{
      let Balance = this.data.orderObj.Balance;
      let data = this.data;
      let number = data.number;
      let PayMoney = data.orderObj.PayMoney;
      let InitValue = data.couponObj ? data.couponObj.InitValue : 0;
      let maxTotal = PayMoney * number - InitValue;
      let useStorage=Math.min(Balance, maxTotal);
      this.setData({
        isChecked: !this.data.isChecked, 
        useStorage: useStorage
      })
    }
  },
  useStorageFun(e) {
    let Balance = this.data.orderObj.Balance;
    let useValue = e.detail.value;
    let data = this.data;
    let number = data.number;
    let PayMoney = data.orderObj.PayMoney;
    let InitValue = data.couponObj ? data.couponObj.InitValue : 0;
    let maxTotal = PayMoney * number - InitValue;
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
      url: ports.modoHttp + "API/WeChatMiniProgram/Booking?BranchID=" + _this.data.branchId + "&StartDate=" + _this.data.startTime + "&EndDate=" + _this.data.endTime + "&RoomTypeID=" + _this.data.typeId + "&UserID=" + UserID + "&OpenID=" + OpenID + "&PlanID=" + _this.data.PlanID,
      method: 'get',
      success: function(res) {
        console.log(res)
        let couponObj={};
        couponObj.ID = res.data.VoucherID;
        couponObj.InitValue = res.data.VoucherMoney;
        let roomArray = _this.data.roomArray;
        if (res.data.CanSoldNumber < _this.data.number) {
          if (res.data.CanSoldNumber == 0) {
            util.throwMsg("没有可预订房间了，亲！");
          }
          roomArray.length = res.data.CanSoldNumber > 0?res.data.CanSoldNumber:0;
          _this.setData({
            orderObj: res.data,
            number: res.data.CanSoldNumber > 0 ? res.data.CanSoldNumber : 0,
            roomArray: roomArray,
            CanSoldNumber: res.data.CanSoldNumber,
            couponObj: couponObj, 
            hidden: true,
            isFresh:"",
          })
        } else {
          _this.setData({
            orderObj: res.data,
            CanSoldNumber: res.data.CanSoldNumber,
            hidden: true,
            couponObj: couponObj,
            isFresh: "",
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
        isChecked: false,
        useStorage: "",
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
        isChecked: false,
        useStorage: "",
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
    this.setData({
      hidden: false,
    });
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    let JsonVoucher = [{}]
    if (_this.data.couponObj) {
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
    //优惠券只有IsVoucher==1时才可以使用
    let voucher="";
    if (_this.data.orderObj.IsVoucher==1){
      voucher=JsonVoucher[0].ID && JsonVoucher[0].ID > 0 ? JSON.stringify(JsonVoucher) : null
    }
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
        JsonPerson: JsonPerson[0] != null ? JSON.stringify(JsonPerson) : null,
        JsonVoucher: voucher,
        Remark: _this.data.Remark,
        UseBalance: _this.data.useStorage,
        ArriveTime: _this.data.index, //时间索引，就是时间  
      },
      success: function(res) {
        let PayMessage = res.data.PayMessage; 
        let BillID = res.data.BillID;
        _this.setData({
          hidden: true,
        });
        if (res.data.PayMoney>0){


          if (res.data.Code == "SUCCESS") {
            wx.requestPayment({
              timeStamp: PayMessage.timeStamp,
              nonceStr: PayMessage.nonceStr,
              package: PayMessage.package,
              signType: PayMessage.signType,
              paySign: PayMessage.paySign,
              success: function (res) {
                wx.navigateTo({
                  url: '../OrderDetails/OrderDetails?TypeValueID=' + BillID,
                })
              },
              fail: function (res) {
                wx.navigateTo({
                  url: '../OrderDetails/OrderDetails?TypeValueID=' + BillID,
                })
              }
            })
          } else {
            util.throwMsg(res.data.ErrorMessage);
          }


        }else{
          wx.navigateTo({
            url: '../OrderDetails/OrderDetails?TypeValueID=' + BillID,
          })
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
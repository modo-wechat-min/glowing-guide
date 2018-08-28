let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
let timer="";
Page({
  data: {
    Status: 0, //短租时候0-全部 1-待入住 2-待点评
    PageIndex: 1, //分页
    height: 0,
    orderLists: [],
    height: 200,
    hidden: false,
    RentType: 0, //0-短租 1-长租
    nodata:false,
  },
  getStatus(e) {
    this.setData({
      Status: e.currentTarget.dataset.status,
      PageIndex: 1,
    })
    this.getLists();
  },
  onLoad: function(options) {
    console.log(111)
    if (!util.checkIsLogin()) { 
      return false;
    }
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,  
    });
  },
  getRentType(e) {
    console.log(e)
    this.setData({
      RentType: e.currentTarget.dataset.type,
      PageIndex:1,
    });
    this.getLists(); 
  },
  deleteOrder(e) {
    let _this=this;
    wx.showModal({
      title: '提示',
      content: '确定删除订单吗',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ports.modoHttp + "API/WeChatMiniProgram/DeleteBill?billId=" + e.currentTarget.dataset.id,
            method: 'get',
            success: function(res) {
              console.log(res)
              if (res.data.state == 1) {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 2000
                })
                _this.getLists();
              } else {
                throwMsg(res.data.ErrorMessage);
              }
            },
          })
        } else {
          return;
        }

      }
    })
  },
  getLists(isMore) {
    this.setData({
      hidden: false,
    })
    let _this = this;
    let UserID = util.getStorage("userID");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetMyBill?UserID=" + UserID + "&RentType=" + _this.data.RentType + "&PageIndex=" + _this.data.PageIndex + "&Status=" + _this.data.Status,
      method: 'get',
      success: function(res) {
        console.log(res.data);
        let array;
        if (isMore){//判断是否追加数据
          array = _this.data.orderLists.concat(res.data);
        }else{
          array = res.data;
        }
        _this.setData({
          orderLists: array,
          hidden: true,
          nodata: true,
        })
      },
    })
  },
  lower: function(e) {
    //延迟300毫秒防止多次触发，防抖动 
    let time = 300;
    let _this = this;
    clearTimeout(timer);
    let timer=setTimeout(function() {
      //增加分页
      _this.setData({
        PageIndex: _this.data.PageIndex+1,
      })
      _this.getLists(true);
    }, time)
    console.log(e)
  }, 
  onShow(){
    if (!util.checkRight()) {
      return;
    }
    if (!util.checkIsLogin()) {
      return;
    }
    this.setData({
      PageIndex: 1,
    });
    this.getLists();
  }
})
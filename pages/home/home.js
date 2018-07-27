
let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    branchName:"",
    branchId: "",
    branchLists:[],
    imgUrl: ports.modoImgHttp,
    homeImageUrl: ports.imgUrl +'home_1.jpg',
    startTime:"",
    endTime:"",
    days:1,
    itemLists:["会员福利","优惠活动","个人中心"],
    imgUrls: [
      ports.imgUrl +'img_1.png',
      ports.imgUrl + 'img_2.png',
      ports.imgUrl + 'img_3.png'
    ],//輪播圖配置
    swiperCurrent:0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  swiperChange:function(e){
    var that = this;
    that.setData({
      swiperCurrent: e.detail.current, //获取当前轮播图片的下标
    })
  },
  changeSwiperIndex:function(index){
    that.setData({
      swiperCurrent: e.detail.current, //获取当前轮播图片的下标
    })
  },
 
  onLoad: function () {
    this.setData({
      startTime: util.initTime(0), 
      endTime: util.initTime(1)
    })
    
    this.getBranchLists(ports.modoHttp +"API/WeChatMiniProgram/GetBranchList");
  },
  toGetDate: function () {        // 获取日期
    var _this=this;
    wx.navigateTo({
      url: '../date/date?startTime=' + _this.data.startTime + '&endTime=' + _this.data.endTime, 
    })
  },
  swiperPageSwith(e){
    let index=e.currentTarget.dataset.index;
    if (index == 0){
      this.toPage("BuyMembershipCard")
    }
    if (index == 1) {
      this.toPage("PreferentialActivities")
    };
    if (index == 2) {
      this.toPage("personal")
    };
  },
  goBranches(){
    this.toPage("branches");
  },
  // 去优惠活动页面
  toPage: function (page) {
    if (page =="personal"){
      wx.switchTab({
        url: '../' + page + '/' + page,
      });
    }else{
      wx.navigateTo({
        url: '../' + page + '/' + page,
      })
    }
  },
  getBranchLists(url){
    let _this = this;
    wx.request({
      url: url,
      method: 'get',
      data:{
        StartDate:456,
        EndDate:79,
      },
      success: function (res) {
        _this.setData({
          branchLists: res.data, 
        })
      },
    })
  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: '4000-777-365'
    })
  },
  serch(){
    wx.navigateTo({
      url: '../BranchDetails/BranchDetails?BranchID=' + this.data.branchId + '&StartDate=' + this.data.startTime + '&EndDate=' + this.data.endTime + '&days=' + this.data.days,
    })
  }

})
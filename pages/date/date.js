let util = require('../../utils/util.js');
let YearParamArray = [];
let MonthParamAraay = [];
let LastDayParamArray = [];
let FirstDayParamArray = [];
Page({
  data: {
    sysW: null,
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    MonthArr: [[], [], [], [], [], []],
    MonthNumber: [],
    YearNumber: [],
    LastDay: [],
    FirstDay: [],
    getStart: "",
    getEnd: "",
    getDate: "",
    flag: 2,//1表示只有开始，2表示开始和结束都有
    choseMonth1: "",
    choseMonth2: "",
    indexStart: "",
    indexEnd: "",
    startTime: "",
    endTime: "",
    isFresh:false,
  },
  //获取日历相关参数
  dataTime: function (index, time) {
    var date = time;
    //防止时间溢出
    var virtualYear = date.getFullYear();
    var virtualMonth = date.getMonth();
    var virtualTime = new Date(virtualYear, virtualMonth, 1);
    virtualTime.setMonth(virtualTime.getMonth() + index );
    var year = virtualTime.getFullYear();
    var month = virtualTime.getMonth();
    var months = virtualTime.getMonth() + 1;
    //最后一天是几号
    var d = new Date(year, months, 0);
    var lastDay = d.getDate();
    //第一天星期几
    let firstDay1 = new Date(year, month, 1);
    if (index==0){
      this.setData({
        firstArrayDay: firstDay1,
      }); 
    }
    var firstMonthDay = firstDay1.getDay();
    YearParamArray[index] = year;
    MonthParamAraay[index] = months;
    LastDayParamArray[index] = lastDay;
    FirstDayParamArray[index] = firstMonthDay;
  },
  onLoad: function (options) {
    var time = new Date();
    var dateTime = time.getDate();

    // 判断是否在本日凌晨六点前,整体时间前移一天
    (function(){
      if (time.getTime() < new Date(time.getFullYear(), time.getMonth(), dateTime,6)){
        time.setDate(time.getDate() - 1);
        dateTime = time.getDate();
      }
    })(); 

    
    for (var k = 0; k < 6; k++) {
      this.dataTime(k, time); 
    }
    var count = 0;
    var arrayReal=[];
    for (var k = 0; k < 6; k++) {
      var array = [];
      for (var i = 1; i < LastDayParamArray[k] + 1; i++) {
        var date = {};
        date.day = i;
        date.index = count;
        array.push(date);
        count++;
      }
      arrayReal[k] = array;
    }
    //获取父级页面传参
    let isFresh = options.isFresh? options.isFresh:false;
    let fatherStartTime = options.startTime;
    let fatherEndTime = options.endTime;
    let fatherStartTimeStr = new Date(util.getDayString(fatherStartTime));
    let fatherEndTimeStr = new Date(util.getDayString(fatherEndTime));
    let fatherMonth1 = fatherStartTimeStr.getMonth() + 1;
    let fatherMonth2 = fatherEndTimeStr.getMonth() + 1;
    let fatherday1 = fatherStartTimeStr.getDate();
    let fatherday2 = fatherEndTimeStr.getDate();
    let fatherStartIndex = (fatherStartTimeStr - this.data.firstArrayDay) / 1000 / 60 / 60 / 24;
    let fatherEndIndex = (fatherEndTimeStr - this.data.firstArrayDay) / 1000 / 60 / 60 / 24;
    var res = wx.getSystemInfoSync();
    this.setData({
      isFresh: isFresh,
      YearNumber: YearParamArray,
      MonthNumber: MonthParamAraay,
      LastDay: LastDayParamArray,
      FirstDay: FirstDayParamArray,
      choseMonth1: fatherMonth1,
      choseMonth2: fatherMonth2,
      getStart: fatherday1,
      getEnd: fatherday2,
      indexStart: fatherStartIndex,
      indexEnd: fatherEndIndex,
      sysW: res.windowHeight / 14,
      MonthArr: arrayReal,
      getDate: dateTime,
    });
  },
  getDateFun(e) {
    let year = e.currentTarget.dataset.year;
    let month = e.currentTarget.dataset.month;
    let date = e.currentTarget.dataset.date;
    let realmonth = util.formatNumber(month);
    let realdate = util.formatNumber(date);
    let index = e.currentTarget.dataset.index;
    if (month == this.data.MonthNumber[0] && date < this.data.getDate) {
      return false;
    }
    if (this.data.flag == 2) {
      this.setData({
        getStart: date,
        indexStart: index,
        indexEnd: 0,
        choseMonth1: month,
        getEnd: "",
        flag: 1,
        startTime: year + "年" + realmonth + "月" + realdate + "日",
        endTime: "",
      })
    } else {
      if (index < this.data.indexStart) {
        this.setData({
          indexEnd: this.data.indexStart,
          indexStart: index,
          getEnd: date,
          choseMonth2: month,
          flag: 2,
          endTime: this.data.startTime,
          startTime: year + "年" + realmonth + "月" + realdate + "日",
        })
        this.pageBack()
      } else {
        this.setData({
          getEnd: date,
          indexEnd: index,
          choseMonth2: month,
          flag: 2,
          endTime: year + "年" + realmonth + "月" + realdate + "日",
        })
        this.pageBack()
      }
    }
  },
  pageBack(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一级页面
    var days = (new Date(util.getDayString(this.data.endTime)) - new Date(util.getDayString(this.data.startTime)) )/1000/60/60/24;
    prevPage.setData({
      'startTime': this.data.startTime,
      "endTime": this.data.endTime,
      "days": days,
      'isFresh': this.data.isFresh,
    });
    wx.navigateBack({ changed: true });
  },
})
let util = require('../../utils/util.js');
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
  },

  //获取日历相关参数
  dataTime: function (index) {
    var date = new Date();
    date.setMonth(date.getMonth() + index);
    var year = date.getFullYear();
    var month = date.getMonth();
    var months = date.getMonth() + 1;
    var YearParam = "YearNumber[" + index + "]";
    var MonthParam = "MonthNumber[" + index + "]";
    var LastDayParam = "LastDay[" + index + "]";
    var FirstDayParam = "FirstDay[" + index + "]";
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
    this.setData({
      [YearParam]: year,
      [MonthParam]: months,
      [LastDayParam]: lastDay,
      [FirstDayParam]: firstMonthDay,
    });
  },
  onLoad: function (options) {
    

    var time = new Date();
    var dateTime = time.getDate();
    this.setData({
      getDate: dateTime,
      
    });

    for (var k = 0; k < 6; k++) {
      this.dataTime(k);
    }
    var count = 0;
    for (var k = 0; k < 6; k++) {
      var array = [];
      for (var i = 1; i < this.data.LastDay[k] + 1; i++) {
        var date = {};
        date.day = i;
        date.index = count;
        array.push(date);
        count++;
      }
      var MonthArrParam = "MonthArr[" + k + "]";
      this.setData({
        [MonthArrParam]: array,
      })
    }
    //获取父级页面传参
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
      choseMonth1: fatherMonth1,
      choseMonth2: fatherMonth2,
      getStart: fatherday1,
      getEnd: fatherday2,
      indexStart: fatherStartIndex,
      indexEnd: fatherEndIndex,
      sysW: res.windowHeight / 14,
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
    });
    wx.navigateBack({ changed: true });
  },
  
})
let ports = require('./ports.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const initTime = (day) => {
  let time = new Date();
  time.setDate(time.getDate() + day);
  let year = time.getFullYear();
  let month = formatNumber(time.getMonth() + 1);
  let date = formatNumber(time.getDate());
  return year + "年" + month + "月" + date + "日";
}
const getDayString = time => {
  let timestr = time.replace('日', '').replace('月', '/').replace('年', '/');
  console.log(timestr)
  return timestr;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function initMonth(){
  let date=new Date();
  console.log(666)
  console.log(date.getFullYear() + "-" + date.getMonth() + 1)
  return date.getFullYear() + "-" + formatNumber((date.getMonth()+1));
}
var Promise = require('./es6-promise.min.js');
// 获取用户信息
function getOpenId() {
  var openId = getStorage("openId", false);
  return new Promise((resolve, reject) => {
    if (openId) {
      resolve();
    } else {
      wx.login({
        success: function(res) {
          if (res.code) {
            //发起网络请求,后期看需要promise化不？
            wx.request({
              url: ports.modoHttp + "API/WeChatMiniProgram/GetOpenID?code=" + res.code,
              success: function(res) {
                setStorage('openId', JSON.parse(res.data).openid, false);
              }
            });
          } else {
            wx.showToast({
              title: '获取用户登录态失败！' + res.errMsg,
              duration: 2000
            });
          }
        }
      });


    }
  });
}

/* store封装 */
function setStorage(key, value, isSync = true) {
  if (isSync) {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {
      wx.showToast({
        title: e,
        duration: 2000
      });
    }
  } else {
    wx.setStorage({
      key: key,
      data: value
    });
  }
}

function getStorage(key, isSync = true) {
  if (isSync) {
    try {
      var value = wx.getStorageSync(key);
      if (value) {
        return value;
      }
    } catch (e) {
      wx.showToast({
        title: e,
        duration: 2000
      });
    }
  } else {
    wx.getStorage({
      key: key,
      success: function(res) {
        return res.data;
      },
      fail: function() {
        return '';
      }
    });
  }
}

function removeStorage(key, isSync = true) {
  if (isSync) {
    try {
      wx.removeStorageSync(key);
    } catch (e) {
      wx.showToast({
        title: e,
        duration: 2000
      });
    }
  } else {
    wx.removeStorage({
      key: key,
      success: function(res) {
        console.log(res.data)
      }
    });
  }
}

function throwMsg(msg) {
  wx.showToast({
    title: msg,
    icon: "none",
  })
}
//删除订单
function deleteOrder(TypeValueID) {
  wx.showModal({
    title: '提示',
    content: '确定删除订单吗',
    success: function(res) {
      if (res.confirm) {
        wx.request({
          url: ports.modoHttp + "API/WeChatMiniProgram/DeleteBill?billId=" + TypeValueID,
          method: 'get',
          success: function(res) {
            console.log(res)
            if (res.data.state == 1) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
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
}
//联系获取
function getContractsLists(obj) {
  let _this = obj;
  let UserID = getStorage("userID");
  wx.request({
    url: ports.modoHttp + "API/WeChatMiniProgram/GetContact?UserID=" + 312456,
    method: 'get',
    success: function(res) {
      _this.setData({
        listsObj: res.data,
        hidden: true,
        nodata: true,
      })
    },
  })
}
//获取当前页面
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url.slice(5);
}

function checkIsLogin() {
  let UserID = getStorage("userID");
  if (!UserID) {
    let url = getCurrentPageUrl();
    wx.navigateTo({
      url: '../login/login?url=' + url,
    })
    return false;
  } else {
    return true;
  }
}
//是否授权
function checkRight() {
  let app=getApp();
  if (!app.globalData.userInfo) {
    let url = getCurrentPageUrl();
    wx.navigateTo({
      url: '../authorization/authorization?url=' + url,
    })
    return false;
  } else {
    return true;
  }
}

function getUserInfoFun(obj) {
  let app = getApp();
  if (app.globalData.userInfo) {
    obj.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  } else if (obj.data.canIUse) {
    app.userInfoReadyCallback = res => {
      obj.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
  }
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  initTime: initTime,
  getDayString: getDayString,
  initMonth: initMonth,
  setStorage: setStorage,
  getStorage: getStorage,
  removeStorage: removeStorage,
  getOpenId: getOpenId,
  throwMsg: throwMsg,
  deleteOrder: deleteOrder,
  getContractsLists: getContractsLists,
  getCurrentPageUrl: getCurrentPageUrl,
  checkIsLogin: checkIsLogin,
  checkRight: checkRight,
  getUserInfoFun: getUserInfoFun,
}
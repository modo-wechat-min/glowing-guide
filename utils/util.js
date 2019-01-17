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
const initTime = (day,type) => {
  let time = new Date();
  time.setDate(time.getDate() + day);
  let year = time.getFullYear();
  let month = formatNumber(time.getMonth() + 1);
  let date = formatNumber(time.getDate());
  if (type==1){
    return year + "-" + month + "-" + date ;
  }else{
    return year + "年" + month + "月" + date + "日";
  }
  
}
const getDayString = time => {
  let timestr = time.replace('日', '').replace('月', '/').replace('年', '/');
  return timestr;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function initMonth() {
  let date = new Date();
  return date.getFullYear() + "-" + formatNumber((date.getMonth() + 1));
}
var Promise = require('./es6-promise.min.js');
// 获取用户信息
function getOpenId(fn) {
  var openId = getStorage("openId"); 
  if (openId){
    if (fn){
      fn()
    }
    return;
  }else{
    wx.login({
      success: function (res) { 
        if (res.code) {
          wx.request({
            url: ports.modoHttp + "API/WeChatMiniProgram/GetOpenID?code=" + res.code, 
            success: function (res) {
              console.log(res);
              let data = res.data;
              setStorage('openId', data.OpenID);
              setStorage('userID', data.UserID);
              if (!data.OpenID){
                wx.showToast({
                  title: '发生错误',
                  duration: 2000,
                  icon: "none", 
                });
                return;
              }
              if (fn) {
                fn()
              }
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
}

function _getUserInfoFn(callBack, cBack) { 
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            // this.globalData.userInfo = res.userInfo;   
            // console.log(res);
            callBack(res, cBack);
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            // if (this.userInfoReadyCallback) {
            //   this.userInfoReadyCallback(res) 
            // }
          }
        })
      }
    }
  })
}

function _getOpenId(user, cBack){
  var openId = getStorage("openId");
  var uniqueId = getStorage("uniqueId");    
  if (openId && uniqueId) {
    return;
  } else {
    wx.login({
      success: function (res) {
        if (res.code) {
          var url = ports.modoHttp + "API/WeChatMiniProgram/GetOpenID?code=" + res.code + "&encryptedData=" + user.encryptedData + "&iv=" + user.iv;
          console.log(url) 
          wx.request({
            url: url,
            success: function (res) {
              console.log(url)
              let data = res.data;
              console.log(data);
              setStorage('openId', data.OpenID);
              setStorage('uniqueId', data.UnionID);
              setStorage('userID', data.UserID);
              if (!data.OpenID) {
                wx.showToast({
                  title: '发生错误',
                  duration: 2000,
                  icon: "none",
                });
                return;
              }
              if (cBack){
                cBack();
              }
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
}


function getUniqueIdAndOpenId(cBack){
  _getUserInfoFn(_getOpenId,cBack);
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
function deleteOrder(TypeValueID,back) {
  wx.showModal({
    title: '提示',
    content: '确定删除订单吗',
    success: function(res) {
      if (res.confirm) {
        wx.request({
          url: ports.modoHttp + "API/WeChatMiniProgram/DeleteBill?billId=" + TypeValueID,
          method: 'get',
          success: function(res) {
            if (res.data.state == 1) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              if (back){
                setTimeout(function () {
                  wx.navigateBack({
                    changed: true
                  });
                }, 2000)
              }
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
    url: ports.modoHttp + "API/WeChatMiniProgram/GetContact?UserID=" + UserID,
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

function checkIsLogin(params) {
  let UserID = getStorage("userID");
  if (!UserID || UserID==0) {
    let url = getCurrentPageUrl();
    wx.navigateTo({
      url: '../login/login?url=' + url + "&params=" + params,
    })
    return false;
  } else {
    return true;
  }
}
//是否授权
function checkRight(fn) {
  let app = getApp();
  wx.getSetting({
    success(res) {
      //未授权情况
      if (!res.authSetting['scope.userInfo']) {

        
        let url = getCurrentPageUrl();
        wx.navigateTo({
          url: '../authorization/authorization?url=' + url,
        })
      } else {
        //已经授权
        if (fn){
          fn();
        }
      }
    }
  })
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
function openContract(url){
  wx.showModal({
    title: '正在加载该文件',
    content: '文件较大，请耐心等待',
    showCancel: false,
  })
  wx.downloadFile({
    url: url,
    success: function (res) {
      let tempFilePath = res.tempFilePath;
      wx.openDocument({
        filePath: tempFilePath,
        success: function (res) {
        }
      })
    }
  })
}
function illegalFn() {
  util.throwMsg("非法请求");
  util.setStorage('userID', "", false);
  return;
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
  getUniqueIdAndOpenId: getUniqueIdAndOpenId,
  throwMsg: throwMsg,
  deleteOrder: deleteOrder,
  getContractsLists: getContractsLists,
  getCurrentPageUrl: getCurrentPageUrl,
  checkIsLogin: checkIsLogin,
  checkRight: checkRight,
  getUserInfoFun: getUserInfoFun,
  openContract: openContract,
}
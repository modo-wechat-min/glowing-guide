let ports = require('./utils/ports.js');
let util = require('./utils/util.js');
App({
  globalData: {},
  onLaunch() {
    util.getOpenId(this.getUserInfoFn);
    // this.getUserInfoFn(this.getOpenId); //晨野使用
    this.checkUpdate();
  },

  //获取用户OpenId和uniqueId
  getOpenId(user) {
    var openId = util.getStorage("openId");
    var uniqueId = util.getStorage("uniqueId");
    if (openId && uniqueId) {
      return;
    } else {
      wx.login({
        success: function(res) {
          if (res.code) {
            var url = ports.modoHttp + "API/WeChatMiniProgram/GetOpenID?code=" + res.code + "&rawData=" + user + "&signature=" + user.signature + "&encryptedData=" + user.encryptedData + "&iv=" + user.iv;
            wx.request({
              url:url,
              success: function(res) {
                console.log(url)
                let data = res.data;
                util.setStorage('openId', data.OpenID);
                util.setStorage('uniqueId', data.OpenID);
                util.setStorage('userID', data.UserID);
                if (!data.OpenID) {
                  wx.showToast({
                    title: '发生错误！',
                    duration: 2000, 
                    icon: "none",
                  });
                  return;
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
  },


  getUserInfoFn() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              console.log(res);
              this.getOpenId(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 获取code
  // getUserCodeFn(user) {
  //   wx.login({
  //     success: res=>{
  //       this.postUserInfo(res.code, user)
  //     }
  //   });
  // },


  //提交用户信息
  // postUserInfo(code,user){
  //   // console.log(code,user);
  //   wx.request({
  //     url: ports.modoHttp + "API/WeChatMiniProgram/GetUnionID", 
  //     method: 'post',
  //     data:{
  //       rawData: user.rawData,
  //       signature: user.signature,
  //       encryptedData: user.encryptedData,
  //       iv: user.iv,
  //       code: code,
  //     },
  //     success: res=>{

  //     }
  //   })
  // },



  //检查更新
  checkUpdate() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '发现新版本，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
      util.throwMsg("更新失败");
    })
  }
})
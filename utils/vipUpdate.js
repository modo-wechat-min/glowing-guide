let ports = require('./ports.js');
let util = require('./util.js');
export function updateVip(exchange, buy, UserID, CardID, OpenID) {
  let _this = this;

  if (exchange <= 0 && buy <= 0) {
    util.throwMsg("不满足升级条件");
    return;
  }
  console.log(ports.modoHttp + "api/WeChatMiniProgram/UpgradeMemberShip?UserID=" + UserID + "&CardID=" + CardID)
  if (exchange > 0) {
    wx.showModal({
      title: '提示',
      content: '确定升级会员吗',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ports.modoHttp + "api/WeChatMiniProgram/UpgradeMemberShip?UserID=" + UserID + "&CardID=" + CardID,
            method: 'post',
            header: {
              "Authorization": OpenID,
            },
            success: function(res) {
              console.log(res)
              if (res.data.Code == "SUCCESS") {
                util.throwMsg("升级成功");
                setTimeout(function() {
                  wx.switchTab({
                    url: "../personal/personal",
                    success: function(e) {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onLoad();
                    }
                  })
                }, 2000)
              } else {
                util.throwMsg(res.data.ErrorMessage);
              }
            }
          })
        } 
      }
    })
    return;
  }
  if (buy > 0) {
    wx.showModal({
      title: '提示',
      content: '未满足累计消费，需购买会员',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ports.modoHttp + "api/WeChatMiniProgram/getPayDateForBugMemberShipCard?UserID=" + UserID + "&CardID=" + CardID,
            method: 'get',
            header: {
              "Authorization": OpenID,
            },
            success: function(res) {
              if (res.data.Code == "SUCCESS") {
                let PayMessage = res.data.PayMessage; 
                wx.requestPayment({
                  timeStamp: PayMessage.timeStamp,
                  nonceStr: PayMessage.nonceStr,
                  package: PayMessage.package,
                  signType: PayMessage.signType,
                  paySign: PayMessage.paySign,
                  success: function(res) {
                    util.throwMsg("购买成功");
                    setTimeout(function() {
                      wx.switchTab({
                        url: "../personal/personal",
                        success: function(e) {
                          var page = getCurrentPages().pop();
                          if (page == undefined || page == null) return;
                          page.onLoad();
                        }
                      })
                    }, 2000)
                  },
                  
                })
              } else {
                util.throwMsg(res.data.ErrorMessage);
              }
            }
          })
        } else {
          return;
        }
      }
    })
  }

}
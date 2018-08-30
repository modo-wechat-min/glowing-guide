let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    listsObj: null,
    hidden: false,
    nodata: false,
  },
  onShow: function(options) {
    util.getContractsLists(this);
  },
  deletePerson(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let openId = util.getStorage("openId");
    let UserID = util.getStorage("userID");
    wx.showModal({
      title: '提示',
      content: '确定删除该联系人吗',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ports.modoHttp + "API/WeChatMiniProgram/DeleteContact",
            method: 'post',
            data: {
              ContactID: id,
              UserID: UserID,
              OpenID: openId,
            },
            success: function(res) {
              if (res.data.Code == "SUCCESS") {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 2000
                })
                util.getContractsLists(_this);
              } else {
                util.throwMsg(res.data.ErrorMessage);
              }
            },
          })
        }
      }
    })
  }
})
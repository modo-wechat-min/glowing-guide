let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data: {
    timer: '',
    height:"",
    activityObj:"",
    isVip:"",
    imgUrl: ports.imgUrl,
  },

  onLoad: function (options) {
    this.getData();
    this.checkUserIsMember();
    var systemInfo = wx.getSystemInfoSync();
    
    var scale = systemInfo.windowWidth/750;
    console.log(systemInfo.windowHeight)
    var height = systemInfo.windowHeight / scale-322;
    this.setData({
      height: height,
      scale: scale,
    })
    
  },
  circleFun(){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    let scale = that.data.scale;
    // 以下两个是测试数据
    let totalItems = 100;
    console.log(this.data.activityObj.ResidualQuantity)
    let rightItems = this.data.activityObj.ResidualQuantity;
    let completePercent = parseInt((rightItems / totalItems) * 100);
    that.showScoreAnimation(rightItems, totalItems, scale);
  },
  showScoreAnimation: function (rightItems, totalItems, scale) {
    /*
    cxt_arc.arc(x, y, r, sAngle, eAngle, counterclockwise);
    x	                    Number	  圆的x坐标
    y	                    Number	  圆的y坐标
    r	                    Number	  圆的半径
    sAngle	            Number	  起始弧度，单位弧度（在3点钟方向）
    eAngle	            Number	  终止弧度
    counterclockwise	    Boolean	  可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
    */
    console.log(scale)
    let that = this;
    let copyRightItems = 0;
    that.setData({
      timer: setInterval(function () {
        copyRightItems++;
        if (copyRightItems == rightItems) {
          clearInterval(that.data.timer)
        } else {
          // 页面渲染完成
          // 这部分是灰色底层
          let cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
          cxt_arc.setLineWidth(1);//绘线的宽度
          cxt_arc.setStrokeStyle('rgba(0,0,0,0)');//绘线的颜色
          cxt_arc.setLineCap('round');//线条端点样式
          cxt_arc.beginPath();//开始一个新的路径
          cxt_arc.arc(133 * scale, 133 * scale, 130 * scale, 0, 2 * Math.PI, false);//设置一个原点(53,53)，半径为50的圆的路径到当前路径
          cxt_arc.stroke();//对当前路径进行描边
          //这部分是蓝色部分
          cxt_arc.setLineWidth(1);
          cxt_arc.setStrokeStyle('#ff6644');
          cxt_arc.setLineCap('round')
          cxt_arc.beginPath();//开始一个新的路径
          cxt_arc.arc(133 * scale, 133 * scale, 130 * scale, -Math.PI * 1 / 2, 2 * Math.PI * (copyRightItems / totalItems) - Math.PI * 1 / 2, false);
          cxt_arc.stroke();//对当前路径进行描边
          cxt_arc.draw();
        }
      }, 20)
    })
  },
  checkUserIsMember() {
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/CheckUserIsMember?UserID=" + UserID,
      method: 'get',
      header: {
        "Authorization": OpenID,
      },
      success: function (res) {
        _this.setData({
          isVip: res.data,
        });
        if (res.data) {
          wx.setNavigationBarTitle({
            title: "VIP会员",//页面标题为路由参数
          })
        }
      },
      complete: function (res) {
        if (res.statusCode === 401) {
          util.throwMsg("非法请求");
          util.setStorage('userID', "", false);
          return;
        }
      }
    })
  },
  getData(){
    let _this = this;
    let UserID = util.getStorage("userID");
    let OpenID = util.getStorage("openId");
    wx.request({
      url: ports.modoHttp + "API/WeChatMiniProgram/GetActiveDetail?ActiveID=" + 1,
      method: 'get',
      header: {
        "Authorization": OpenID,
      },
      success: function (res) {
        console.log(res)
        _this.setData({
          activityObj: res.data,
        });
        _this.circleFun();
      },
      
    })
  }
  
})
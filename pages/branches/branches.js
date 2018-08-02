let ports = require('../../utils/ports.js');
let util = require('../../utils/util.js');
Page({
  data:{
    lists:[],
    history:"",
  },
  onLoad(){
    wx.setNavigationBarTitle({
      title: '摩兜分店'
    })
    this.getBranchLists();
    //历史记录
    if (util.getStorage("branches")){
      this.setData({
        history: util.getStorage("branches"),
      })
    }
    
  },
  getBranchLists() {
    let _this=this;
    wx.request({
      url: ports.modoHttp +"/API/WeChatMiniProgram/GetSearchBranch",
      method: 'get',
      success: function (res) {
        console.log(res)
        _this.setData({
          lists: res.data, //获取当前轮播图片的下标
        })
      },
    })
  },
  choseBranch(e){
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let obj={};
    let branchList = []
    if (util.getStorage("branches")){
      branchList = util.getStorage("branches")
    }
    let branchListLenght = branchList.length;
    obj.ID = id;
    obj.BranchName = name;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页面
    branchList.unshift(obj);
    prevPage.setData({
      'branchName': name,
      "branchId": id,
    });
    if (branchListLenght>4){
      branchList.pop();
    }
    console.log(branchList)
    util.setStorage("branches", branchList);
    this.setData({
      history: branchList,
    })
    wx.navigateBack({ changed: true });
  },
  clearBranch(){
    util.removeStorage("branches");
    this.setData({
      history: [],
    })
  },
  phone(){
    wx.makePhoneCall({
      phoneNumber: '4000-777-365' 
    })
  }
})
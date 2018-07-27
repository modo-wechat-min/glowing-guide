
Page({
  data: {
    numArray:[1,2,3],
    choseNum:1,
    showNumBox:false,
    chose1:true,
  },
  getNum(e){
    this.setData({
      choseNum: e.currentTarget.dataset.item, 
      showNumBox:false,
    })
  },
  showNumBoxFun(){
    this.setData({
      showNumBox: true,
    })
  },
  closeBox(){
    this.setData({
      showNumBox: false,
    })
  },
  switchchose1(){
    this.setData({
      chose1: !this.data.chose1,
    })
  }
})
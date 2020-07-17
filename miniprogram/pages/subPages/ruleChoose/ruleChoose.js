const app = getApp()
const db = wx.cloud.database()
const _ =db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    ruleQuiz: "规则测验",
    leaderboard: "查看排行",
    current: 'ruleChoose',
    selected: 1,
    color: "rgba(200, 200, 200)",
    selectedColor: "#d02222",
    list: [{
      pagePath: "/pages/mainPage/main",
      icon: "home-o",
      text: "首页"
    }, {
      pagePath: "/pages/ruleChoose/ruleChoose",
      icon: "search",
      text: "查看排行"
    }, {
      pagePath: "/pages/",
      icon: "setting-o",
      text: "设置"
    }]
  },
  //   switchTab(e) {
  //     const data = e.currentTarget.dataset
  //     const url = data.path
  //     wx.switchTab({url})
  //     this.setData({
  //       selected: data.index
  //     })
  //   }
  // ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  async function (options) {
    this.setData({
      id:app.globalData.openid,
    })
    console.log(this.data.id)
    let name = await db.collection("rank").where({
      _openid: app.globalData.openid
    }).get()
    console.log(name)
    if(name.data.length>0){
      this.setData({
        username:name.data[0].name
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.printRank()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  onChange(event) {
    this.setData({ active: event.detail });
    console.log(event.detail)
  },

  openPdf: function(event){
    console.log(this.data.path)
    console.log(event.target.id)
    this.showBusy()
    wx.downloadFile({
      url: this.data.path[event.target.id] ,
      success: function (res) {
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log('打开文档成功')
            wx.hideLoading({
              complete: (res) => {},
            })
          }
        })
        console.log(res.tempFilePath)
       
      },            
      fail:function (res){
        console.log("failToDownload")
        wx.hideLoading({
          complete: (res) => {},
        })
        this.showError()
      }
    })
  },

  showBusy: function () {
    wx.showLoading({
    title: '加载中...',
    mask: true,
    icon: 'loading',
    
    })
    },
  
  showError:function(){
    wx.showToast({
      title: '请检查网络链接并重试',
      icon:"none",
      duration: 2000
    })
  },

  async printRank(){
    this.setData({
      showView: true
    })
   
    let that = this
    let all = await db.collection('rank').get()
    console.log(all)
    all = all.data.sort(function(a,b){
      var value1 = a.score,
          value2 = b.score;
      if(value1 === value2){
          return a.time - b.time;
      }
      return value2 - value1;
  })
    console.log(all)
    this.setData({
      rank:all,
      disable:true,
      disInput:true

    })
  }


})
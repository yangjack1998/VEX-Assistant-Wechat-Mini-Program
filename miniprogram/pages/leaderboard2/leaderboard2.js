// pages/leaderboard/leaderboard.js
const app = getApp()
const db = wx.cloud.database()
const _ =db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
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
  onReady:  function () {
    this.printRank()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  },



  
})
// pages/leaderboard/leaderboard.js
const app = getApp()
const db = wx.cloud.database()
const _ =db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    inputValue:"",
    disable:true,
    disInput:false,
    old:false,
    id:"",
    rank:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options.query)
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
      that.setData({
        score:data.data
      })
    })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    this.onGetOpenid()
    let old = await db.collection("rank").where({
      _openid:app.globalData.openid
    }).get()
    console.log(old)
    if(old.data.length>0){
      this.setData({
        inputValue:old.data[0].name,
        disInput:true,
        disable:false,
        old:true,
        id:old.data[0]._id
      })
    }
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

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  bindKeyInput: function (e) {
    let input = this.data.inputValue
    this.setData({
      inputValue: e.detail.value
    })
    if(input.length>0){
      this.setData({
        disable:false
      })
    } 
      else{
        this.setData({
          disable:true
        })

      }
  },

  submit : async function (e){
    let that = this
    if(!this.data.old){
      db.collection('rank')
        .add({
          data:
            {
            name:that.data.inputValue,
            score:that.data.score
          }
        
        })
    } else{
      db.collection('rank').doc(this.data.id).update({
        data:{
          score:that.data.score
        }
      })
    }
    this.printRank()
  },


  async printRank(){
    this.setData({
      showView: true
    })
    let that = this
    let all = await db.collection('rank').get()
    all = all.data.sort((a, b) => (a.score > b.score) ? 1 : -1)
    this.setData({
      rank:all
    })
  }
})
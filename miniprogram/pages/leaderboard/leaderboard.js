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
    id:'',
    recordID:"",
    rank:[],
    time:0,
    timeShow:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      score:app.globalData.score,
      id:app.globalData.openid,
      time:app.globalData.time,
      timeShow:app.globalData.timeShow,
    })
    //let that = this
    // console.log(options.query)
    // const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function(data) {
    //   console.log(data)
    //   that.setData({
    //     score:data.data,
    //     time:data.time
    //   })
    // })
    this.checkOld()


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:  function () {
   
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

  submit :async function (e){
    let that = this
    if(!this.data.old){
      await db.collection('rank')
        .add({
          data:
            {
            name:that.data.inputValue,
            score:that.data.score,
            time:that.data.time,
            timeShow:that.data.timeShow
          },
          success:function(res) {
            that.printRank()
          }
        
        })
    } else{
      console.log("update: "+this.data.id)
      let oldScore = await (await db.collection('rank').doc(this.data.recordID).get()).data.score
      let oldTime = await (await db.collection('rank').doc(this.data.recordID).get()).data.time
      console.log("oldScore: "+oldScore)
      if(this.data.score>oldScore||(this.data.score==oldScore&&this.data.time<oldTime)){
        await db.collection('rank').doc(this.data.recordID).update({
          data:{
            score:that.data.score,
            time:that.data.time,
            timeShow:that.data.timeShow
          },
          success: function(res) {
            console.log(res.data)
            that.printRank()
          },
          fail: function(res){
            console.log("fail")
          }

        })
      }  else{
        this.printRank()
      }
    }
    //this.printRank()
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

  checkOld: async function () {
    console.log("tt"+this.data.id)
    let old = await db.collection("rank").where({
      _openid: this.data.id
    }).get()
    
  
    if(old.data.length>0){
      this.setData({
        inputValue:old.data[0].name,
        disInput:true,
        disable:false,
        old:true,
        recordID:old.data[0]._id
      })
      this.submit()
    }
  },

  
})
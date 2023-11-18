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
    quote:"",
    disable:true,
    disInput:true,
    old:false,
    id:'',
    recordID:"",
    rank:[],
    time:0,
    timeShow:'',
    af:true,
    chance:4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      score:app.globalData.score,
      id:app.globalData.openid,
      time:app.globalData.time,
      //timeShow:app.globalData.timeShow,

    })
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
    this.setData({
      inputValue: e.detail.value
    })
    let input = this.data.inputValue


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

  bindKeyInput2: function (e) {
    this.setData({
      quote: e.detail.value
  
    })
    let input = this.data.quote


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


  checkInput: async function (){
    const cloudRes = await wx.cloud.callFunction({
     config:{ env:'vex-assistant-1gwxsfv3ad6fda91'},
      name: 'checkString',
      data: {
        content:this.data.inputValue+this.data.quote
      }
      })
      //console.log(this.data.inputValue)
      //console.log(cloudRes)
      if(cloudRes.result.errCode == 87014){
        wx.showToast({
          title:'内容含有违法违规内容',
          icon:'none',
          duration:2000
        })
        this.setData({
          inputValue:''
        })
        return true
      } 
      return false
  },

  submit :async function (e){
    let checkInput = await this.checkInput()
    if(checkInput) return
    let that = this
    let old = await db.collection("rank_overunder").where({
      name: this.data.inputValue
    }).get()

    if(!this.data.old){
      if(old.data.length>0){
        wx.showToast({
          title: '该昵称已被他人使用,请重新输入昵称',
          icon:"none",
          duration: 2000
        })
        this.setData({
          inputValue:''
        })
        return
      }
      await db.collection('rank_overunder')
        .add({
          data:
            {
            name:that.data.inputValue,
            score:that.data.score,
            time:that.data.time,
            quote:that.data.quote,
            //timeShow:that.data.timeShow,
            chance:4
          },
          success:function(res) {
            wx.redirectTo({
              url: '../main/index'})
          }
        
        })
    } else if (this.data.old && old.data[0].chance <= 0) {
        await db.collection('rank_overunder').doc(this.data.recordID).update({
          data: {
            chance: that.data.chance
          }
        });
      
        setTimeout(function() {
          wx.redirectTo({
            url: '../main/index'
          });
        }, 3500);
      } else {
        let oldScore = await (await db.collection('rank_overunder').doc(this.data.recordID).get()).data.score;
        let oldTime = await (await db.collection('rank_overunder').doc(this.data.recordID).get()).data.time;
      
        await db.collection('rank_overunder').doc(this.data.recordID).update({
          data: {
            chance: that.data.chance
          }
        });
      
        if (this.data.score > oldScore || (this.data.score == oldScore && this.data.time < oldTime)) {
          await db.collection('rank_overunder').doc(this.data.recordID).update({
            data: {
              score: that.data.score,
              time: that.data.time,
              //timeShow: that.data.timeShow,
            },
            success: function(res) {
              setTimeout(function() {
                wx.redirectTo({
                  url: '../main/index'
                });
              }, 3500);
            },
            fail: function(res) {
              console.log("fail");
            }
          });
        } else {
          setTimeout(function() {
            wx.redirectTo({
              url: '../main/index'
            });
          }, 3500);
        }
      }
      
  },


  async printRank(){
    this.setData({
      username:this.data.inputValue
    })
    this.setData({
      showView: true
    })
   
    let that = this
    const MAX_LIMIT = 20
    const countResult = await db.collection('rank_overunder').count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 20)
    let all = await (await db.collection('rank_overunder').get()).data
    for (let i = 1; i < batchTimes; i++) {
      const temp = db.collection('rank_overunder').skip(i * MAX_LIMIT).get()
      all=all.concat((await temp).data)
    }
    console.log(all)

    all = all.sort(function(a,b){
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
    let old = await db.collection("rank_overunder").where({
      _openid: this.data.id
    }).get()
    
  
    if(old.data.length>0){
      this.setData({
        inputValue:old.data[0].name,
        quote:old.data[0].quote,
        disInput:true,
        disable:false,
        old:true,
        recordID:old.data[0]._id,
        af:false,
        chance:old.data[0].chance-1<0 ? 0:old.data[0].chance-1,
      },()=>{
        this.submit()
      })
     
    } else{
        this.setData({
            disInput:false,
        })
    }
  },




  
})
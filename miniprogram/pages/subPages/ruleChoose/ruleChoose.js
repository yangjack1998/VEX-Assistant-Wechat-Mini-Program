const app = getApp()
const db = wx.cloud.database()
const _ =db.command
Component({

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
 lifetimes:{
   attached:async function(){
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
      this.printRank()
    }
  },


  methods:{

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
    const MAX_LIMIT = 20
    const countResult = await db.collection('rank').count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 20)
    let all = await (await db.collection('rank').get()).data
    for (let i = 1; i < batchTimes; i++) {
      const temp = db.collection('rank').skip(i * MAX_LIMIT).get()
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
  }
}

})
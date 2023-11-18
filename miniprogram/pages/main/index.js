// pages/main/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: [
      {
        name: "首页",
        iconPath: "home-o",
        selected: true
      },
      {
        name: "规则测验",
        iconPath: "records",
        selected: false
      },
      {
        name: "赛队查询",
        iconPath: "search",
        selected: false
      }
    ],
    activeIndex: 0,  // 选中的tab
    scrollTopArray: [], // 记录每个页面的滚动位置
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.tabbar.forEach((item, index, arr) => {
      this.data.scrollTopArray[index] = 0;
      // item.isFirstLoad = true
    })
    this.onGetOpenid()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateSubPageShowHide(this.data.activeIndex);
    
  },
  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {},

  onChange(event) {
    if (event.detail == this.data.activeIndex) return;
    this.updateSubPageShowHide(event.detail);
    this.setData({
      activeIndex: event.detail,
      pageName: this.data.tabbar[event.detail].name
    })
    // 还原子页面的滚动位置
    wx.pageScrollTo({
      duration: 0,
      scrollTop: this.data.scrollTopArray[event.detail]
    })

    

  },
  // 记录每个子页面的滚动位置
  onPageScroll(e) {
    this.data.scrollTopArray[this.data.activeIndex] = e.scrollTop;
  },
  // 更新组件的show hide 生命周期
  updateSubPageShowHide(currentIndex) {
    this.data.tabbar.forEach(function (value, i) {
      if (i == currentIndex) {
        value.selected = true;
      } else {
        value.selected = false;
      }
    })
    this.setData({
      tabbar: this.data.tabbar,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
        console.log("111")
      } else {
      //来自右上角转发
        this.addChance();
      }
    return {
      title: 'VEX Tipping Point 助手',
      path: '/pages/main/index',
      
    
  }
},

  async addChance(){

    console.log(app.globalData.openid)
    let old = await db.collection("rank_overunder").where({
      _openid: app.globalData.openid
    }).get()
    let recordID = old.data[0]._id
    if(old.data.length>0){
      console.log(old.data[0].chance)
      await db.collection('rank_overunder').doc(recordID).update({
        data:{
          chance:old.data[0].chance+1
        }
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      config:{ env:'vex-assistant-4g9nkr8i0029c7fe'},
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

})
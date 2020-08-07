// pages/ziliao/ziliao.js
const db = wx.cloud.database()
const _ =db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileName:'',
    fileType:'',
    fileDescription:'',
    disable:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  updateType: function (e) {
    this.setData({
      fileType:e.detail.value
    })
  },

  updateDes: function (e) {
    this.setData({
      fileDescription:e.detail.value
    })
  },


  checkEmpty: function (e) {
    this.setData({
      fileName:e.detail.value
    })
    if(e.detail.value!=''){
      this.setData({
        disable:false
      })
    } else{
      this.setData({
        disable:true
      })
    }
  },


  checkInput: async function (){
    const cloudRes = await wx.cloud.callFunction({
      name: 'checkString',
      data: {
        content:this.data.fileName
      }
      })
      console.log(this.data.fileName)
      console.log(cloudRes)
      if(cloudRes.result.errCode == 87014){
        wx.showToast({
          title:'内容含有违法违规内容',
          icon:'none',
          duration:2000
        })
        this.setData({
          fileName:''
        })
        return true
      } 
      return false
  },


  chooseFile:async function(){
    let checkInput = await this.checkInput()
    if(checkInput) return

    let that = this
    wx.choose
    wx.chooseMessageFile({
      count:1,
      type:'file',
      success:function(res){
        wx.showLoading({
          title: '上传中',
        })
        let filePath = res.tempFiles[0].path
        
        const cloudPath = 'ziliao/'+that.data.fileName + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            db.collection('ziliao').add({
                data: 
                  {
                    name: that.data.fileName,
                    type: that.data.fileType,
                    description:that.data.fileDescription,
                    reviewd:false,
                    cloudPath: cloudPath
                  },
                
              })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  }
})
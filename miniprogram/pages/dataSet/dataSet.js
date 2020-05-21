// pages/dataSet/dataSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path:[],
    disable:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.cloud.getTempFileURL({
      fileList:['cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/GameManual-04252020.pdf',
                'cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/VRC Change Up - CN 20200511.pdf',
                'cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/AppendixB.pdf',
                'cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/VRC Change Up AppendixB - CN 20200511.pdf'
              ],
      success:res=>{
        
        res.fileList.forEach(element => {
          console.log(element)
              that.setData({
                path:that.data.path.concat(element.tempFileURL)
              })  
        });
        this.setData({
          disable:false
        })
      },
      fail:function (res){
        console.log(res)
        this.showError()
      }
  }) 
  
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
  }



})
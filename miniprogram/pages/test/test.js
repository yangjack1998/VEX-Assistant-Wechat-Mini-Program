// miniprogram/pages/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      Path:"https://www.baidu.com/"
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

  showPDF: function(){
    wx.cloud.getTempFileURL({
      fileList:['cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/VRC Change Up - CN 20200511.pdf'],
      success:res=>{

        let p = res.fileList[0].tempFileURL
        console.log(p)
        wx.downloadFile({
          url: p,
          success: function (res) {
            console.log(res)
            var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
            wx.openDocument({
              filePath: Path,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
          },
          fail:function (res){
            console.log(res)
          }
        })
      },
      fail:err=>{

      }
    })
  }


})
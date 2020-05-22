// ruleQuiz/ruleQuiz.js
const db = wx.cloud.database()
const _ =db.command
Page({
  
  /**
   * Page initial data
   */
  data: {
    result:"",
    index:0,
    correct:1,
    wrong:1,
    score:0,
    lookResult:0,
    questions:[],
    options:[],
    answers:[],
    pictures:[],
    picPath:"cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/quizPics/1.jpg",
    status:""
  
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    wx.showToast({
      title: '加载中...',
      icon:"loading",
      duration: 2000
    })
    let quiz = await db.collection("quiz")
    .get()

    let quizData = quiz.data
    for (let i = 1; i < quizData.length; i++) {
      const random = Math.floor(Math.random() * (i + 1));
      [quizData[i], quizData[random]] = [quizData[random], quizData[i]];
    }

    console.log(quiz);

    quizData.forEach(element => {
      this.setData({
        questions:this.data.questions.concat(element.question),
        options:this.data.options.concat(element.options),
        answers:this.data.answers.concat(element.answer),
        pictures:this.data.pictures.concat(element.picture)
      })
    });

    this.setData({
      picPath: "cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/quizPics/"+this.data.pictures[this.data.index]+".jpg"
    })
   console.log(this.data.pictures)
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  update(){
    if(this.data.index+1==this.data.questions.length){
      this.end()
    } else{
    this.setData({
      index:this.data.index+1,
    })
    this.setData({
      picPath: "cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/quizPics/"+this.data.pictures[this.data.index]+".jpg"
    })
  }
  },


  choose0(event1) {
    if(this.data.options[this.data.index*4]==this.data.answers[this.data.index]){
      this.setData({
        score:this.data.score+5,
      })
    }
    this.update()
  },

  choose1(event1) {
    if(this.data.options[this.data.index*4+1]==this.data.answers[this.data.index]){
      this.setData({
        score:this.data.score+5,
      })
    }
    this.update()
  },

  choose2(event1) {
    if(this.data.options[this.data.index*4+2]==this.data.answers[this.data.index]){
      this.setData({
        score:this.data.score+5,
      })
    }
    this.update()
  },

  choose3(event) {
    if(this.data.options[this.data.index*4+3]==this.data.answers[this.data.index]){
      this.setData({
        score:this.data.score+5,
      })
    }
    this.update()
  },


  clickImg: function(e){
    var imgUrl = this.data.picPath;
    wx.previewImage({
      urls: [imgUrl], 
      current: '', 
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  end(){
    let that = this
    console.log("end")
    wx.navigateTo({
      url: '../leaderboard/leaderboard',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data:that.data.score})
      }
    })
  }




})
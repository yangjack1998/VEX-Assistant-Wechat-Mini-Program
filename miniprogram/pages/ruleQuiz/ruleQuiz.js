// ruleQuiz/ruleQuiz.js
const db = wx.cloud.database()
const _ =db.command
Page({
  
  /**
   * Page initial data
   */
  data: {
    nextQuestion:"下一题",
    result:"",
    index:0,
    correct:1,
    wrong:1,
    lookResult:0,
    questions:[],
    question:[
      "VEX2020-2021赛季主题为？",
      "本赛季场地上共有多少个得分物？",
      "场地上共有多少个框？",
      "最多有多少Row可以被连起来？",
      "以下哪一项是对得分的定义？",
      "下图中有几个球符合得分的定义？",
      "以下哪一项是对占领的定义？",
      "下图中的框被哪一方占领？",
      "自动阶段的奖励分为___分？",
      "一台机器人最多可以控制多少对方联队的球？",
      "一台机器人最多可以控制多少本方联队的球？",
      "机器人可以从框的上方将已经得分的球取出",
      "如果你在本赛季一次比赛中完成了六场资格赛，请问你最高能获得多少Win Point？",
      "请计算下图中蓝方的得分(假设没有自动加分)",
      "请计算下图中红方的得分(假设没有自动加分)"
    ],
    options:[
      "Toss Up","Change Up","Change Down","Gateway",
      "32个","30个","34个","36个",
      "7个","9个","8个","10个",
      "7条","9条","8条","10条",
      "球完全或部分在框的投影里","球完全低于框的上平面","球不接触框外的地垫","以上都是",
      "2个","3个","4个","5个",
      "取决于框中哪个颜色的得分球多","取决于最底部的得分球颜色","取决于最顶部的得分球颜色","取决于中间的得分球颜色",
      "红方","蓝方","双方都占领","双方都不占领",
      "3分","6分","9分","12分",
      "3个","4个","6个","没有限制",
      "3个","4个","6个","没有限制",
      "正确","错误","","",
      "9","12","15","18",
      "15","12","13","18",
      "15","12","13","18",
    ],
    answers:[
      "Change Up",
      "32个",
      "9个",
      "8条",
      "以上都是",
      "3个",
      "取决于最顶部的得分球颜色",
      "蓝方",
      "6分",
      "3个",
      "没有限制",
      "错误",
      "18",
      "18",
      "13"
    ],

    hint:[
      "不对哦，看看上方标题",
      "不对哦，数数图里有几个球",
      "不对哦，数数图里有几个框",
      "不对哦，数数图里有几条线",
      "不对哦，看看手册里对Scored的定义",
      "不对哦，手册上有原图和说明可以看",
      "不对哦，看看手册里对Owned的定义",
      "不对哦，手册上有原图和说明可以看",
      "不对哦，在手册里找找Autonomous Bonus",
      "不对哦，看看手册<SG8>",
      "不对哦，看看手册<SG8>",
      "不对哦，看看手册<SG5>",
      "不对哦，在手册里找找Win Point",
      "不对哦，好好数一数有几个球",
      "不对哦，好好数一数有几个球"
    ],
    pictures:[
      "1",
      "1",
      "1",
      "2",
      "3",
      "4",
      "3",
      "5",
      "1",
      "1",
      "1",
      "1",
      "1",
      "6",
      "6",
    ],
    picPath:"picture/1.jpg",
    status:""
   

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    
    let quiz = await db.collection("quiz")
    .get();

    console.log(quiz);

    quiz.data.forEach(element => {
      this.setData({
        questions:this.data.questions.concat(element.question)
      })
    });
   console.log(this.data.questions)
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
    this.setData({
      picPath:"picture/"+this.data.pictures[this.data.index]+".jpg"
    })
  },


  choose0(event1) {
    if(this.data.options[this.data.index*4]==this.data.answers[this.data.index]){
      this.setData({
        correct:this.data.correct+1,
        status:"回答正确！"        
      })
    }else{
      this.setData({
        wrong:this.data.wrong+1,
        status:this.data.hint[this.data.index]       
      })
      }
  },

  choose1(event1) {
    if(this.data.options[this.data.index*4+1]==this.data.answers[this.data.index]){
      this.setData({
        correct:this.data.correct+1,
        status:"回答正确！"        
      })
    }else{
      this.setData({
        wrong:this.data.wrong+1,
        status:this.data.hint[this.data.index]       
      })
      }
  },

  choose2(event1) {
    if(this.data.options[this.data.index*4+2]==this.data.answers[this.data.index]){
      this.setData({
        correct:this.data.correct+1,
        status:"回答正确！"        
      })
    } else{
      this.setData({
        wrong:this.data.wrong+1,
        status:this.data.hint[this.data.index]       
      })
      }
    
  },

  choose3(event) {
    if(this.data.options[this.data.index*4+3]==this.data.answers[this.data.index]){
      this.setData({
        correct:this.data.correct+1,
        status:"回答正确！"       
      }) 
    }  else{
      this.setData({
        wrong:this.data.wrong+1,
        status:this.data.hint[this.data.index]       
      })
      }
  },

  next(){
    if(this.data.index<this.data.question.length-1){
    this.setData({
      index: this.data.index+1,
      status:"",
      nextQuestion:"下一题"
    })
   } 
   else if(this.data.index==this.data.question.length-1&&this.data.lookResult==0){
    this.setData({
      nextQuestion:"查看结果",
      lookResult:1
    })
   } else{
    this.setData({
      lookResult:0
    })
    
    if(this.data.correct-this.data.wrong>5){
    this.setData({
      result:"恭喜！看上去你已经很了解规则了"
    })
  }  else if(this.data.correct-this.data.wrong>0){
    this.setData({
      result:"恭喜！看上去你对规则掌握的还不错"
    })} else{
      this.setData({
      result:"恭喜完成！但你看上去还需要再多研究研究规则"
      })
    }
  
   }
   this.update()
  },

  last(){  
  if(this.data.index>0){
    this.setData({
      index: this.data.index-1,
      status:"",
      nextQuestion:"下一题",
      result:""
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
  }




})
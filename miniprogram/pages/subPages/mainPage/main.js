const app = getApp()
const db = wx.cloud.database()
const _ =db.command

Component({
    
    onShow: {
      type: Boolean,
      value: false,
      observer: 'onShowHideChange'
      
    },

  /**
   * 组件的方法列表
   */
  onShowHideChange(show) {
    if(show){
      console.log('page1 show')
    }else{
      console.log('page1 hide')
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    socringTool: "计分工具",
    ruleQuiz: "规则测验",
    information: "资料查询",
    active: 'home',
    current: 'mainpage',
    activeKey: 0,
    row:[[1,2,3],[1,2,3],[1,2,3]],
    auto: [{
      name: 'red',
      value: '红胜'
      },
      {
        name: 'blue',
        value: '蓝胜'
      },
      {
        name: 'black',
        value: '打平'
      }
    ],
    redScore: 0,
    blueScore: 0,
    redBall:0,
    blueBall:0,
    redRow:0,
    blueRow:0,
    goals:[
      {name:'00', color:""},
      {name:'01', color:""},
      {name:'02', color:""},
      {name:'10', color:""},
      {name:'11', color:""},
      {name:'12', color:""},
      {name:'20', color:""},
      {name:'21', color:""},
      {name:'22', color:""}
    ],
    autoBackRed:0.2,
    autoBackBlue:0.2,
    autoWinner:"none",
    path:[],
    disable:true,
    check:true
    ,
    selected: 0,
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

  /**
   * 生命周期函数--监听页面加载
   */

  lifetimes:{
    attached:async function(){
        let all = await db.collection('ziliao').get()
        this.setData({
          ziliao:all.data
        })
    }
  },

  methods:{
  onChange(event) {
    this.setData({ active: event.detail });
    console.log(event.detail)
  },

  changeBallNum: function (e){
    console.log(e.currentTarget.id)
    switch(e.currentTarget.id) {
      case "redSub":
        if(this.data.redBall>0)
        this.setData({
          redBall:this.data.redBall-1
        })
        break;
      case "redAdd":
        if(this.data.redBall<16)
        this.setData({
          redBall:this.data.redBall+1
        })
        break;
      case "blueSub":
        if(this.data.blueBall>0)
        this.setData({
          blueBall:this.data.blueBall-1
        })
        break;
      case "blueAdd":
        if(this.data.blueBall<16)
        this.setData({
          blueBall:this.data.blueBall+1
        })
        break;
    }
    this.updateTotalScore()
  },

  updateTotalScore(){
    let autoRed = 0
    let autoBlue = 0
    switch(this.data.autoWinner) {
      case "red":
        autoRed = 6
        break;
      
      case "blue":
        autoBlue = 6
        break;
      
      case "both":
        autoRed = 3
        autoBlue = 3
        break;
    }
    this.setData({
      redScore:this.data.redBall+this.data.redRow*6+autoRed,
      blueScore:this.data.blueBall+this.data.blueRow*6+autoBlue
    })
  },

  updateRow(){
    const goals = this.data.goals
    let redRow = 0
    let blueRow = 0
    for(let i=0;i<goals.length;i+=3){
      if(goals[i].color===goals[i+1].color && goals[i].color===goals[i+2].color){
        if(goals[i].color=="r") redRow++
        else if(goals[i].color=="b") blueRow++
      }
    }
    for(let i=0;i+6<goals.length;i++){
      if(goals[i].color===goals[i+3].color && goals[i].color===goals[i+6].color){
        if(goals[i].color=="r") redRow++
        else if(goals[i].color=="b") blueRow++
      }
    }
    if(goals[2].color===goals[4].color&&goals[2].color===goals[6].color){
      if(goals[4].color=="r") redRow++
      else if(goals[4].color=="b") blueRow++
    }
    if(goals[0].color===goals[4].color&&goals[0].color===goals[8].color){ 
      if(goals[4].color=="r") redRow++
      else if(goals[4].color=="b") blueRow++
    }
    console.log(redRow)
    this.setData({
      redRow,
      blueRow
    })
    
  },

  radioChange(e){
    const goals = this.data.goals
    let red = 0
    let blue = 0
    for (let i = 0, len = goals.length; i < len; ++i) {
      if(goals[i].name === e.detail.value.substring(0,2))
      goals[i].color = e.detail.value.substring(2,3)
    }
    for (let i = 0, len = goals.length; i < len; ++i) {
      if(goals[i].color ==='r') red++
      else if(goals[i].color ==='b') blue++
    }
    this.setData({
      goals,
      blueBall: this.data.blueBall<blue? blue:this.data.blueBall,
      redBall:this.data.redBall<red? red:this.data.redBall
    })
    
    this.updateRow()
    this.updateTotalScore()
  },

  addAuto(e){
    let event = e.currentTarget.id
    let autoBackRed= this.data.autoBackRed
    let autoBackBlue= this.data.autoBackBlue
    let autoWinner = this.data.autoWinner
    if(event=="redAuto"){
      if(autoBackRed==0.2) autoBackRed = 0.8
      else autoBackRed = 0.2
    } else{
      if(autoBackBlue==0.2) autoBackBlue = 0.8
      else autoBackBlue = 0.2
    }
    if(autoBackRed == 0.8 && autoBackBlue == 0.8){
      autoWinner='both'
    } else if(autoBackRed == 0.8)  autoWinner='red'
      else if(autoBackBlue == 0.8)  autoWinner='blue'
      else  autoWinner='none'
    this.setData({
      autoBackBlue,
      autoBackRed,
      autoWinner
    })
    this.updateTotalScore()

  },

  open:async function(event){
    let downloadPath = 'cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/'+ event.target.id;

    this.showBusy()
    wx.cloud.downloadFile({
      fileID: downloadPath,
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
  },

  refresh:function(){
    this.setData({
      redScore: 0,
      blueScore: 0,
      redBall:0,
      blueBall:0,
      redRow:0,
      blueRow:0,
      goals:[
        {name:'00', color:""},
        {name:'01', color:""},
        {name:'02', color:""},
        {name:'10', color:""},
        {name:'11', color:""},
        {name:'12', color:""},
        {name:'20', color:""},
        {name:'21', color:""},
        {name:'22', color:""}
      ],
      autoBackRed:0.2,
      autoBackBlue:0.2,
      autoWinner:"none",
      check:true
    })
  }
}
})

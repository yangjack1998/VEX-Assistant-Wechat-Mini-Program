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
    skillMode:false,
    socringTool: "计分工具",
    ruleQuiz: "规则测验",
    information: "资料查询",
    active: 'home',
    current: 'mainpage',
    activeKey: 0,
    ring:["高","中","低"],
    mobileGoal:["本方区","高抬"],
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
    redRing:[0,0,0],
    blueRing:[0,0,0],
    redMG:[0,0],
    blueMG:[0,0],  
    redRobot:0,
    blueRobot:0,
    totalRing:0,
    totalMG:0,
    ringLimit:72,
    MGLimit:7,
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

    list1: ['机器人、遥控器电池电量', '对应颜色机器人号码牌', '易损零件(橡筋、轧带、履带等)','参赛证'],
    list2: ['预装', '机器人尺寸', '自动程序选择', '场控连接是否正常', '比赛场地是否摆放正确'],
    checked: [],
    checked2: []
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
    toggle(event) {
      const { index } = event.currentTarget.dataset;
      console.log(event.currentTarget.dataset)
      const checkbox = this.selectComponent(`#checkboxes-${index}`);
      checkbox.toggle();
    },
    toggle2(event) {
      const { index } = event.currentTarget.dataset;
      console.log(event.currentTarget.dataset)
      const checkbox = this.selectComponent(`#checkboxes2-${index}`);
      checkbox.toggle();
    },

  
    noop() {},
  onChange(event) {
    this.setData({ active: event.detail, checked: event.detail });
    console.log(event.detail)
  },

  changeRingNum: function (e){
    let targetCase = e.currentTarget.id.substring(0,6)
    let num = e.currentTarget.id.substring(6)
    switch(targetCase) {
      case "redSub":
        if(this.data.redRing[num]>0)
        this.data.redRing[num] = this.data.redRing[num] - 1
        this.setData({
          redRing:this.data.redRing
        })
        break;
      case "redAdd":
        if(this.data.totalRing<this.data.ringLimit)
        this.data.redRing[num] = this.data.redRing[num] + 1
        this.setData({
          redRing:this.data.redRing
        })
        break;
      case "bluSub":
        if(this.data.blueRing[num]>0)
        this.data.blueRing[num] = this.data.blueRing[num] - 1
        this.setData({
          blueRing:this.data.blueRing
        })
        break;
      case "bluAdd":
        if(this.data.totalRing<this.data.ringLimit)
        this.data.blueRing[num] = this.data.blueRing[num] + 1
        this.setData({
          blueRing:this.data.blueRing
        })
        break;
    }
    this.updateTotalScore()
  },

  changeMG: function (e){
    let targetCase = e.currentTarget.id.substring(0,6)
    let num = e.currentTarget.id.substring(6)
    switch(targetCase) {
      case "redSub":
        if(this.data.redMG[num]>0)
        this.data.redMG[num] = this.data.redMG[num] - 1
        this.setData({
          redMG:this.data.redMG
        })
        break;
      case "redAdd":
        if(this.data.totalMG<this.data.MGLimit && this.data.redMG[0]+this.data.redMG[1]<5)
        this.data.redMG[num] = this.data.redMG[num] + 1
        this.setData({
          redMG:this.data.redMG
        })
        break;
      case "bluSub":
        if(this.data.blueMG[num]>0)
        this.data.blueMG[num] = this.data.blueMG[num] - 1
        this.setData({
          blueMG:this.data.blueMG
        })
        break;
      case "bluAdd":
        if(this.data.totalMG<this.data.MGLimit && this.data.blueMG[0]+this.data.blueMG[1]<5)
        this.data.blueMG[num] = this.data.blueMG[num] + 1
        this.setData({
          blueMG:this.data.blueMG
        })
        break;
    }
    this.updateTotalScore()
  },

  changeRobot: function (e){
    let targetCase = e.currentTarget.id.substring(0,6)

    switch(targetCase) {
      case "redSub":
        if(this.data.redRobot>0)
        this.setData({
          redRobot:this.data.redRobot-1
        })
        break;
      case "redAdd":
        if(this.data.redRobot<2)
        this.setData({
          redRobot:this.data.redRobot+1
        })
        break;
      case "bluSub":
        if(this.data.blueRobot>0)
        this.setData({
          blueRobot:this.data.blueRobot-1
        })
        break;
      case "bluAdd":
        if(this.data.blueRobot<2)
        this.setData({
          blueRobot:this.data.blueRobot+1
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
        autoRed = 20
        break;
      
      case "blue":
        autoBlue = 20
        break;
      
      case "both":
        autoRed = 10
        autoBlue = 10
        break;
    }
    this.setData({
      totalRing: this.data.redRing[0] + 
      this.data.redRing[1] + 
      this.data.redRing[2] +
      this.data.blueRing[0] + 
      this.data.blueRing[1] + 
      this.data.blueRing[2],
      totalMG: this.data.redMG[0] +
      this.data.redMG[1] +
      this.data.blueMG[0] +
      this.data.blueMG[1],

      redScore:this.data.redRing[0]*10 + 
      this.data.redRing[1]*3 + 
      this.data.redRing[2]*1 + 
      this.data.redMG[0]*20 +
      this.data.redMG[1]*40 +
      this.data.redRobot*30+autoRed,
      blueScore:this.data.blueRing[0]*10 + 
      this.data.blueRing[1]*3 + 
      this.data.blueRing[2]*1 + 
      this.data.blueMG[0]*20 +
      this.data.blueMG[1]*40 +
      this.data.blueRobot*30+autoBlue
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


  switch1Change:function(e){
    console.log(e.detail.value)
    this.refresh()
    this.setData({
      skillMode:e.detail.value
    })
  },

  refresh:function(){
    this.setData({
      redScore: 0,
      blueScore: 0,
      redRing:[0,0,0],
      blueRing:[0,0,0],
      redMG:[0,0],
      blueMG:[0,0],  
      redRobot:0,
      blueRobot:0,
      totalRing:0,
      totalMG:0,
      autoBackRed:0.2,
      autoBackBlue:0.2,
      autoWinner:"none",
      check:true
    })
  }
}
})

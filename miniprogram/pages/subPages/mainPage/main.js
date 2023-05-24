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
    // robotlevel:["无","最高","第二","第三","第四"],
    robotlevel:["-","A","B","C","D","E","F","G","H","I","J"],
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
    triballLimit:60,
    levelLimit: 10,
    redHG: 0,
    redLG: 0,
    blueHG: 0,
    blueLG: 0,
    redLevel1:0,
    redLevel2:0,
    blueLevel1: 0,
    blueLevel2: 0,
    autoPoint:8,
    autoBackRed:0.2,
    autoBackBlue:0.2,
    autoWinner:"none",
    path:[],
    disable:true,
    check:true,
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
        let all = await db.collection('docs').get()
        console.log(all)
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

  changeInput: function(e){
    let targetCase = e.currentTarget.id
    let currentTriball = this.data.redHG+this.data.redLG+this.data.blueHG+this.data.blueLG
    let value = parseInt(e.detail)
    switch(targetCase){
        case "redInputHG":
            if(!this.isInt(value) || value<0){
                this.setData({
                    redHG:0
                })
            } else if(currentTriball+value-this.data.redHG>this.data.triballLimit){
                this.setData({
                    redHG:0
                })
                this.showExceed()
            } else{
                this.setData({
                    redHG:value
                })
            }
            break;
        
        case "blueInputHG":
            if(!this.isInt(value) || value<0){
                this.setData({
                    blueHG:0
                })
            } else if(currentTriball+value-this.data.blueHG>this.data.triballLimit){
                this.setData({
                    blueHG:0
                })
                this.showExceed()
            } else{
                this.setData({
                    blueHG:value
                })
            }
            break;

        case "redInputLG":
            if(!this.isInt(value) || value<0){
                this.setData({
                    redLG:0
                })
            } else if(currentTriball+value-this.data.redLG>this.data.triballLimit){
                this.setData({
                    redLG:0
                })
                this.showExceed()
            } else{
                this.setData({
                    redLG:value
                })
            }
            break;

        case "blueInputLG":
            if(!this.isInt(value) || value<0){
                this.setData({
                    blueLG:0
                })
            } else if(currentTriball+value-this.data.blueLG>this.data.triballLimit){
                this.setData({
                    blueLG:0
                })
                this.showExceed()
            } else{
                this.setData({
                    blueLG:value
                })
            }
            break;
              
    }  
    this.updateTotalScore()
  },

  changeTriball: function (e){
    let targetCase = e.currentTarget.id
    let currentTriball = this.data.redHG+this.data.redLG+this.data.blueHG+this.data.blueLG
    switch(targetCase) {
        case "redSubHG":
            if(this.data.redHG>0)
            this.setData({
                redHG:this.data.redHG-1
            })
            break;
        case "redAddHG":
            if(currentTriball<this.data.triballLimit)
            this.setData({
                redHG:this.data.redHG+1
            })
            break;
        case "blueSubHG":
            if(this.data.blueHG>0)
            this.setData({
                blueHG:this.data.blueHG-1
            })
            break;
        case "blueAddHG":
            if(currentTriball<this.data.triballLimit)
            this.setData({
                blueHG:this.data.blueHG+1
            })
            break;
        case "redSubLG":
            if(this.data.redLG>0)
            this.setData({
                redLG:this.data.redLG-1
            })
            break;
        case "redAddLG":
            if(currentTriball<this.data.triballLimit)
            this.setData({
                redLG:this.data.redLG+1
            })
            break;
        case "blueSubLG":
            if(this.data.blueLG>0)
            this.setData({
                blueLG:this.data.blueLG-1
            })
            break;
        case "blueAddLG":
            if(currentTriball<this.data.triballLimit)
            this.setData({
                blueLG:this.data.blueLG+1
            })
            break;
    }
    this.updateTotalScore()
  },

  isInt(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
  },

  redInputHG(e){
    console.log(e.detail)
},

changeLevel: function (e){
    let id = e.currentTarget.id
    let level = id.includes('Sub') ? -1 : 1
    let color = id.includes('red') ? 'red' : 'blue'
    let index = id.includes('1') ? '1' : '2'
    let currentLevel = this.data[color + 'Level' + index]
    if(currentLevel + level >= 0 && currentLevel + level <= this.data.levelLimit){
        this.setData({
            [color + 'Level' + index]: currentLevel + level
        })
        this.updateTotalScore()
    }
},

  updateTotalScore(){
    let autoRed = 0
    let autoBlue = 0
    switch(this.data.autoWinner) {
      case "red":
        autoRed = this.data.autoPoint
        break;
      
      case "blue":
        autoBlue = this.data.autoPoint
        break;
      
      case "both":
        autoRed = this.data.autoPoint/2
        autoBlue = this.data.autoPoint/2
        break;
    }

    const allScores = [
        this.data.redLevel1,
        this.data.redLevel2,
        this.data.blueLevel1,
        this.data.blueLevel2
      ].filter(score => score !== 0)
      const sortedScores = allScores.sort((a, b) => b - a);
      const ranks = {};
      let i = 1;
      sortedScores.forEach(score => {
        if (ranks[score] === undefined) {
          ranks[score] = i;
          i+=1;
        }
      });
    let redScore = 0;
    let blueScore = 0;
    if(this.data.redLevel1!==0){
        switch (ranks[this.data.redLevel1]) {
            case 1:
            redScore += 20;
            break;
            case 2:
            redScore += 15;
            break;
            case 3:
            redScore += 10;
            break;
            case 4:
            redScore += 5;
            break;
        }
    }
    if (this.data.redLevel2 !== 0) {
        switch (ranks[this.data.redLevel2]) {
          case 1:
            redScore += 20;
            break;
          case 2:
            redScore += 15;
            break;
          case 3:
            redScore += 10;
            break;
          case 4:
            redScore += 5;
            break;
        }
      }
      if (this.data.blueLevel1 !== 0) {
        switch (ranks[this.data.blueLevel1]) {
          case 1:
            blueScore += 20;
            break;
          case 2:
            blueScore += 15;
            break;
          case 3:
            blueScore += 10;
            break;
          case 4:
            blueScore += 5;
            break;
        }
      }
      
      if (this.data.blueLevel2 !== 0) {
        switch (ranks[this.data.blueLevel2]) {
          case 1:
            blueScore += 20;
            break;
          case 2:
            blueScore += 15;
            break;
          case 3:
            blueScore += 10;
            break;
          case 4:
            blueScore += 5;
            break;
        }
      }
      


    this.setData({
      redScore:this.data.redHG*5 +
      this.data.redLG*2+
      redScore+
      autoRed,
      blueScore:this.data.blueHG*5 +
      this.data.blueLG*2+
      blueScore+
      autoBlue,
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
    let downloadPath = event.target.id;
    // console.log(downloadPath)
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

  showExceed:function(){
    wx.showToast({
      title: '得分物数量超过上限',
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
      redHG:0,
      blueHG:0,
      triballLimit:60,
      redLG:0,
      blueLG:0,
      redLevel1:0,
      redLevel2:0,
      blueLevel1: 0,
      blueLevel2: 0,
      autoBackRed:0.2,
      autoBackBlue:0.2,
      autoWinner:"none",
      check:true
    })
  }
}
})

const app = getApp()
const db = wx.cloud.database()
const _ =db.command
Component({

  /**
   * 页面的初始数据
   */
  data: {
    team_num:"",
    team_num2:"",
    team_name:'',
    org:'',
    robot_name:'',
    city:'',
    region:'',
    grade:'',
    disable:true,
    hide:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
 lifetimes:{

  },


  methods:{
    submit(event){
      console.log("Search for team");
      wx.cloud.callFunction({
        // 云函数名称
        name: 'searchTeam',
        // 传给云函数的参数
        data: {
          team_num: this.data.team_num,
        },
      })
      .then(res => {
        console.log(res.result) // 3
        let info = res.result.data;
        if(info.length<1){
          wx.showToast({
            title:'查询的队伍编号不存在，请重新输入',
            icon:'none',
            duration:3000
          })
          this.setData({
            team_num:''
          })
          return;
        } else{
          this.setData({
            hide:false,
            team_num2:this.data.team_num,
            team_name:info[0].team_name,
            robot_name:info[0].robot_name,
            org:info[0].organization,
            city:info[0].location.city,
            region:info[0].location.country,
            grade:info[0].grade,
          })
          
        }


        console.log(info);
      })
      .catch(console.error)
    },

    bindKeyInput: function (e) {
      this.setData({
        team_num: e.detail.value
      })
      let input = this.data.team_num
  
  
      if(input.length>0){
        this.setData({
          disable:false
        })
      } 
        else{
          this.setData({
            disable:true
          })
  
        }
    },
}

})
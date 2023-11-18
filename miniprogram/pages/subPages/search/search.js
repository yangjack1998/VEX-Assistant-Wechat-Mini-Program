const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({

    // 页面的初始数据
    data: {
        team_num: "",
        disable: true,
    },

    // 生命周期函数
    lifetimes: {

    },

    methods: {
        // 新增的独立方法，用于调用云函数获取基本队伍信息
        getTeamBaseInfo() {
            wx.cloud.callFunction({
                config: { env: 'vex-assistant-1gwxsfv3ad6fda91' },
                name: 'searchTeam',
                data: {
                    team_num: this.data.team_num,
                },
            })
            .then(res => {
                this.handleSearchTeamResult(res);
            })
            .catch(console.error)
        },

        // 处理云函数返回的结果
        handleSearchTeamResult(res) {
            console.log(res);
            const info = res.result;
            if (info.length < 1) {
                wx.showToast({
                    title: '查询的队伍编号不存在，请重新输入',
                    icon: 'none',
                    duration: 3000
                });
                this.setData({
                    team_num: ''
                });
                return;
            } else {
                // 跳转到新页面并传递队伍编号
                wx.navigateTo({
                    url: '/pages/teamDigest/teamDigest?team_num=' + this.data.team_num
                });
            }
        },

        // 提交表单的方法
        submit(event) {
            console.log("Search for team");
            this.getTeamBaseInfo();
        },

        bindKeyInput: function (e) {
            this.setData({
                team_num: e.detail.value
            });
            let input = this.data.team_num;

            if (input.length > 0) {
                this.setData({
                    disable: false
                });
            } else {
                this.setData({
                    disable: true
                });
            }
        },
    }
})

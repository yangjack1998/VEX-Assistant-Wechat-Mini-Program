const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({

    // 页面的初始数据
    data: {
        team_num: "",
        team_num2: "",
        team_name: '',
        org: '',
        robot_name: '',
        city: '',
        region: '',
        grade: '',
        disable: true,
        hide: false,
        events: []
    },

    // 生命周期函数
    lifetimes: {

    },

    methods: {
        // 新增的独立方法，用于调用云函数
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

        getTeamSeasonDigest() {
            wx.cloud.callFunction({
                config: { env: 'vex-assistant-1gwxsfv3ad6fda91' },
                name: 'searchSeasonDigest',
                data: {
                    team_num: this.data.team_num,
                },
            })
                .then(res => {
                    this.handleSearchDigestResult(res);
                })
                .catch(console.error)
        },

        // 处理云函数返回的结果
        handleSearchDigestResult(res) {
            const info = res.result;
            console.log(info)
            if (info.length < 1) {
                wx.showToast({
                    title: '查询的队伍编号不存在，请重新输入',
                    icon: 'none',
                    duration: 3000
                })
                this.setData({
                    team_num: ''
                })
                return;
            } else {
                this.setData({
                    events: info
                });
                console.log(this.data.events)
            }
        },

        // 处理云函数返回的结果
        handleSearchTeamResult(res) {
            console.log(res) // 3
            const info = res.result;
            if (info.length < 1) {
                wx.showToast({
                    title: '查询的队伍编号不存在，请重新输入',
                    icon: 'none',
                    duration: 3000
                })
                this.setData({
                    team_num: ''
                })
                return;
            } else {
                this.setData({
                    hide: false,
                    team_num2: info.number,
                    team_name: info.team_name,
                    robot_name: info.robot_name,
                    org: info.organization,
                    city: info.location.city,
                    region: info.location.country,
                    grade: info.grade,
                })
            }
            console.log(info);
        },

        // 提交表单的方法
        submit(event) {
            console.log("Search for team");
            this.getTeamBaseInfo();
            this.getTeamSeasonDigest();
        },

        bindKeyInput: function (e) {
            this.setData({
                team_num: e.detail.value
            })
            let input = this.data.team_num

            if (input.length > 0) {
                this.setData({
                    disable: false
                })
            } else {
                this.setData({
                    disable: true
                })
            }
        },
    }
})

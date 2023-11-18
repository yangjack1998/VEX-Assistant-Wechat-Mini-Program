// teamDetails.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Page({
    data: {
        team_num: "",
        events: [],
        teamDetails: {},
        // 可以根据需要添加更多的数据字段
    },

    onLoad: function (options) {
        // 获取从上一个页面传递过来的队伍编号
        console.log(options.team_num); // 打印以确保数据传递正确
        this.setData({
            team_num: options.team_num
        });

        // 调用函数获取队伍详细信息
        this.getTeamDetails();
        this.getTeamSeasonDigest();
    },

    getTeamDetails() {
        wx.cloud.callFunction({
            config: { env: 'vex-assistant-1gwxsfv3ad6fda91' },
            name: 'searchTeam',
            data: {
                team_num: this.data.team_num,
            },
        })
        .then(res => {
            this.setData({
                teamDetails: res.result
            });
        })
        .catch(console.error);
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
            console.log( this.data.team_num)
            console.log(res.result)
            this.setData({
                events: res.result
            });
        })
        .catch(console.error);
    },

    toggleEvent: function(e) {
        const index = e.currentTarget.dataset.index;
        const toggle = `events[${index}].expanded`;
        this.setData({
            [toggle]: !this.data.events[index].expanded
        });
    },

    // 可以添加更多的方法来处理用户交互或数据处理

});

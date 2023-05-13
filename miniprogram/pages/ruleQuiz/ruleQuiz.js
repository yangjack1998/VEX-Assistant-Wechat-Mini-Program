// ruleQuiz/ruleQuiz.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
var intt
var intt2
Page({

    /**
     * Page initial data
     */
    data: {
        fileName: "no",
        result: "",
        index: 0,
        score: 0,
        lookResult: 0,
        questions: [],
        options: [],
        answers: [],
        pictures: [],
        picPath: "cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/quizPics/0.jpg",
        status: "",
        time_rest: 60,
        time: {
            hour: 0,
            minute: 1,
            second: 0,
            millisecond: 0
        },
        timecount: ''

    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: async function (options) {
        wx.showToast({
            title: '加载中...',
            icon: "loading",
            duration: 2000
        })

        const MAX_LIMIT = 20
        const countResult = await db.collection('spin_up_quiz').count()
        const total = countResult.total
        // 计算需分几次取
        const batchTimes = Math.ceil(total / 20)
        let all = await (await db.collection('spin_up_quiz').get()).data
        for (let i = 1; i < batchTimes; i++) {
            const temp = db.collection('spin_up_quiz').skip(i * MAX_LIMIT).get()
            all = all.concat((await temp).data)
        }

        for (let i = 1; i < all.length; i++) {
            const random = Math.floor(Math.random() * (i + 1));
            [all[i], all[random]] = [all[random], all[i]];
        }


        all.forEach(element => {
            this.setData({
                questions: this.data.questions.concat(element.question),
                options: this.data.options.concat(element.options),
                answers: this.data.answers.concat(element.answer),
                pictures: this.data.pictures.concat(element.picture)
            })
        });



        //console.log(all);
        this.setData({
            fileName: this.data.pictures[this.data.index],
            picPath: "cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/quizPics/" + this.data.pictures[this.data.index] + ".jpg"
        })


    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {
        //this.start();
        let that = this
        setTimeout(function () {
            that.start();
        }, 2000) //延迟时间 这里是1秒
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

    update() {
        if (this.data.index + 1 == this.data.questions.length) {
            this.end()
        } else {
            this.setData({
                index: this.data.index + 1,
            })
            this.setData({
                fileName: this.data.pictures[this.data.index],
                picPath: "cloud://vexnews-f53mu.7665-vexnews-f53mu-1302123540/quizPics/" + this.data.pictures[this.data.index] + ".jpg"
            })
            //console.log(this.data.fileName)
        }
    },


    async choose0(event1) {
        if (this.data.options[this.data.index * 4] == this.data.answers[this.data.index]) {
            this.setData({
                score: this.data.score + 5,
            })
        } else {
            let question = this.data.questions[this.data.index]
            let old = await db.collection("spinup_quiz_data").where({
                question: question
            }).get()
            if (old.data.length > 0) {
                this.setData({
                    recordID: old.data[0]._id,
                })
                db.collection("spinup_quiz_data").doc(this.data.recordID).update({
                    data: {
                        count: _.inc(1)
                    }
                })
            } else {
                db.collection("spinup_quiz_data").add({
                    data:
                    {
                        question: question,
                        count: 1
                    },
                })
            }
        }
        this.update()
    },

    async choose1(event1) {
        if (this.data.options[this.data.index * 4 + 1] == this.data.answers[this.data.index]) {
            this.setData({
                score: this.data.score + 5,
            })
        } else {
            let question = this.data.questions[this.data.index]
            let old = await db.collection("spinup_quiz_data").where({
                question: question
            }).get()
            if (old.data.length > 0) {
                this.setData({
                    recordID: old.data[0]._id,
                })
                db.collection("spinup_quiz_data").doc(this.data.recordID).update({
                    data: {
                        count: _.inc(1)
                    }
                })
            } else {
                db.collection("spinup_quiz_data").add({
                    data:
                    {
                        question: question,
                        count: 1
                    },
                })
            }
        }
        this.update()
    },

    async choose2(event1) {
        if (this.data.options[this.data.index * 4 + 2] == this.data.answers[this.data.index]) {
            this.setData({
                score: this.data.score + 5,
            })
        } else {
            let question = this.data.questions[this.data.index]
            let old = await db.collection("spinup_quiz_data").where({
                question: question
            }).get()
            if (old.data.length > 0) {
                this.setData({
                    recordID: old.data[0]._id,
                })
                db.collection("spinup_quiz_data").doc(this.data.recordID).update({
                    data: {
                        count: _.inc(1)
                    }
                })
            } else {
                db.collection("spinup_quiz_data").add({
                    data:
                    {
                        question: question,
                        count: 1
                    },
                })
            }
        }
        this.update()
    },

    async choose3(event) {
        if (this.data.options[this.data.index * 4 + 3] == this.data.answers[this.data.index]) {
            this.setData({
                score: this.data.score + 5,
            })
        } else {
            let question = this.data.questions[this.data.index]
            let old = await db.collection("spinup_quiz_data").where({
                question: question
            }).get()
            if (old.data.length > 0) {
                this.setData({
                    recordID: old.data[0]._id,
                })
                db.collection("spinup_quiz_data").doc(this.data.recordID).update({
                    data: {
                        count: _.inc(1)
                    }
                })
            } else {
                db.collection("spinup_quiz_data").add({
                    data:
                    {
                        question: question,
                        count: 1
                    },
                })
            }
        }
        this.update()
    },


    clickImg: function (e) {
        var imgUrl = this.data.picPath;
        wx.previewImage({
            urls: [imgUrl],
            current: '',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },

    end() {
        clearInterval(intt);
        clearInterval(intt2);
        let that = this
        console.log("end")
        app.globalData.score = that.data.score
        app.globalData.time = Date.parse(new Date())
        //app.globalData.timeShow=that.data.timecount
        wx.redirectTo({
            url: '../leaderboard/leaderboard'
            // events: {
            //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            //   acceptDataFromOpenedPage: function(data) {
            //     console.log(data)
            //   }
            // },
            // success: function(res) {
            //   // 通过eventChannel向被打开页面传送数据
            //   res.eventChannel.emit('acceptDataFromOpenerPage', { data:that.data.score})
            //   res.eventChannel.emit('acceptDataFromOpenerPage', { time:that.data.time.millisecond})
            // }
        })
    },

    start: function () {
        var that = this;
        //停止（暂停）
        clearInterval(intt);
        clearInterval(intt2);
        //时间重置
        that.setData({
            time: {
                hour: 0,
                minute: 1,
                second: 0,
                millisecond: 0
            }
        })
        intt = setInterval(function () { that.end() }, 60000);
        intt2 = setInterval(function () { that.timer2() }, 1000);
    },

    timer2: function () {
        this.setData({
            time_rest: this.data.time_rest - 1
        })
    },

    timer: function () {
        var that = this;
        that.setData({
            'time.millisecond': that.data.time.millisecond + 5
        })
        if (that.data.time.millisecond % 100 == 0) {
            that.setData({
                'time.second': that.data.time.second + 1
            })
        }
        if (that.data.time.second >= 60) {
            that.setData({
                'time.second': 0,
                'time.minute': that.data.time.minute + 1
            })
        }

        if (that.data.time.minute >= 60) {
            that.setData({
                'time.minute': 0,
                'time.hour': that.data.time.hour + 1
            })
        }
        let hourSpace = '0'
        let minSpace = '0'
        let secSpace = '0'
        if (that.data.time.second > 9) secSpace = ''
        if (that.data.time.minute > 9) minSpace = ''
        if (that.data.time.hour > 9) hourSpace = ''
        that.setData({
            timecount: hourSpace + that.data.time.hour + ":" + minSpace + that.data.time.minute + ":" + secSpace + that.data.time.second
        })
    },



})
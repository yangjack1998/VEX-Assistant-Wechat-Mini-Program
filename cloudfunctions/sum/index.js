// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// // 云函数入口函数
// exports.main = (event, context) => {
//   console.log(event)
//   console.log(context)
//   return {
//     sum: event.a + event.b
//   }
// }

// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = 'https://www.baidu.com';
  return await rp(url)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      return '失败'
    });
}
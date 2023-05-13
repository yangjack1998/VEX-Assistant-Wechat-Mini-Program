
 
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()
 
// 云函数入口函数
exports.main = async (event, context) => {
  let url = 'https://www.robotevents.com/api/v2/teams?number%5B%5D='+event.team_num+'&program%5B%5D=1&program%5B%5D=4&myTeams=false';
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiN2I2NzA1YWUzNjJjMjMzMjM2NWJlZGNjYTRlMjYxZTZmN2VkZjI0OWFlYTc3YzdkMjQ1OTQzY2IwZTkzNTRiZTlhODk4MWZjY2M0OWNhZDMiLCJpYXQiOjE2MDQ5NTIyOTksIm5iZiI6MTYwNDk1MjI5OSwiZXhwIjoyNTUxNjM3MDk5LCJzdWIiOiI2MTI5MiIsInNjb3BlcyI6W119.DzQLNxlkLU7MGZ4OyboRLt8PogmgFXADWuz2QZmbpXFFZ7-Tf3HFSmEBRPmwfc0APRMU3Y3UmKMyNOFqi3h4AC99tyAXONY4q9N7ukFEeXcL2EVNLONq1oZS5Oh5T7_7nEKbUPj-h6A_NGbYhVBVYGnKwA8jEcJ488sRQQ8YzuoPN1N1Ic2aorwooi1T48AHHVRHxdvwGQT5x9Bi5hJaj6R1jiAWHNbrvB3LySDR8DlUBNDv1NCaYCt7WKk0FDapQt2UeguKG6OQ-Ah1LwgtNsQv-DV7bSrw2TgsESBPLietN2JYRIlcFBaJGggn1ASUsHxXIpshinn5SooCZnobDsvN9s_Sfbj3ghC7KXVzxOlVVm-_DLORoIpzdRMQqfzqHJj1PnNwQAXoBEJQt3fZ2BmqPxwmMzx-h1uEijgBXbQsA39JJ1VVgQP3fQ6rl3wnG_bVOMm_VrXgYgip0PYpqRy54Z3zhpx6nYGzELmSGnYkksILVhpb-wrxoxqhcwDWAuu4yFtOqefx72XkT-8g8QoVqoCHJQvNTaBel7OXy1c63vffWsQGBcb4YPZmc30A5t-wSl9UM4Fi7pmgHmRxoE5B6yyuhNw-AlQjd1MN_ZOjA1VMU4TzqrFPSa5ehIRKvEjLjVVTx-Grp2Nd6NLV3WZa2rnVp86zXC06DMAfF2I'
  
  var options = {
    url: url,
    headers: {
        'User-Agent': 'client'
    },
    auth: {
        'bearer': token
    },
    json: true
};

  return rp(options)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      return '失败'
    });
}

// 云函数入口函数
// exports.main = async (event, context) => {
//     //let url = 'https://www.robotevents.com/api/v2/teams?number%5B%5D='+event.team_num+'&program%5B%5D=1&program%5B%5D=4&myTeams=false';
//     let url = 'https://www.robotevents.com/api/v2/teams/32686/awards'
//     let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiN2I2NzA1YWUzNjJjMjMzMjM2NWJlZGNjYTRlMjYxZTZmN2VkZjI0OWFlYTc3YzdkMjQ1OTQzY2IwZTkzNTRiZTlhODk4MWZjY2M0OWNhZDMiLCJpYXQiOjE2MDQ5NTIyOTksIm5iZiI6MTYwNDk1MjI5OSwiZXhwIjoyNTUxNjM3MDk5LCJzdWIiOiI2MTI5MiIsInNjb3BlcyI6W119.DzQLNxlkLU7MGZ4OyboRLt8PogmgFXADWuz2QZmbpXFFZ7-Tf3HFSmEBRPmwfc0APRMU3Y3UmKMyNOFqi3h4AC99tyAXONY4q9N7ukFEeXcL2EVNLONq1oZS5Oh5T7_7nEKbUPj-h6A_NGbYhVBVYGnKwA8jEcJ488sRQQ8YzuoPN1N1Ic2aorwooi1T48AHHVRHxdvwGQT5x9Bi5hJaj6R1jiAWHNbrvB3LySDR8DlUBNDv1NCaYCt7WKk0FDapQt2UeguKG6OQ-Ah1LwgtNsQv-DV7bSrw2TgsESBPLietN2JYRIlcFBaJGggn1ASUsHxXIpshinn5SooCZnobDsvN9s_Sfbj3ghC7KXVzxOlVVm-_DLORoIpzdRMQqfzqHJj1PnNwQAXoBEJQt3fZ2BmqPxwmMzx-h1uEijgBXbQsA39JJ1VVgQP3fQ6rl3wnG_bVOMm_VrXgYgip0PYpqRy54Z3zhpx6nYGzELmSGnYkksILVhpb-wrxoxqhcwDWAuu4yFtOqefx72XkT-8g8QoVqoCHJQvNTaBel7OXy1c63vffWsQGBcb4YPZmc30A5t-wSl9UM4Fi7pmgHmRxoE5B6yyuhNw-AlQjd1MN_ZOjA1VMU4TzqrFPSa5ehIRKvEjLjVVTx-Grp2Nd6NLV3WZa2rnVp86zXC06DMAfF2I'
//     const map1 = new Map();

//     var options = {
//       url: url,
//       headers: {
//           'User-Agent': 'client'
//       },
//       auth: {
//           'bearer': token
//       },
//       json: true
//   };
//     console.log("dada")
//     return rp(options)
//       .then(function (res) {
//         console.log("Succeed")
//         console.log(res)
//         return res
//         // if(res.meta.next_page_url==null){
//         //     return "getMax(map1)"
//         // }
//         // console.log(res.meta.next_page_url)
//         // options.url = res.meta.next_page_url
//         // rp(options)
//       })
//       .catch(function (err) {
//         console.log("Failed")
//         return '失败'
//       });
//   }
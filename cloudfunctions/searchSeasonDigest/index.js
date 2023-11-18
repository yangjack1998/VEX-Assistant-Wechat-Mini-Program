const cloud = require('wx-server-sdk')
const robotevents = require('robotevents-api');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiN2I2NzA1YWUzNjJjMjMzMjM2NWJlZGNjYTRlMjYxZTZmN2VkZjI0OWFlYTc3YzdkMjQ1OTQzY2IwZTkzNTRiZTlhODk4MWZjY2M0OWNhZDMiLCJpYXQiOjE2MDQ5NTIyOTksIm5iZiI6MTYwNDk1MjI5OSwiZXhwIjoyNTUxNjM3MDk5LCJzdWIiOiI2MTI5MiIsInNjb3BlcyI6W119.DzQLNxlkLU7MGZ4OyboRLt8PogmgFXADWuz2QZmbpXFFZ7-Tf3HFSmEBRPmwfc0APRMU3Y3UmKMyNOFqi3h4AC99tyAXONY4q9N7ukFEeXcL2EVNLONq1oZS5Oh5T7_7nEKbUPj-h6A_NGbYhVBVYGnKwA8jEcJ488sRQQ8YzuoPN1N1Ic2aorwooi1T48AHHVRHxdvwGQT5x9Bi5hJaj6R1jiAWHNbrvB3LySDR8DlUBNDv1NCaYCt7WKk0FDapQt2UeguKG6OQ-Ah1LwgtNsQv-DV7bSrw2TgsESBPLietN2JYRIlcFBaJGggn1ASUsHxXIpshinn5SooCZnobDsvN9s_Sfbj3ghC7KXVzxOlVVm-_DLORoIpzdRMQqfzqHJj1PnNwQAXoBEJQt3fZ2BmqPxwmMzx-h1uEijgBXbQsA39JJ1VVgQP3fQ6rl3wnG_bVOMm_VrXgYgip0PYpqRy54Z3zhpx6nYGzELmSGnYkksILVhpb-wrxoxqhcwDWAuu4yFtOqefx72XkT-8g8QoVqoCHJQvNTaBel7OXy1c63vffWsQGBcb4YPZmc30A5t-wSl9UM4Fi7pmgHmRxoE5B6yyuhNw-AlQjd1MN_ZOjA1VMU4TzqrFPSa5ehIRKvEjLjVVTx-Grp2Nd6NLV3WZa2rnVp86zXC06DMAfF2I'
    robotevents.setToken(token);

    const team = await robotevents.teams.get(event.team_num, robotevents.Programs.VRC);
    const events = await team.events({ season: '2021-2022' });

    // 使用 Promise.all 来并行处理所有事件
    const eventDetails = await Promise.all(events.map(async (event) => {
        const eventId = event.id;
        const matches = await team.matches({ eventId: eventId });
        const rankings = await team.rankings({ eventId: eventId });
        const skills = await team.skills({ eventId: eventId });
        const awards = await team.awards({ eventId: eventId });

        // 构造并返回每个事件的详细信息
        return {
            eventName: event.name,
            matches,
            rankings,
            skills,
            awards
        };
    }));

    return eventDetails;
}
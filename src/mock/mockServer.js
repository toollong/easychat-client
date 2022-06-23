import Mock from "mockjs"
import chatList from "./chatList.json"
import friendList from "./friendList.json"
import friendVerifyList from "./friendVerifyList.json"
import chatHistoryList from "./chatHistoryList.json"

const userInfo = {
    code: 200, data: {
        id: "20000000001",
        avatar: "/images/avatar2.jpg",
        nickName: "无敌",
        gender: "1",
        age: 20,
        birthday: "2000-01-01",
        email: "123456789@qq.com",
        phone: "1234567890",
        region: "山东省 烟台市",
        introduction: ""
    }
}

Mock.mock("/mock/user", "get", userInfo)
Mock.mock("/mock/chats", "get", { code: 200, data: chatList })
Mock.mock("/mock/friends", "get", { code: 200, data: friendList })
Mock.mock("/mock/friends/verify", "get", { code: 200, data: friendVerifyList })
Mock.mock("/mock/chats/chat/history", "get", { code: 200, data: chatHistoryList })
Mock.mock("/mock/chats/add", "post", { code: 200, data: "10000000001" })
Mock.mock("/mock/logout", "post", { code: 200 })
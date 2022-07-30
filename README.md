# easychat-client

## 介绍

easychat-client 是 EasyChat 项目的前端部分，基于 Vue CLI 开发。

EasyChat 是一个可以在线聊天的即时通讯平台，完全由个人设计和开发，初衷主要是觉得好玩儿，顺便学习一些新东西，所以网站有些简陋，属实是本人的能力和财力有限。网站没有任何付费内容，所有内容完全免费，欢迎大家使用体验，也期待大佬们的交流与反馈。

体验地址：[https://toollong.icu](https://toollong.icu)

> #### 功能介绍

注册
登录
找回密码
添加聊天
删除聊天
发送文本消息
发送 Emoji 表情（Windows 7 可能无法正常显示）
发送图片（批量发送）
发送文件（同步发送，有点慢）
新消息通知
搜索用户
修改好友备注
好友申请
好友验证
好友删除（单向删除）
验证消息通知
查看资料
编辑资料
设置（头像、隐身、标签、修改密码）
夜间模式
小抽屉（搜一搜、日历）

> #### 技术栈

前端：Vue 3，Vue Router，Vuex，Element Plus，Socket.IO，Axios，VueUse...

后端：Spring Cloud，Nacos，MyBatis-Plus，Netty-socketio，MinIO，Gson，MySQL，Redis，Docker...

> #### 注意

本网站仅供学习交流使用，由于网站的安全保障和加密措施并不完善，**请勿在网站中输入敏感信息**，避免信息泄露的风险。

## 安装

```
npm install
```

### 启动运行

需要修改的地方：

- 入口文件 main.js 中 socket.io 的 url
- vue.config.js 中 devServer 的 url

```
npm run serve
```

### 构建

```
npm run build
```

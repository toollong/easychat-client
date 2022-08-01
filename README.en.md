# EasyChat-client

## Introduction

Easychat-client is the front-end part of EasyChat project, which is developed based on Vue cli.

EasyChat is an instant messaging platform that can chat online. It is completely designed and developed by individuals. The original intention is to have fun and learn some new things by the way, so the website is a little crude. It is true that my ability and financial resources are limited. There is no paid content on the website, and all content is completely free. Welcome to use the experience, and look forward to your communication and feedback.

Experience address: [https://toollong.icu](https://toollong.icu) (My username: toollong)

For more information about the website, [click here](https://toollong.icu/#/about)。

> ###  Function introduction

- Register
- Login
- Find Password
- Add Chat
- Remove Chat
- Send 
- Send Emoji emoticons (Windows 7 may not display properly)
- Send Pictures (Batch send)
- Send File (Send synchronously, a little slow)
- New Message Notification (Including prompt tone)
- Search Users
- Modify Friend's Remark
- Apply For Friend
- Verify Friend
- Delete Friend (One-way delete)
- Verify Message Notification (Including prompt tone)
- View Profile
- Edit Profile
- Settings (Avatar、Invisible、Tags、Change Password)
- Night Mode
- Small Drawer (Search、Calendar)


> ###  Technology stack

- Front-end: Vue 3, Vue Router, Vuex, Element Plus, Socket.IO, Axios, VueUse...

- Back-end: Spring Cloud, Nacos, MyBatis-Plus, Netty-socketio, MinIO, Gson, MySQL, Redis, Docker...

> ### Attention

- This website is only for learning and communication. Because the security and encryption measures of the website are not perfect, **please do not enter sensitive information** in the website to avoid the risk of information disclosure.

- My email: toollong@163.com

- My blog: [https://blog.csdn.net/weixin_49523761](https://blog.csdn.net/weixin_49523761)


## Install

```
npm install
```

## Run

  What needs to be modified:

- URL of "socket.io" in the entry file "main.js"
- URL of "devserver" in "vue.config.js"

```
npm run serve
```

## Build

```
npm run build
```

<template>
  <div class="about">
    <div class="about-header"><img src="/images/logo.svg" /></div>
    <div class="about-body">
      <p class="introduction">
        <span class="title">EasyChat</span>
        是一个可以在线聊天的即时通讯平台，完全由个人设计和开发，初衷主要是觉得好玩儿，顺便学习一些新东西，
        所以网站有些简陋，属实是本人的能力、财力有限。欢迎大家使用体验，也期待大佬们的交流与反馈。
      </p>

      <p>版本更新：<el-tag type="success">v1.0.0</el-tag></p>

      <p>网站还在持续建设中，更多的功能敬请期待...</p>
      <div>
        <p style="margin-top: 50px; margin-bottom: 0">
          本网站前端使用 Vue CLI，后端使用 Java，服务器分别是 Nginx 和 Tomcat 。
        </p>
        <p style="margin: 0">前端：</p>
        <p style="margin: 0">
          Vue 3，Vue Router，Vuex，Element Plus，Socket.IO，Axios，VueUse
        </p>
        <p style="margin: 0">后端：</p>
        <p style="margin-top: 0">
          Spring
          Cloud，Nacos，MyBatis-Plus，Netty-socketio，MinIO，Gson，MySQL，Redis，Docker
        </p>
      </div>

      <p class="email">
        本人邮箱：toollong@163.com
        <a @click="showQRCode = true">想加微信？</a>
      </p>
      <p class="blog">本人博客：https://blog.csdn.net/weixin_49523761</p>
      <p class="attention">
        <span class="title">注意：</span
        >本网站仅供学习交流使用，由于网站的安全保障和加密措施并不完善，<span
          class="text-danger"
          >请勿在网站中输入敏感信息</span
        >，避免信息泄露的风险。
      </p>
    </div>
    <div class="about-footer">
      <p>Copyright © 2022 EasyChat. Crafted with by toollong</p>
    </div>
    <el-dialog
      v-model="showQRCode"
      width="30%"
      destroy-on-close
      @open="randomNum = Math.floor(Math.random() * 6) + 1"
    >
      <div class="contact">
        <p class="tip">扫一扫下面的二维码图案，加我微信</p>
        <el-image :src="'/images/wechat/wechat' + randomNum + '.png'" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "About",
  setup() {
    const showQRCode = ref(false);

    return {
      showQRCode,
    };
  },
};
</script>

<style scoped>
.about {
  display: flex;
  height: 100vh;
  flex-flow: column nowrap;
  background-color: rgb(244, 244, 244);
  color: #303133;
  overflow: hidden;
}
.about .about-header {
  margin: auto;
  margin-top: 50px;
  margin-bottom: 0;
}
.about .about-body {
  width: 800px;
  font-size: 16px;
  color: #606266;
  line-height: 1.8;
  padding: 20px;
  margin: 0 auto;
}
.about .about-footer {
  color: #969696;
  margin: auto;
  margin-bottom: 80px;
}
.about-header img {
  width: 80px;
  height: 80px;
}
.about-body .introduction {
  font-size: 18px;
  margin-top: 0;
}
.about-body .introduction .title {
  font-size: 20px;
  font-weight: 600;
}
.about-body .email {
  margin-top: 50px;
  margin-bottom: 0;
}
.about-body .email a {
  font-size: 16px;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  margin-left: 20px;
}
.about-body .email a:hover {
  color: #a0cfff;
}
.about-body .blog {
  margin-top: 0;
}
.about-body .attention {
  margin-top: 30px;
}
.about-body .attention .title {
  font-size: 18px;
  font-weight: 600;
}
.text-success {
  color: #67c23a;
}
.text-danger {
  color: #f56c6c;
}
.contact {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding-bottom: 20px;
}
.contact .tip {
  font-size: 18px;
  color: #969696;
  margin-top: 0;
  margin-bottom: 10px;
}
</style>
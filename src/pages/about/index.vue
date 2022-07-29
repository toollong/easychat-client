<template>
  <div class="about">
    <el-scrollbar max-height="100vh">
      <div class="about-header"><img src="/images/logo.svg" /></div>
      <div class="about-body">
        <p class="introduction">
          <a href="https://toollong.icu" target="_blank">EasyChat</a>
          是一个可以在线聊天的即时通讯平台，完全由个人设计和开发，初衷主要是觉得好玩儿，顺便学习一些新东西，所以网站有些简陋，属实是本人的能力和财力有限。
          网站没有任何付费内容，所有内容完全免费，欢迎大家使用体验，也期待大佬们的交流与反馈。
        </p>
        <el-collapse class="collapse" v-model="activeName" accordion>
          <el-collapse-item title="功能介绍" name="1">
            <div class="function">
              <span>已实现的功能：</span>
              <p>注册</p>
              <p>登录</p>
              <p>找回密码</p>

              <p>添加聊天</p>
              <p>删除聊天</p>
              <p>发送文本消息</p>
              <p>发送 Emoji 表情<span>（Windows 7 可能无法正常显示）</span></p>
              <p>发送图片<span>（批量发送）</span></p>
              <p>发送文件<span>（同步发送，有点慢）</span></p>
              <p>新消息通知</p>

              <p>搜索用户</p>
              <p>修改好友备注</p>
              <p>好友申请</p>
              <p>好友验证</p>
              <p>好友删除<span>（单向删除）</span></p>
              <p>验证消息通知</p>

              <p>查看资料</p>
              <p>编辑资料</p>
              <p>设置<span>（头像、隐身、标签、修改密码）</span></p>
              <p>夜间模式</p>
              <p>小抽屉<span>（搜一搜、日历）</span></p>

              <span>暂未实现的功能：</span>
              <p>语音通话、视频通话、聊天组、特别关心、收藏、听音乐、看电影</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="版本更新" name="2">
            <div class="version">
              <p class="tip">网站正在持续建设中，更多的功能敬请期待...</p>
              <el-timeline>
                <el-timeline-item
                  timestamp="将要发布"
                  placement="top"
                  type="info"
                >
                  <el-card>
                    <el-tag type="info">v1.0.1</el-tag>
                    <p>- 实现移动端适配，可以在手机上体验使用了</p>
                    <p>- 修复了部分已知 BUG</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item
                  timestamp="2022-08-01"
                  placement="top"
                  type="success"
                >
                  <el-card>
                    <el-tag type="success">v1.0.0</el-tag>
                    <p>- 发布上线</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-collapse-item>
          <el-collapse-item title="BUG" name="3">
            <div class="bug">
              <p>目前已知的 BUG ：</p>
              <ul>
                <li>聊天表情显示问题（Win7系统 Emoji 表情可能无法正常显示）</li>
                <li>
                  单次发送多张图片，图片在消息列表中的显示问题（刷新页面后可正确显示）
                </li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="技术栈" name="4">
            <div class="technology">
              <p>
                本网站前端使用 Vue CLI ，部署在 Nginx ；后端使用 Java ，部署在
                Tomcat 。
              </p>
              <span>前端：</span>
              <div>
                Vue 3，Vue Router，Vuex，Element
                Plus，Socket.IO，Axios，VueUse...
              </div>
              <span>后端：</span>
              <div>
                Spring
                Cloud，Nacos，MyBatis-Plus，Netty-socketio，MinIO，Gson，MySQL，Redis，
                Docker...
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

        <div>
          <p class="email">
            本人邮箱：toollong@163.com
            <a @click="showQRCode = true">想加微信？</a>
          </p>
          <p class="blog">
            本人博客：<a
              href="https://blog.csdn.net/weixin_49523761"
              target="_blank"
              >https://blog.csdn.net/weixin_49523761</a
            >
          </p>
          <p class="attention">
            <span class="title">注意：</span
            >本网站仅供学习交流使用，由于网站的安全保障和加密措施并不完善，<span
              class="text-danger"
              >请勿在网站中输入敏感信息</span
            >，避免信息泄露的风险。
          </p>
        </div>
      </div>
      <div class="about-footer">
        <p>Copyright © 2022 toollong. All Rights Reserved.</p>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          鲁ICP备2022024710号-1
        </a>
      </div>
    </el-scrollbar>
    <el-dialog
      v-model="showQRCode"
      width="570px"
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
    const activeName = ref("0");
    const showQRCode = ref(false);

    return {
      activeName,
      showQRCode,
    };
  },
};
</script>

<style scoped>
.about {
  display: flex;
  min-height: 100vh;
  flex-flow: column nowrap;
  background-color: rgb(244, 244, 244);
  color: #303133;
  overflow: hidden;
}
.about .about-header {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
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
  text-align: center;
  margin-bottom: 20px;
}
.about-header img {
  width: 80px;
  height: 80px;
}
.about-body .introduction {
  font-size: 18px;
  letter-spacing: 0.6px;
  margin-top: 0;
}
.about-body .introduction a {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}
.about-body .introduction a:hover {
  color: #a0cfff;
}
.about-body .collapse:deep(.el-collapse-item__header) {
  height: 60px;
  border-radius: 6px;
  background-color: #d9ecff;
  color: #606266;
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  padding-left: 20px;
}
.about-body .collapse:deep(.el-collapse-item__wrap) {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #ecf5ff;
}
.about-body .collapse:deep(.el-collapse-item__content) {
  color: #606266;
  font-size: 16px;
  padding: 20px 40px;
}
.about-body .collapse:deep(.function) p {
  margin: 5px 0;
  margin-left: 50px;
}
.about-body .collapse:deep(.function) span {
  color: #969696;
}
.about-body .collapse:deep(.el-timeline-item__content) {
  width: 450px;
}
.about-body .collapse:deep(.version) .el-card {
  border-radius: 10px;
}
.about-body .collapse:deep(.version) .el-tag {
  margin-bottom: 10px;
}
.about-body .collapse:deep(.version) .tip {
  color: #969696;
  margin-top: 10px;
  margin-left: 40px;
  margin-bottom: 20px;
}
.about-body .collapse:deep(.version) p {
  color: #606266;
  margin: 0;
}
.about-body .collapse:deep(.bug) p {
  color: #969696;
  margin-top: 10px;
  margin-bottom: 0;
}
.about-body .collapse:deep(.technology) {
  display: flex;
  flex-flow: column wrap;
}
.about-body .collapse:deep(.technology) p {
  margin-top: 10px;
  margin-bottom: 20px;
}
.about-body .collapse:deep(.technology) span {
  color: #969696;
}
.about-body .collapse:deep(.technology) div {
  margin-left: 1px;
  margin-bottom: 10px;
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
.about-body .blog a {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}
.about-body .blog a:hover {
  color: #a0cfff;
}
.about-body .attention {
  margin-top: 30px;
}
.about-body .attention .title {
  font-size: 18px;
  font-weight: 600;
}
.about-footer p {
  margin-top: 0;
  margin-bottom: 8px;
}
.about-footer a {
  color: #969696;
  text-decoration: none;
}
.about-footer a:hover {
  color: #409eff;
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
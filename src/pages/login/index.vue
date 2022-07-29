<template>
  <div class="login">
    <div class="login-header"><img src="/images/logo.svg" /></div>
    <div class="login-body">
      <span class="title">密码登录</span>
      <el-form
        ref="formRef"
        class="form"
        :model="loginForm"
        :rules="rules"
        size="large"
        @keyup.enter.exact="login(formRef)"
      >
        <el-form-item class="form-item username" prop="username">
          <el-input
            class="input"
            v-model.trim="loginForm.username"
            maxlength="11"
            placeholder="请输入用户名"
            spellcheck="false"
            clearable
            @focus="formRef.clearValidate('username')"
          >
            <template #prefix>
              <icon-ep-user style="font-size: 17px" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item password" prop="password">
          <el-input
            class="input"
            v-model.trim="loginForm.password"
            type="password"
            maxlength="16"
            placeholder="请输入密码"
            spellcheck="false"
            show-password
            clearable
            @focus="formRef.clearValidate('password')"
          >
            <template #prefix>
              <icon-ep-lock style="font-size: 17px" />
            </template>
          </el-input>
        </el-form-item>
        <div class="form-options">
          <el-checkbox id="checkbox" v-model="loginForm.loginFree">
            7天内免登录
          </el-checkbox>
          <router-link to="/findPassword">忘记密码？</router-link>
        </div>
        <el-button
          class="form-submit"
          type="primary"
          :loading="loading"
          @click="login(formRef)"
        >
          {{ loading ? "登录中..." : "登 录" }}
        </el-button>
      </el-form>
      <p class="to-register">
        没有账号?
        <router-link to="/register">立即注册</router-link>
      </p>
      <p class="tip">
        登录即表示同意<a href="https://toollong.icu/about" target="_blank"
          >《用户协议》</a
        ><a href="https://toollong.icu/about" target="_blank">《隐私政策》</a>
      </p>
    </div>
    <div class="login-footer">
      <div class="about">
        <router-link to="/about" target="_blank">关于我们</router-link>
        <a @click="showQRCode = true">联系我们</a>
        <router-link to="/about" target="_blank">反馈建议</router-link>
      </div>
      <p>Copyright © 2022 toollong. All Rights Reserved.</p>
      <a href="https://beian.miit.gov.cn/" target="_blank">
        鲁ICP备2022024710号-1
      </a>
    </div>
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="70"
      shapeType="circle"
      :particleSize="5"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.7"
      :linesDistance="150"
      :moveSpeed="6"
      :hoverEffect="true"
      hoverMode="repulse"
      :clickEffect="true"
      clickMode="push"
    />
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
    <el-dialog
      v-model="showVerification"
      title="请先完成安全验证"
      width="20%"
      top="30vh"
      destroy-on-close
    >
      <slide-verify
        ref="verifyRef"
        :l="50"
        :r="10"
        :w="343"
        :h="180"
        slider-text="向右拖动滑块完成拼图"
        :imgs="images"
        @again="onAgain"
        @fail="onFail"
        @success="onSuccess"
      />
      <div style="color: green">{{ successMsg }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { reqLogin } from "@/api";
import SlideVerify from "vue3-slide-verify";

export default {
  name: "Login",
  components: {
    SlideVerify,
  },
  setup() {
    const router = useRouter();

    const formRef = ref();
    const loading = ref(false);
    const loginForm = reactive({
      username: "",
      password: "",
      loginFree: false,
    });
    const rules = reactive({
      username: [
        { required: true, message: "你还没有输入用户名！", trigger: "submit" },
      ],
      password: [
        { required: true, message: "你还没有输入密码！", trigger: "submit" },
      ],
    });
    const login = async (formEl) => {
      if (!formEl) return;
      await formEl.validateField("username", (valid) => {
        if (valid) {
          formEl.validateField("password", (valid) => {
            if (valid) {
              showVerification.value = true;
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    };

    const showQRCode = ref(false);
    const showVerification = ref(false);
    const verifyRef = ref();
    const successMsg = ref("");
    const onAgain = () => {
      ElMessage.error("检测到非人为操作，请重试！");
      setTimeout(() => {
        verifyRef.value.refresh();
      }, 1000);
    };
    const onFail = () => {
      ElMessage.error("验证未通过，请重试！");
    };
    const onSuccess = (time) => {
      successMsg.value = "验证通过，耗时 " + (time / 1000).toFixed(1) + " s";
      setTimeout(async () => {
        showVerification.value = false;
        successMsg.value = "";
        loading.value = true;
        let result = await reqLogin(loginForm);
        if (result.success) {
          router.push({ name: "home" });
          ElMessage.success("登录成功！");
        } else {
          ElMessage.error("登录失败，用户名或密码不正确！");
          loading.value = false;
        }
      }, 1000);
    };
    const images = [
      "/images/verify/image1.jpeg",
      "/images/verify/image2.jpeg",
      "/images/verify/image3.jpeg",
      "/images/verify/image4.jpeg",
      "/images/verify/image5.jpeg",
      "/images/verify/image6.jpeg",
      "/images/verify/image7.jpeg",
      "/images/verify/image8.jpeg",
    ];

    return {
      formRef,
      loading,
      loginForm,
      rules,
      login,
      showQRCode,
      showVerification,
      verifyRef,
      successMsg,
      onAgain,
      onFail,
      onSuccess,
      images,
    };
  },
};
</script>

<style scoped>
.login {
  height: 100vh;
  background: radial-gradient(at center, #0075c3, #000b61);
  overflow: hidden;
}
.login .login-header {
  width: 100px;
  height: 100px;
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  margin: auto;
  overflow: hidden;
}
.login .login-body {
  display: flex;
  width: 20%;
  height: 420px;
  flex-flow: column nowrap;
  align-items: center;
  border-radius: 10px;
  background-color: var(--color-white);
  color: #303133;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
}
.login .login-footer {
  width: 400px;
  color: #dcdfe6;
  text-align: center;
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  margin: auto;
  overflow: hidden;
}
.login-header img {
  width: 100px;
  height: 100px;
}
.login-body .title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 15px;
}
.login-body .form {
  width: 100%;
  padding: 20px 40px;
}
.login-body .form .form-item {
  margin-bottom: 26px;
}
.login-body .form .form-item.password {
  margin-bottom: 20px;
}
.login-body .form .form-item .input {
  height: 45px;
  font-size: 15px;
}
.login-body .form .form-options {
  display: flex;
  height: 25px;
  justify-content: space-between;
  align-items: center;
  padding-left: 2px;
  margin: 15px 0;
}
.login-body .form .form-options a {
  color: #0a80ff;
  text-decoration: none;
}
.login-body .form .form-options a:hover {
  color: #79bbff;
}
.login-body .form .form-submit {
  width: 100%;
  font-size: 15px;
}
.login-body .to-register {
  color: #969696;
  margin-top: 20px;
  margin-bottom: 20px;
}
.login-body .to-register a {
  color: #0a80ff;
  text-decoration: none;
}
.login-body .to-register a:hover {
  color: #79bbff;
}
.login-body .tip {
  color: #969696;
  margin-top: 0;
}
.login-body .tip a {
  color: #969696;
  text-decoration: none;
}
.login-body .tip a:hover {
  color: #0a80ff;
}
.login-footer .about {
  font-size: 16px;
  margin-bottom: 10px;
}
.login-footer .about a {
  margin-right: 20px;
  cursor: pointer;
}
.login-footer P {
  margin-bottom: 8px;
}
.login-footer a {
  color: #dcdfe6;
  text-decoration: none;
}
.login-footer a:hover {
  color: #409eff;
}
.contact {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding-bottom: 20px;
}
.contact .tip {
  font-size: 18px;
  color: var(--text-color-secondary);
  margin-top: 0;
  margin-bottom: 10px;
}
.el-input {
  --el-input-text-color: #606266;
  --el-input-border: 1px solid #dcdfe6;
  --el-input-hover-border: #c0c4cc;
  --el-input-focus-border: #0a80ff;
  --el-input-transparent-border: 0 0 0 1px transparent inset;
  --el-input-border-color: #dcdfe6;
  --el-input-border-radius: 4px;
  --el-input-bg-color: #ffffff;
  --el-input-icon-color: #909399;
  --el-input-placeholder-color: #909399;
  --el-input-hover-border-color: #c0c4cc;
  --el-input-clear-hover-color: #909399;
  --el-input-focus-border-color: #0a80ff;
}
.el-button--primary {
  --el-button-bg-color: #0a80ff;
  --el-button-border-color: #0a80ff;
  --el-button-hover-link-text-color: #a0cfff;
  --el-button-hover-bg-color: #409eff;
  --el-button-hover-border-color: #409eff;
  --el-button-active-bg-color: #337ecc;
  --el-button-active-border-color: #337ecc;
  --el-button-disabled-bg-color: #a0cfff;
  --el-button-disabled-border-color: #a0cfff;
}
.el-checkbox {
  --el-checkbox-text-color: #969696;
  --el-checkbox-bg-color: #ffffff;
  --el-checkbox-input-border: 1px solid #c0c4cc;
  --el-checkbox-checked-text-color: #0a80ff;
  --el-checkbox-checked-input-border-color: #0a80ff;
  --el-checkbox-checked-bg-color: #0a80ff;
  --el-checkbox-input-border-color-hover: #0a80ff;
}
</style>
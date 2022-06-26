<template>
  <div class="login">
    <div class="login-header">EasyChat</div>
    <div class="login-body">
      <span class="title">密码登录</span>
      <el-form
        ref="formRef"
        class="form"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        size="large"
      >
        <el-form-item class="form-item" prop="username">
          <span class="label">用户名</span>
          <el-input
            v-model.trim="loginForm.username"
            maxlength="11"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <icon-ep-user style="font-size: 17px" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="password">
          <span class="label">密码</span>
          <el-input
            v-model.trim="loginForm.password"
            type="password"
            maxlength="16"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <icon-ep-lock style="font-size: 17px" />
            </template>
          </el-input>
        </el-form-item>
        <div class="form-options">
          <router-link to="/password">忘记密码</router-link>
        </div>
        <el-button
          class="form-submit"
          type="primary"
          :loading="loading"
          @click="login(formRef)"
        >
          {{ loading ? "登录中..." : "登录" }}
        </el-button>
      </el-form>
      <p>
        没有账号?
        <router-link to="/register">立即注册</router-link>
      </p>
      <p>
        登录即表示同意<a style="color: #969696">《用户协议》</a>
        <a style="color: #969696">《隐私政策》</a>
      </p>
    </div>
    <div class="login-footer">
      <p>© 2022 EasyChat. Crafted with by toollong</p>
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
import { setCookie } from "@/utils/cookie";

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
    });
    const rules = reactive({
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    });
    const login = async (formEl) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          showVerification.value = true;
        } else {
          return false;
        }
      });
    };

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
        setTimeout(() => {
          setCookie("uid", "20000000001", 300);
          ElMessage.success("登录成功！");
          router.push({ name: "home" });
          loading.value = false;
        }, 1000);
        // let result = await reqLogin(loginForm);
        // if (result.code === 200) {
        //   ElMessage.success("登录成功！");
        //   router.push({ name: "home" });
        // } else {
        //   ElMessage.error("登录失败，用户名或密码不正确！");
        // }
        // loading.value = false;
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
      "/images/verify/image9.jpeg",
    ];

    return {
      formRef,
      loading,
      loginForm,
      rules,
      login,
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
  width: 200px;
  height: 100px;
  font-size: 40px;
  color: var(--color-white);
  text-align: center;
  position: absolute;
  top: -60%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
}
.login .login-body {
  display: flex;
  width: 20%;
  height: 430px;
  flex-flow: column nowrap;
  align-items: center;
  border-radius: 10px;
  background-color: var(--color-white);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
}
.login .login-footer {
  width: 400px;
  height: 50px;
  color: var(--color-white);
  text-align: center;
  position: absolute;
  top: 70%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
}
.login-body .title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
}
.login-body .form {
  width: 100%;
  padding: 20px 40px;
}
.login-body .form .form-item {
  margin-bottom: 6px;
}
.login-body .form .form-item .label {
  font-size: 15px;
  color: #606266;
}
.login-body .form .form-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;
}
.login-body .form .form-options a {
  color: #606266;
  text-decoration: none;
}
.login-body .form .form-options a:hover {
  color: #409eff;
}
.login-body .form .form-submit {
  width: 100%;
  margin-top: 10px;
}
.login-body p {
  color: #969696;
  margin-top: 0;
  margin-bottom: 16px;
}
.login-body p a {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}
.login-body p a:hover {
  color: #79bbff;
}
</style>
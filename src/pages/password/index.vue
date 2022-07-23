<template>
  <div class="password">
    <div class="password-header"><img src="/images/logo.svg" /></div>
    <div class="password-body">
      <div class="title">找回密码</div>
      <div class="content">
        <el-steps
          :active="active"
          process-status="finish"
          finish-status="success"
          simple
        >
          <el-step title="输入用户名" />
          <el-step title="身份验证" />
          <el-step title="设置新密码" />
        </el-steps>
        <div class="step-content">
          <el-form
            ref="firstFormRef"
            class="first-form"
            v-show="active === 0"
            :model="firstForm"
            :rules="firstRules"
            size="large"
            hide-required-asterisk
            @submit.prevent
          >
            <p>请输入要重置密码的用户名</p>
            <el-form-item prop="username">
              <el-input
                class="input"
                v-model.trim="firstForm.username"
                placeholder="用户名"
                spellcheck="false"
                clearable
                @focus="firstFormRef.clearValidate('username')"
              />
            </el-form-item>
            <el-button
              class="form-submit"
              type="primary"
              @click="toSecondStep(firstFormRef)"
            >
              下一步
            </el-button>
          </el-form>
          <el-form
            ref="secondFormRef"
            class="second-form"
            v-show="active === 1"
            :model="secondForm"
            :rules="secondRules"
            size="large"
            hide-required-asterisk
          >
            <el-alert :closable="false" center>
              为了保护你的帐号安全，需要验证你的身份，验证通过后即可找回你的密码。
            </el-alert>
            <p>
              请填写完整的邮箱
              {{ encryptEmail(user.email) }} 以验证身份
            </p>
            <el-form-item class="form-item" prop="email">
              <el-input
                class="input"
                v-model.trim="secondForm.email"
                maxlength="50"
                placeholder="请输入完整的邮箱地址"
                spellcheck="false"
                clearable
                @focus="secondFormRef.clearValidate('email')"
              />
            </el-form-item>
            <el-form-item class="form-item" prop="verifyCode">
              <el-input
                class="input verify"
                v-model.trim="secondForm.verifyCode"
                placeholder="请输入验证码"
                spellcheck="false"
                clearable
                @focus="secondFormRef.clearValidate('verifyCode')"
              />
              <el-button
                class="button"
                type="primary"
                :disabled="showCount"
                plain
                @click="sendVerifyCode"
              >
                <span v-show="!showCount">发送验证码</span>
                <span v-show="showCount">重新发送({{ count }}s)</span>
              </el-button>
            </el-form-item>
            <el-button
              class="form-submit"
              type="primary"
              @click="toThirdStep(secondFormRef)"
            >
              下一步
            </el-button>
          </el-form>
          <el-form
            ref="thirdFormRef"
            class="third-form"
            v-show="active === 2"
            :model="thirdForm"
            :rules="thirdRules"
            size="large"
            hide-required-asterisk
          >
            <el-alert class="tip" :closable="false">
              密码由8~16位字母、数字或特殊符号 (~!@#$%^&*?_.)
              组成，需至少包含两种以上字符
            </el-alert>
            <el-form-item class="form-item" prop="newPassword">
              <el-input
                class="input"
                type="password"
                v-model.trim="thirdForm.newPassword"
                placeholder="请输入新密码"
                spellcheck="false"
                show-password
                clearable
                @focus="thirdFormRef.clearValidate('newPassword')"
              />
            </el-form-item>
            <el-form-item class="form-item" prop="checkPassword">
              <el-input
                class="input"
                type="password"
                v-model.trim="thirdForm.checkPassword"
                placeholder="请再次输入新密码"
                spellcheck="false"
                show-password
                clearable
                @focus="thirdFormRef.clearValidate('checkPassword')"
              />
            </el-form-item>
            <el-button
              class="form-submit"
              type="primary"
              @click="resetPassword(thirdFormRef)"
            >
              确定
            </el-button>
          </el-form>
          <el-result class="result" v-show="active === 3" icon="success">
            <template #title>
              <span class="message">密码重置成功</span>
            </template>
            <template #extra>
              <router-link to="/login">返回登录</router-link>
            </template>
          </el-result>
        </div>
      </div>
    </div>
    <div class="password-footer">
      <p>Copyright © 2022 EasyChat. Crafted with by toollong</p>
    </div>
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
import { ElMessage } from "element-plus";
import {
  reqChangePassword,
  reqSendCode,
  reqValidateCode,
  reqValidatePassword,
  reqValidateUsername,
} from "@/api";
import { encryptEmail } from "@/utils/encrypt";
import SlideVerify from "vue3-slide-verify";

export default {
  name: "Password",
  components: {
    SlideVerify,
  },
  setup() {
    const active = ref(0);
    const user = reactive({ userId: "", email: "" });

    const firstFormRef = ref();
    const firstForm = reactive({ username: "" });
    const firstRules = reactive({
      username: [
        { required: true, message: "用户名不能为空！", trigger: "submit" },
        {
          pattern: /^[a-zA-Z](?!.*?_$)[a-zA-Z0-9_]{5,10}$/,
          message: "用户名输入错误，请修改后重试！",
          trigger: "submit",
        },
      ],
    });
    const toSecondStep = async (formEl) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          showVerification.value = true;
        } else {
          return false;
        }
      });
    };

    const secondFormRef = ref();
    const secondForm = reactive({ email: "", verifyCode: "" });
    const validateEmail = (rule, value, callback) => {
      let pattern = new RegExp(
        /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      );
      if (value === "" || !pattern.test(value)) {
        callback(new Error("请填写正确的邮箱地址！"));
      } else if (value !== user.email) {
        callback(new Error("邮箱验证错误！"));
      } else {
        callback();
      }
    };
    const validateVerifyCode = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写验证码！"));
      } else {
        let result = await reqValidateCode({
          email: secondForm.email,
          verifyCode: value,
        });
        if (result.success) {
          callback();
        } else {
          callback(new Error("验证码错误，请重新填写！"));
        }
      }
    };
    const secondRules = reactive({
      email: [{ validator: validateEmail, trigger: "submit" }],
      verifyCode: [{ validator: validateVerifyCode, trigger: "submit" }],
    });
    const toThirdStep = async (formEl) => {
      if (!formEl) return;
      await formEl.validateField("email", (valid) => {
        if (valid) {
          formEl.validateField("verifyCode", (valid) => {
            if (valid) {
              active.value = 2;
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    };

    const thirdFormRef = ref();
    const thirdForm = reactive({ newPassword: "", checkPassword: "" });
    const validateNewPassword = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空！"));
      } else {
        let pattern = new RegExp(
          /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?()_.]+)$)^[\w~!@#$%^&*?()_.]{8,16}$/
        );
        if (!pattern.test(value)) {
          callback(new Error("密码格式错误，请修改后重试！"));
        } else {
          let result = await reqValidatePassword({
            userId: user.userId,
            password: value,
          });
          if (result.success) {
            callback(new Error("新密码不能与原密码相同！"));
          } else {
            callback();
          }
        }
      }
    };
    const validateCheckPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码！"));
      } else if (value !== thirdForm.newPassword) {
        callback(new Error("两次输入的密码不一致！"));
      } else {
        callback();
      }
    };
    const thirdRules = reactive({
      newPassword: [{ validator: validateNewPassword, trigger: "submit" }],
      checkPassword: [{ validator: validateCheckPassword, trigger: "submit" }],
    });
    const resetPassword = async (formEl) => {
      if (!formEl) return;
      await formEl.validateField("newPassword", (valid) => {
        if (valid) {
          formEl.validateField("checkPassword", async (valid) => {
            if (valid) {
              active.value = 3;
              // let result = await reqChangePassword({
              //   userId: user.userId,
              //   newPassword: thirdForm.newPassword,
              //   checkPassword: thirdForm.checkPassword,
              // });
              // if (result.success) {
              //   active.value = 3;
              // } else {
              //   ElMessage.error("网络异常，请重试！");
              // }
            } else {
              return false;
            }
          });
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
        let result = await reqValidateUsername({
          username: firstForm.username,
        });
        if (result.success) {
          user.userId = result.data.userId;
          user.email = result.data.email;
          active.value = 1;
        } else {
          ElMessage.error("用户名错误，请重新输入！");
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

    const showCount = ref(false);
    const count = ref(-1);
    const timer = ref();
    const sendVerifyCode = async () => {
      await secondFormRef.value.validateField("email", (valid) => {
        if (valid) {
          let value = getCookie("verify");
          if (value) {
            ElMessage.error("验证码发送频繁，请稍后重试！");
            return;
          }
          reqSendCode({ email: secondForm.email, type: 1 });
          if (!timer.value) {
            count.value = 60;
            showCount.value = true;
            timer.value = setInterval(() => {
              if (count.value > 0 && count.value <= 60) {
                count.value--;
              } else {
                showCount.value = false;
                clearInterval(timer.value);
                timer.value = null;
              }
            }, 1000);
          }
        } else {
          return false;
        }
      });
    };

    return {
      active,
      user,
      firstFormRef,
      firstForm,
      firstRules,
      toSecondStep,
      secondFormRef,
      secondForm,
      secondRules,
      toThirdStep,
      thirdFormRef,
      thirdForm,
      thirdRules,
      resetPassword,
      showVerification,
      verifyRef,
      successMsg,
      onAgain,
      onFail,
      onSuccess,
      images,
      showCount,
      count,
      sendVerifyCode,
      encryptEmail,
    };
  },
};
</script>

<style scoped>
.password {
  display: flex;
  height: 100vh;
  flex-flow: column nowrap;
  background-color: #eff8ff;
  color: #303133;
  overflow: hidden;
}
.password .password-header {
  margin: auto;
  margin-top: 50px;
  margin-bottom: 0;
}
.password .password-body {
  width: 800px;
  margin: 0 auto;
}
.password .password-footer {
  color: #969696;
  margin: auto;
  margin-bottom: 80px;
}
.password-header img {
  width: 80px;
  height: 80px;
}
.password-body .title {
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
}
.password-body .content {
  display: flex;
  height: 500px;
  flex-flow: column nowrap;
  background-color: var(--color-white);
  border-radius: 10px;
  box-shadow: 0 6px 32px -7px rgba(29, 102, 189, 0.16);
}
.password-body .content .step-content {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  flex: 1;
}
.password-body .content .step-content .input {
  height: 45px;
  font-size: 15px;
}
.password-body .first-form {
  width: 350px;
  margin-top: 100px;
}
.password-body .first-form p {
  font-size: 16px;
  color: #606266;
}
.password-body .first-form .form-submit {
  width: 100%;
  height: 45px;
  font-size: 16px;
  margin-top: 20px;
}
.password-body .second-form {
  margin-top: 30px;
}
.password-body .second-form p {
  font-size: 16px;
  color: #606266;
  margin-top: 30px;
  margin-left: 45px;
}
.password-body .second-form .form-item {
  width: 80%;
  margin-left: 45px;
  margin-bottom: 26px;
}
.password-body .second-form .form-item .input.verify {
  width: 68%;
}
.password-body .second-form .form-item .button {
  width: 115px;
  height: 45px;
  font-size: 15px;
}
.password-body .second-form .form-submit {
  width: 80%;
  height: 45px;
  font-size: 16px;
  margin-top: 10px;
  margin-left: 45px;
}
.password-body .third-form {
  width: 350px;
  margin-top: 50px;
}
.password-body .third-form .tip {
  margin-bottom: 20px;
}
.password-body .third-form .form-item {
  margin-bottom: 30px;
}
.password-body .third-form .form-submit {
  width: 100%;
  height: 45px;
  font-size: 17px;
  margin-top: 10px;
}
.password-body .result {
  height: 300px;
  margin-top: 50px;
}
.password-body .result .message {
  font-size: 26px;
}
.password-body .result a {
  font-size: 18px;
  color: #0a80ff;
  text-decoration: none;
}
.password-body .result a:hover {
  color: #79bbff;
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
  --el-input-icon-color: #a8abb2;
  --el-input-placeholder-color: #a8abb2;
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
.el-button--primary.is-plain {
  --el-button-text-color: #0a80ff;
  --el-button-bg-color: #ecf5ff;
  --el-button-border-color: #a0cfff;
}
.el-button--primary.is-plain.is-disabled {
  color: #a0cfff;
  background-color: #ecf5ff;
  border-color: #d9ecff;
}
.el-steps--simple {
  background: #f5f7fa;
}
.el-alert--info.is-light {
  background-color: #f4f4f5;
  color: #909399;
}
</style>
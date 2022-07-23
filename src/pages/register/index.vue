<template>
  <div class="register">
    <div class="register-header"><img src="/images/logo.svg" /></div>
    <div class="register-body">
      <el-form
        ref="formRef"
        class="form"
        :model="registerForm"
        :rules="rules"
        size="large"
        hide-required-asterisk
        status-icon
      >
        <span class="title">欢迎注册EasyChat</span>
        <el-form-item class="form-item" prop="username">
          <el-input
            class="input"
            v-model.trim="registerForm.username"
            placeholder="用户名"
            spellcheck="false"
            @focus="formRef.clearValidate('username')"
          />
          <span class="tip">
            6~11个字符，可使用字母、数字、下划线，需以字母开头
          </span>
        </el-form-item>
        <el-form-item class="form-item" prop="nickName">
          <el-input
            class="input"
            v-model.trim="registerForm.nickName"
            placeholder="昵称"
            spellcheck="false"
            @focus="formRef.clearValidate('nickName')"
          />
          <span class="tip">1~11个字符，可自由输入您的昵称</span>
        </el-form-item>
        <el-form-item class="form-item" prop="password">
          <el-input
            class="input"
            v-model.trim="registerForm.password"
            type="password"
            placeholder="密码"
            spellcheck="false"
            show-password
            @focus="formRef.clearValidate('password')"
          />
          <span class="tip">
            8~16个字符，可使用字母、数字、特殊符号 (~!@#$%^&*?_.)
            ，需包含其中至少两种
          </span>
        </el-form-item>
        <el-form-item class="form-item" prop="email">
          <el-input
            class="input"
            v-model.trim="registerForm.email"
            maxlength="50"
            placeholder="邮箱"
            spellcheck="false"
            @focus="hideVerifyCode"
          />
          <span class="tip">可通过该邮箱找回密码</span>
        </el-form-item>
        <el-form-item class="form-item" v-if="showVerifyCode" prop="verifyCode">
          <el-input
            class="input"
            v-model.trim="registerForm.verifyCode"
            placeholder="验证码"
            spellcheck="false"
            @focus="formRef.clearValidate('verifyCode')"
          >
            <template #suffix>
              <el-button
                class="button"
                type="primary"
                :disabled="showCount"
                link
                @click="getVerifyCode"
              >
                <span v-show="!showCount">获取验证码</span>
                <span v-show="showCount">重新获取({{ count }}s)</span>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item checkbox" prop="checkbox">
          <el-checkbox
            id="checkbox"
            v-model="registerForm.isAgree"
            @change="formRef.clearValidate('checkbox')"
          />
          <label for="checkbox">
            同意<a>《服务条款》</a>和<a>《隐私政策》</a>
          </label>
        </el-form-item>
        <el-form-item>
          <el-button
            class="form-submit"
            type="primary"
            :loading="loading"
            @click="register(formRef)"
          >
            {{ loading ? "注册中..." : "立即注册" }}
          </el-button>
          <span class="to-login">
            已有账号? <router-link to="/login">直接登录</router-link>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="register-footer">
      <p>Copyright © 2022 EasyChat. Crafted with by toollong</p>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  reqRegister,
  reqSendCode,
  reqValidateCode,
  reqValidateUsername,
} from "@/api";
import { getCookie } from "@/utils/cookie";

export default {
  name: "Register",
  setup() {
    const router = useRouter();

    const formRef = ref();
    const loading = ref(false);
    const registerForm = reactive({
      username: "",
      nickName: "",
      password: "",
      email: "",
      verifyCode: "",
      isAgree: false,
    });
    const validateUsername = async (rule, value, callback) => {
      let result = await reqValidateUsername({ username: value });
      if (result.success) {
        callback(new Error("该用户名已被占用或不可注册！"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写邮箱地址！"));
      } else {
        let pattern = new RegExp(
          /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        );
        if (!pattern.test(value)) {
          callback(new Error("邮箱格式不正确，请填写正确的邮箱地址！"));
        } else {
          showVerifyCode.value = true;
          callback();
        }
      }
    };
    const validateCheckbox = (rule, value, callback) => {
      if (!registerForm.isAgree) {
        callback(new Error("请先同意服务条款和隐私政策！"));
      } else {
        callback();
      }
    };
    const validateVerifyCode = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写验证码！"));
      } else {
        let result = await reqValidateCode({
          email: registerForm.email,
          verifyCode: value,
        });
        if (result.success) {
          callback();
        } else {
          callback(new Error("验证码错误，请重新填写！"));
        }
      }
    };
    const rules = reactive({
      username: [
        { required: true, message: "用户名不能为空！", trigger: "blur" },
        {
          min: 6,
          max: 11,
          message: "用户名长度应为6~11个字符！",
          trigger: "blur",
        },
        {
          pattern: /^[a-zA-Z0-9_]*$/,
          message: "只能输入字母、数字、下划线！",
          trigger: "blur",
        },
        {
          pattern: /^[a-zA-Z](?!.*?_$)[a-zA-Z0-9_]*$/,
          message: "必须以字母开头、以字母或数字结尾！",
          trigger: "blur",
        },
        { validator: validateUsername, trigger: "blur" },
      ],
      nickName: [
        { required: true, message: "昵称不能为空！", trigger: "blur" },
        { max: 11, message: "昵称长度应为1~11个字符！", trigger: "blur" },
      ],
      password: [
        { required: true, message: "密码不能为空！", trigger: "blur" },
        {
          min: 8,
          max: 16,
          message: "密码长度应为8~16个字符！",
          trigger: "blur",
        },
        {
          pattern: /^[a-zA-Z0-9~!@#$%^&*?()_.]*$/,
          message: "只能输入字母、数字、指定的特殊符号！",
          trigger: "blur",
        },
        {
          pattern:
            /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?()_.]+)$)^[\w~!@#$%^&*?()_.]{8,16}$/,
          message: "必须包含字母、数字、特殊符号中至少两种！",
          trigger: "blur",
        },
      ],
      email: [{ validator: validateEmail, trigger: "blur" }],
      checkbox: [{ validator: validateCheckbox, trigger: "submit" }],
      verifyCode: [{ validator: validateVerifyCode, trigger: "submit" }],
    });
    const register = async (formEl) => {
      if (!formEl) return;
      await formEl.validateField(
        ["username", "nickName", "password", "email"],
        (valid) => {
          if (valid) {
            formEl.validateField("checkbox", (valid) => {
              if (valid) {
                formEl.validateField("verifyCode", async (valid) => {
                  if (valid) {
                    loading.value = true;
                    let result = await reqRegister(registerForm);
                    if (result.success) {
                      ElMessage.success("注册成功！");
                      router.push({ name: "login" });
                    } else {
                      ElMessage.error("网络异常，请重试！");
                      loading.value = false;
                    }
                  } else {
                    return false;
                  }
                });
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        }
      );
    };

    const showVerifyCode = ref(false);
    const hideVerifyCode = () => {
      formRef.value.clearValidate("email");
      showVerifyCode.value = false;
    };
    const showCount = ref(false);
    const count = ref(-1);
    const timer = ref();
    const getVerifyCode = () => {
      let value = getCookie("verify");
      if (value) {
        ElMessage.error("验证码发送频繁，请稍后重试！");
        return;
      }
      reqSendCode({ email: registerForm.email, type: 0 });
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
    };

    return {
      formRef,
      loading,
      registerForm,
      rules,
      register,
      showVerifyCode,
      hideVerifyCode,
      showCount,
      count,
      getVerifyCode,
    };
  },
};
</script>

<style scoped>
.register {
  display: flex;
  height: 100vh;
  flex-flow: column nowrap;
  background-color: #eff8ff;
  color: #303133;
  overflow: hidden;
}
.register .register-header {
  margin: auto;
  margin-top: 50px;
  margin-bottom: 0;
}
.register .register-body {
  width: 1000px;
  height: 660px;
  padding: 20px;
  margin: 0 auto;
}
.register .register-footer {
  color: #969696;
  margin: auto;
  margin-bottom: 80px;
}
.register-header img {
  width: 80px;
  height: 80px;
}
.register-body .form {
  display: flex;
  flex-flow: column nowrap;
  margin-left: 260px;
}
.register-body .form .title {
  font-size: 30px;
  font-weight: 600;
  margin: 20px 0;
}
.register-body .form .form-item {
  margin-bottom: 30px;
}
.register-body .form .form-item.checkbox {
  height: 30px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.register-body .form .form-item .input {
  width: 360px;
  height: 50px;
  font-size: 16px;
}
.register-body .form .form-item .tip {
  width: 280px;
  color: #969696;
  margin-left: 20px;
  line-height: 1.5;
}
.register-body .form .form-item .button {
  font-size: 15px;
  padding: 0;
}
.register-body .form .form-item.checkbox label {
  color: #969696;
  margin-left: 10px;
}
.register-body .form .form-item.checkbox a {
  color: #606266;
  cursor: pointer;
}
.register-body .form .form-submit {
  width: 360px;
  font-size: 15px;
}
.register-body .form .to-login {
  color: #969696;
  margin-left: 22px;
}
.register-body .form .to-login a {
  color: #0a80ff;
  text-decoration: none;
}
.register-body .form .to-login a:hover {
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
.el-button--primary.is-link {
  --el-button-text-color: #0a80ff;
}
.el-button--primary.is-link.is-disabled {
  color: #a0cfff;
}
.el-checkbox {
  --el-checkbox-bg-color: #ffffff;
  --el-checkbox-input-border: 1px solid #c0c4cc;
  --el-checkbox-checked-text-color: #0a80ff;
  --el-checkbox-checked-input-border-color: #0a80ff;
  --el-checkbox-checked-bg-color: #0a80ff;
  --el-checkbox-input-border-color-hover: #0a80ff;
}
</style>
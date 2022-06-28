<template>
  <el-dialog
    v-model="isShow"
    title="修改密码"
    width="30%"
    draggable
    destroy-on-close
    @closed="close(formRef)"
  >
    <el-form
      ref="formRef"
      class="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="large"
      hide-required-asterisk
      status-icon
    >
      <el-form-item class="form-item" prop="oldPassword">
        <template #label>
          <span class="label">原密码</span>
        </template>
        <el-input
          type="password"
          v-model.trim="form.oldPassword"
          spellcheck="false"
          show-password
          @focus="formRef.clearValidate('oldPassword')"
        />
      </el-form-item>
      <el-form-item class="form-item" prop="newPassword">
        <template #label>
          <span class="label">新密码</span>
        </template>
        <el-input
          type="password"
          v-model.trim="form.newPassword"
          spellcheck="false"
          show-password
          @focus="formRef.clearValidate('newPassword')"
        />
      </el-form-item>
      <el-form-item class="form-item" prop="checkPassword">
        <template #label>
          <span class="label">确认密码</span>
        </template>
        <el-input
          type="password"
          v-model.trim="form.checkPassword"
          spellcheck="false"
          show-password
          @focus="formRef.clearValidate('checkPassword')"
        />
      </el-form-item>
      <el-form-item class="form-item">
        <el-button
          class="button"
          type="primary"
          :loading="loading"
          :disabled="loading"
          @click="resetPassword(formRef)"
        >
          {{ loading ? "修改中..." : "修改" }}
        </el-button>
        <el-button class="button" @click="resetForm(formRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { inject, reactive, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import { reqChangePassword } from "@/api";

export default {
  name: "PasswordReset",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const user = inject("user");

    const { show } = toRefs(props);
    const isShow = ref(false);
    const close = (formEl) => {
      emit("update:show", false);
      formEl.resetFields();
    };

    const formRef = ref();
    const loading = ref(false);
    const form = reactive({
      oldPassword: "",
      newPassword: "",
      checkPassword: "",
    });
    const validateOldPassword = (rule, value, callback) => {
      // 发送请求判断原密码是否正确
      if (value !== "n1234567") {
        callback(new Error("原密码不正确！"));
      } else {
        callback();
      }
    };
    const validateNewPassword = (rule, value, callback) => {
      if (value === form.oldPassword) {
        callback(new Error("新密码与原密码不能相同！"));
      } else {
        callback();
      }
    };
    const validateCheckPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码！"));
      } else if (value !== form.newPassword) {
        callback(new Error("两次输入的密码不一致！"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      oldPassword: [
        { required: true, message: "请输入原密码！", trigger: "blur" },
        { validator: validateOldPassword, trigger: "submit" },
      ],
      newPassword: [
        { required: true, message: "密码不能为空！", trigger: "blur" },
        {
          min: 8,
          max: 16,
          message: "密码长度应为8~16个字符！",
          trigger: "blur",
        },
        {
          pattern: /^[a-zA-Z0-9~!@#$%^&*?()_.]*$/,
          message: "只能输入字母、数字、特殊符号 (~!@#$%^&*?_.) ！",
          trigger: "blur",
        },
        {
          pattern:
            /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?()_.]+)$)^[\w~!@#$%^&*?()_.]{8,16}$/,
          message: "必须包含字母、数字、特殊符号中至少两种！",
          trigger: "blur",
        },
        { validator: validateNewPassword, trigger: "submit" },
      ],
      checkPassword: [{ validator: validateCheckPassword, trigger: "blur" }],
    });
    const resetPassword = async (formEl) => {
      if (!formEl) return;
      await formEl.validateField("oldPassword", (valid) => {
        if (valid) {
          formEl.validateField("newPassword", (valid) => {
            if (valid) {
              formEl.validateField("checkPassword", async (valid) => {
                if (valid) {
                  loading.value = true;
                  let result = await reqChangePassword({
                    userId: user.userId,
                    oldPassword: form.oldPassword,
                    newPassword: form.newPassword,
                    checkPassword: form.checkPassword,
                  });
                  if (result.code === 200) {
                    ElMessage.success({ message: "修改成功", showClose: true });
                  } else {
                    ElMessage.error({
                      message: "网络异常，请重试！",
                      showClose: true,
                    });
                  }
                  loading.value = false;
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
      });
    };
    const resetForm = (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    watch(show, () => {
      if (show.value === true) {
        isShow.value = true;
      }
    });

    return {
      isShow,
      close,
      formRef,
      loading,
      form,
      rules,
      resetPassword,
      resetForm,
    };
  },
};
</script>

<style scoped>
.form {
  padding: 20px 60px;
}
.form .form-item {
  margin-bottom: 30px;
}
.form .form-item .label {
  font-size: 16px;
}
.form .form-item .button {
  width: 40%;
  font-size: 15px;
}
</style>
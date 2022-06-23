<template>
  <el-dialog
    v-model="isShow"
    title="修改密码"
    width="40%"
    draggable
    destroy-on-close
    @closed="close(formRef)"
  >
    <div class="form">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="150px"
        size="large"
        status-icon
      >
        <el-form-item prop="oldPassword">
          <template #label>
            <span class="label">旧密码</span>
          </template>
          <el-input
            v-model.trim="form.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item prop="newPassword">
          <template #label>
            <span class="label">新密码</span>
          </template>
          <el-input
            v-model.trim="form.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item prop="checkPassword">
          <template #label>
            <span class="label">确认密码</span>
          </template>
          <el-input
            v-model.trim="form.checkPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="loading"
            @click="resetPassword(formRef)"
          >
            {{ loading ? "修改中..." : "修改" }}
          </el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else if (value.length < 8 || value.length > 16) {
        callback(new Error("密码由8-16位数字、字母或符号组成！"));
      } else {
        callback();
      }
    };
    const validateNewPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 8 || value.length > 16) {
        callback(new Error("密码由8-16位数字、字母或符号组成！"));
      } else {
        if (form.checkPassword !== "") {
          if (!formRef.value) return;
          formRef.value.validateField("checkPassword", () => null);
        }
        callback();
      }
    };
    const validateCheckPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== form.newPassword) {
        callback(new Error("两次输入的密码不一致！"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      oldPassword: [{ validator: validateOldPassword, trigger: "blur" }],
      newPassword: [{ validator: validateNewPassword, trigger: "blur" }],
      checkPassword: [{ validator: validateCheckPassword, trigger: "blur" }],
    });
    const resetPassword = async (formEl) => {
      if (!formEl) return;
      await formEl.validate(async (valid) => {
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
            loading.value = false;
          } else {
            ElMessage.error({
              message: "修改失败，旧密码不正确！",
              showClose: true,
            });
            loading.value = false;
          }
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
  width: 80%;
}
.form .label {
  font-size: 16px;
}
</style>
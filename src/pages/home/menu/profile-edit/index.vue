<template>
  <el-config-provider :locale="locale">
    <el-drawer
      v-model="isShow"
      direction="ltr"
      size="26%"
      :show-close="false"
      destroy-on-close
      @open="open"
      @closed="close(formRef)"
      append-to-body
    >
      <template #header="{ titleId, titleClass, close }">
        <div class="drawer-header">
          <div class="title">
            <icon-ep-edit />
            <span :id="titleId" :class="titleClass">编辑资料</span>
          </div>
          <div class="close">
            <icon-ep-close-bold @click="close" />
          </div>
        </div>
      </template>
      <el-form
        ref="formRef"
        class="form"
        :model="profile"
        :rules="rules"
        size="large"
        hide-required-asterisk
      >
        <el-form-item class="form-item" prop="nickName">
          <span class="label">昵称</span>
          <el-input
            class="input"
            v-model.trim="profile.nickName"
            spellcheck="false"
            clearable
            @focus="formRef.clearValidate('nickName')"
          >
            <template #prefix><icon-ep-user /></template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="gender">
          <span class="label">性别</span>
          <el-radio-group v-model="profile.gender" size="default">
            <el-radio-button :label="1">男</el-radio-button>
            <el-radio-button :label="0">女</el-radio-button>
            <el-radio-button :label="2">保密</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="form-item" prop="birthday">
          <span class="label">生日</span>
          <el-date-picker
            v-model="profile.birthday"
            :editable="false"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item class="form-item" prop="email">
          <span class="label">邮箱</span>
          <el-input
            class="input"
            v-model.trim="profile.email"
            maxlength="50"
            spellcheck="false"
            clearable
            @focus="formRef.clearValidate('email')"
          >
            <template #prefix><icon-ep-message /></template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="phone">
          <span class="label">手机号</span>
          <el-input
            class="input"
            v-model.trim="profile.phone"
            spellcheck="false"
            clearable
            @focus="formRef.clearValidate('phone')"
          >
            <template #prefix><icon-ep-phone /></template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="region">
          <span class="label">地区</span>
          <el-cascader
            v-model="profile.region"
            :options="regions"
            :props="{ value: 'name', label: 'name', children: 'city' }"
            separator="-"
            placeholder="请选择地区"
            filterable
            clearable
          />
        </el-form-item>
        <el-form-item class="form-item" prop="introduction">
          <span class="label">个人介绍</span>
          <el-input
            type="textarea"
            v-model="profile.introduction"
            maxlength="60"
            :rows="3"
            placeholder="用几句话介绍一下自己吧"
            resize="none"
            spellcheck="false"
            show-word-limit
          />
        </el-form-item>
        <el-button
          class="form-submit"
          type="primary"
          size="large"
          :loading="loading"
          :disabled="loading"
          @click="updateUserInfo(formRef)"
        >
          {{ loading ? "保存中..." : "保 存" }}
        </el-button>
      </el-form>
    </el-drawer>
  </el-config-provider>
</template>

<script>
import { inject, reactive, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import { mockGetUserInfo, reqEditUserInfo, reqGetUserInfo } from "@/api";
import { formatDate } from "@/utils/date";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import regions from "./regions.json";

export default {
  name: "ProfileEdit",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const user = inject("user");

    const { show } = toRefs(props);
    const isShow = ref(false);
    const open = async () => {
      // let result = await mockGetUserInfo();
      let result = await reqGetUserInfo({ id: user.userId });
      if (result.success) {
        profile.nickName = result.data.nickName;
        profile.gender = result.data.gender;
        profile.birthday = result.data.birthday;
        profile.email = result.data.email;
        profile.phone = result.data.phone;
        if (result.data.region) {
          profile.region = result.data.region.split(" ");
        }
        profile.introduction = result.data.introduction;
      }
    };
    const close = (formEl) => {
      emit("update:show", false);
      formEl.resetFields();
    };

    const formRef = ref();
    const loading = ref(false);
    const profile = reactive({
      nickName: "",
      gender: -1,
      birthday: "",
      email: "",
      phone: "",
      region: [],
      introduction: "",
    });
    const disabledDate = (date) => {
      return (
        formatDate(date, "YYYY-MM-DD") > formatDate(new Date(), "YYYY-MM-DD")
      );
    };
    const rules = reactive({
      nickName: [
        { required: true, message: "昵称不能为空！", trigger: "blur" },
        { max: 11, message: "昵称长度不能超过11个字符！", trigger: "blur" },
      ],
      email: [
        { required: true, message: "邮箱不能为空！", trigger: "blur" },
        {
          pattern:
            /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: "邮箱地址格式不正确！",
          trigger: "blur",
        },
      ],
      phone: [
        {
          pattern:
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          message: "手机号码格式不正确！",
          trigger: "blur",
        },
      ],
    });
    const updateUserInfo = async (formEl) => {
      if (!formEl) return;
      await formEl.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          let result = await reqEditUserInfo({
            userId: user.userId,
            nickName: profile.nickName,
            gender: profile.gender,
            birthday: profile.birthday,
            email: profile.email,
            phone: profile.phone,
            region:
              profile.region.length > 0
                ? profile.region[0] + " " + profile.region[1]
                : "",
            introduction: profile.introduction,
          });
          if (result.success) {
            ElMessage.success({ message: "保存成功", showClose: true });
            isShow.value = false;
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
    };

    watch(show, () => {
      if (show.value === true) {
        isShow.value = true;
      }
    });

    return {
      locale: zhCn,
      isShow,
      open,
      close,
      formRef,
      loading,
      profile,
      regions,
      disabledDate,
      rules,
      updateUserInfo,
    };
  },
};
</script>

<style scoped>
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--theme-color-light-2);
}
.drawer-header .title {
  display: flex;
  align-items: center;
}
.drawer-header span {
  font-size: 22px;
  color: var(--theme-color-light-2);
  margin-left: 5px;
}
.drawer-header .close {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.drawer-header .close:hover {
  color: var(--color-danger);
}
.form {
  padding: 0 60px;
}
.form .form-item {
  margin-bottom: 14px;
}
.form .form-item .label {
  width: 100%;
  font-size: 16px;
}
.form .form-item .input {
  height: 45px;
  font-size: 15px;
}
.form .form-submit {
  width: 80%;
  font-size: 16px;
  margin-top: 20px;
  margin-left: 25px;
}
</style>
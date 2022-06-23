<template>
  <el-config-provider :locale="locale">
    <el-drawer
      v-model="isShow"
      size="25%"
      :show-close="false"
      destroy-on-close
      @open="open"
      @closed="close(formRef)"
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
      <div class="form">
        <el-form
          ref="formRef"
          :model="profile"
          :rules="rules"
          label-position="top"
          hide-required-asterisk
        >
          <el-form-item prop="nickName">
            <template #label>
              <span class="label">昵称</span>
            </template>
            <el-input v-model.trim="profile.nickName" size="large" clearable>
              <template #suffix><icon-ep-user /></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="gender">
            <template #label>
              <span class="label">性别</span>
            </template>
            <el-radio-group v-model="profile.gender" size="large">
              <el-radio-button label="1">男</el-radio-button>
              <el-radio-button label="0">女</el-radio-button>
              <el-radio-button label="2">保密</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="birthday">
            <template #label>
              <span class="label">生日</span>
            </template>
            <el-date-picker
              v-model="profile.birthday"
              :editable="false"
              placeholder="请选择日期"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item prop="email">
            <template #label>
              <span class="label">邮箱</span>
            </template>
            <el-input v-model.trim="profile.email" size="large" clearable>
              <template #suffix><icon-ep-message /></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <template #label>
              <span class="label">联系方式</span>
            </template>
            <el-input v-model.trim="profile.phone" size="large" clearable>
              <template #suffix><icon-ep-phone /></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="region">
            <template #label>
              <span class="label">地区</span>
            </template>
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
          <el-form-item prop="introduction">
            <template #label>
              <span class="label">个人介绍</span>
            </template>
            <el-input
              type="textarea"
              v-model.trim="profile.introduction"
              maxlength="60"
              :rows="3"
              placeholder="用几句话介绍一下自己吧"
              resize="none"
              show-word-limit
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              :disabled="loading"
              size="large"
              @click="updateUserInfo(formRef)"
            >
              {{ loading ? "保存中..." : "保存" }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </el-config-provider>
</template>

<script>
import { inject, reactive, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import { mockGetUserInfo, reqEditUserInfo, reqGetUserInfo } from "@/api";
import moment from "moment";
import regions from "./regions.json";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

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
      let result = await mockGetUserInfo();
      // let result = await reqGetUserInfo(user.userId);
      if (result.code === 200) {
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
      gender: "",
      birthday: "",
      email: "",
      phone: "",
      region: [],
      introduction: "",
    });
    const disabledDate = (date) => {
      return moment(date).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD");
    };
    const rules = reactive({
      nickName: [
        { required: true, message: "请输入您的昵称", trigger: "blur" },
        { max: 11, message: "昵称长度不能超过11个字符！", trigger: "blur" },
      ],
      birthday: [
        {
          type: "date",
          required: true,
          message: "请选择您的生日",
          trigger: "change",
        },
      ],
      email: [
        { required: true, message: "请输入您的邮箱", trigger: "blur" },
        { max: 30, message: "邮箱长度不能超过30个字符！", trigger: "blur" },
      ],
      phone: [
        { required: true, message: "请输入您的联系方式", trigger: "blur" },
        { max: 20, message: "号码长度不能超过20个字符！", trigger: "blur" },
      ],
      region: [
        { required: true, message: "请选择您所在的地区", trigger: "change" },
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
            region: profile.region[0] + " " + profile.region[1],
            introduction: profile.introduction,
          });
          if (result.code === 200) {
            ElMessage.success({ message: "保存成功", showClose: true });
            loading.value = false;
          } else {
            ElMessage.error({ message: "保存失败", showClose: true });
            loading.value = false;
          }
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
  display: flex;
  width: 80%;
  flex-flow: column nowrap;
  margin: auto;
}
.form .label {
  font-size: 16px;
}
</style>
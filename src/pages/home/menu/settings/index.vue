<template>
  <el-drawer
    v-model="isShow"
    size="26%"
    direction="ltr"
    :show-close="false"
    destroy-on-close
    @open="open"
    @closed="close"
  >
    <template #header="{ titleId, titleClass, close }">
      <div class="drawer-header">
        <div class="title">
          <icon-ep-setting />
          <span :id="titleId" :class="titleClass">设置</span>
        </div>
        <div class="close">
          <icon-ep-close-bold @click="close" />
        </div>
      </div>
    </template>
    <div class="settings">
      <div class="avatar">
        <span class="label">头像</span>
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          action="/api/user/user/changeAvatar"
          :data="{ id: user.userId }"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="checkImage"
          :on-success="uploadSucceed"
          :on-error="uploadFailed"
        >
          <el-image class="image" :src="avatarUrl" />
        </el-upload>
        <el-button
          class="avatar-submit"
          v-if="avatarUrl !== user.avatar"
          :loading="avatarLoading"
          :disabled="avatarLoading"
          plain
          @click="saveAvatar"
        >
          {{ avatarLoading ? "保存中..." : "保存" }}
        </el-button>
      </div>
      <div class="status">
        <span class="label">状态</span>
        <el-switch
          v-model="online"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="在线"
          inactive-text="隐身"
          :loading="statusLoading"
          :before-change="changeStatus"
          size="default"
        />
      </div>
      <div class="tags">
        <span class="label">标签</span>
        <el-space wrap>
          <el-tag
            class="tags-item"
            v-for="tag in tags"
            :key="tag"
            size="large"
            effect="plain"
            @close="removeTag(tag)"
            closable
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="tags-input"
            ref="inputRef"
            v-if="inputVisible"
            v-model.trim="inputValue"
            spellcheck="false"
            @keyup.enter="addTag"
            @blur="addTag"
          />
          <el-button class="tags-input" v-else @click="showInput">
            + 添加标签
          </el-button>
        </el-space>
      </div>
      <div class="password">
        <el-button type="primary" @click="showPasswordReset = true">
          修改密码
        </el-button>
      </div>
    </div>
    <PasswordReset v-model:show="showPasswordReset" />
  </el-drawer>
</template>

<script>
import { inject, nextTick, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import PasswordReset from "@/pages/home/menu/settings/password-reset";

export default {
  name: "Settings",
  components: {
    PasswordReset,
  },
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const user = inject("user");
    const reload = inject("reload");

    const { show } = toRefs(props);
    const isShow = ref(false);
    const open = () => {
      avatarUrl.value = user.avatar;
      online.value = true;
      tags.value = ["程序员", "时间管理大师"];
    };
    const close = () => {
      emit("update:show", false);
    };

    const uploadRef = ref();
    const avatarUrl = ref("");
    const avatarLoading = ref(false);
    const checkImage = (uploadFile) => {
      if (
        uploadFile.raw.type !== "image/jpeg" &&
        uploadFile.raw.type !== "image/png"
      ) {
        ElMessage.error("上传的图片仅支持 JPG 或 PNG 格式！");
        return;
      }
      if (uploadFile.size / 1024 / 1024 > 2) {
        ElMessage.error("上传的图片大小不能超过 2M ！");
        return;
      }
      avatarUrl.value = URL.createObjectURL(uploadFile.raw);
    };
    const uploadSucceed = () => {
      ElMessage.success({ message: "保存成功", showClose: true });
      reload();
    };
    const uploadFailed = () => {
      ElMessage.error({ message: "网络异常", showClose: true });
      avatarLoading.value = false;
    };
    const saveAvatar = () => {
      avatarLoading.value = true;
      uploadRef.value.submit();
    };

    const online = ref(true);
    const statusLoading = ref(false);
    const changeStatus = () => {
      statusLoading.value = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          ElMessage.success({ message: "设置成功", showClose: true });
          statusLoading.value = false;
          return resolve(true);
        }, 1000);
      });
    };

    const tags = ref([]);
    const inputRef = ref();
    const inputValue = ref("");
    const inputVisible = ref(false);
    const removeTag = (tag) => {
      tags.value.splice(tags.value.indexOf(tag), 1);
    };
    const showInput = () => {
      inputVisible.value = true;
      nextTick(() => {
        inputRef.value.input.focus();
      });
    };
    const addTag = () => {
      if (inputValue.value) {
        if (tags.value.length > 2) {
          ElMessage.warning({ message: "最多设置三个标签！", showClose: true });
        } else {
          let index = tags.value.findIndex((tag) => tag === inputValue.value);
          if (index < 0) {
            tags.value.push(inputValue.value);
            ElMessage.success({ message: "添加成功", showClose: true });
          } else {
            ElMessage.warning({ message: "重复的标签！", showClose: true });
          }
        }
      }
      inputVisible.value = false;
      inputValue.value = "";
    };

    const showPasswordReset = ref(false);

    watch(show, () => {
      if (show.value === true) {
        isShow.value = true;
      }
    });

    return {
      user,
      isShow,
      open,
      close,
      uploadRef,
      avatarUrl,
      avatarLoading,
      checkImage,
      uploadSucceed,
      uploadFailed,
      saveAvatar,
      online,
      statusLoading,
      changeStatus,
      tags,
      inputRef,
      inputValue,
      inputVisible,
      removeTag,
      showInput,
      addTag,
      showPasswordReset,
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
.settings {
  display: flex;
  flex-flow: column nowrap;
  font-size: 16px;
  padding: 20px 60px;
}
.settings .label {
  margin-right: 40px;
}
.avatar {
  display: flex;
  align-items: center;
}
.avatar .avatar-uploader {
  height: 100px;
  width: 100px;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
}
.avatar .avatar-uploader:hover {
  border-color: var(--color-primary);
}
.avatar .image {
  display: block;
  height: 100px;
  width: 100px;
}
.avatar .avatar-submit {
  align-self: flex-end;
  margin-left: 10px;
}
.status {
  display: flex;
  align-items: center;
  margin-top: 30px;
}
.tags {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-top: 30px;
}
.tags .tags-item {
  margin-top: 5px;
}
.tags .tags-input {
  margin-top: 5px;
  width: 100px;
  height: 30px;
}
.password {
  margin-top: 100px;
}
</style>
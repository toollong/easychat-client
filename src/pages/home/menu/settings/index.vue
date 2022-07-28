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
          class="avatar-uploader"
          action="#"
          :file-list="fileList"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="checkImage"
        >
          <el-image
            class="image"
            :src="avatarUrl"
            fit="cover"
            @error="() => true"
          >
            <template #error>
              <img
                style="height: 100px"
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </template>
          </el-image>
        </el-upload>
        <el-button class="avatar-button" plain @click="showAvatar = true">
          预览
        </el-button>
        <el-button
          class="avatar-button"
          v-if="avatarUrl !== user.avatar"
          :loading="avatarLoading"
          :disabled="avatarLoading"
          plain
          @click="saveAvatar"
        >
          保存
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
            maxlength="10"
            spellcheck="false"
            @keydown.enter="addTag"
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
    <el-dialog v-model="showAvatar" width="30%" destroy-on-close>
      <div class="preview">
        <el-image :src="avatarUrl" fit="contain" />
      </div>
    </el-dialog>
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
    <template #footer>
      <div class="drawer-footer">
        <router-link to="/about" target="_blank">
          <el-button class="button" type="info" link>关于我们</el-button>
        </router-link>
        <el-button class="button" type="info" link @click="showQRCode = true">
          联系我们
        </el-button>
        <router-link to="/about" target="_blank">
          <el-button class="button" type="info" link>反馈建议</el-button>
        </router-link>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import { getCurrentInstance, inject, nextTick, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  reqAddTag,
  reqChangeAvatar,
  reqGetUserInfo,
  reqRemoveTag,
} from "@/api";
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
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const user = inject("user");
    const reload = inject("reload");

    const { show } = toRefs(props);
    const isShow = ref(false);
    const open = async () => {
      let result = await reqGetUserInfo({ id: user.userId });
      if (result.success) {
        avatarUrl.value =
          "http://toollong.icu:9000/easychat" + result.data.avatar;
        online.value = result.data.status === 1 ? true : false;
        tags.value = result.data.tags ? result.data.tags.split(",") : [];
      }
    };
    const close = () => {
      emit("update:show", false);
    };

    const fileList = ref([]);
    const avatarUrl = ref("");
    const avatarLoading = ref(false);
    const checkImage = (file, files) => {
      if (file.raw.type !== "image/jpeg" && file.raw.type !== "image/png") {
        ElMessage.warning("上传的图片仅支持 JPG 或 PNG 格式！");
        return;
      }
      if (file.size / 1024 / 1024 > 2) {
        ElMessage.warning("上传的图片大小不能超过 2M ！");
        return;
      }
      avatarUrl.value = URL.createObjectURL(file.raw);
      fileList.value = files;
    };
    const saveAvatar = async () => {
      if (fileList.value.length > 0) {
        avatarLoading.value = true;
        let formData = new FormData();
        fileList.value.forEach((file) => {
          formData.append("file", file.raw);
        });
        formData.append("id", user.userId);
        let result = await reqChangeAvatar(formData);
        if (result.success) {
          ElMessage.success({ message: "保存成功", showClose: true });
          reload();
        } else {
          ElMessage.error({ message: "网络异常", showClose: true });
          avatarLoading.value = false;
        }
      }
    };

    const online = ref(true);
    const statusLoading = ref(false);
    const changeStatus = () => {
      statusLoading.value = true;
      return new Promise((resolve) => {
        socket.emit(
          "changeStatus",
          user.userId,
          online.value === true ? 0 : 1,
          (response) => {
            if (response) {
              ElMessage.success({ message: "设置成功", showClose: true });
              statusLoading.value = false;
              return resolve(true);
            } else {
              ElMessage.error({ message: "网络异常", showClose: true });
              statusLoading.value = false;
              return resolve(false);
            }
          }
        );
      });
    };

    const tags = ref([]);
    const inputRef = ref();
    const inputValue = ref("");
    const inputVisible = ref(false);
    const showInput = () => {
      inputVisible.value = true;
      nextTick(() => {
        inputRef.value.input.focus();
      });
    };
    const addTag = async () => {
      if (inputValue.value) {
        if (inputValue.value.match(new RegExp("^[\u4e00-\u9fa50-9A-Za-z]+$"))) {
          if (tags.value.length > 2) {
            ElMessage.warning({
              message: "最多设置三个标签！",
              showClose: true,
            });
          } else {
            let index = tags.value.findIndex((tag) => tag === inputValue.value);
            if (index < 0) {
              let result = await reqAddTag({
                userId: user.userId,
                tag: inputValue.value,
              });
              if (result.success) {
                tags.value.push(inputValue.value);
                ElMessage.success({ message: "添加成功", showClose: true });
              } else {
                ElMessage.error({ message: "网络异常", showClose: true });
              }
            } else {
              ElMessage.warning({ message: "重复的标签！", showClose: true });
            }
          }
        } else {
          ElMessage.warning({
            message: "只能输入汉字、字母和数字！",
            showClose: true,
          });
        }
      }
      inputVisible.value = false;
      inputValue.value = "";
    };
    const removeTag = async (tag) => {
      let result = await reqRemoveTag({ userId: user.userId, tag: tag });
      if (result.success) {
        tags.value.splice(tags.value.indexOf(tag), 1);
        ElMessage.success({ message: "删除成功", showClose: true });
      } else {
        ElMessage.error({ message: "网络异常", showClose: true });
      }
    };

    const showPasswordReset = ref(false);
    const showAvatar = ref(false);
    const showQRCode = ref(false);
    const randomNum = ref(0);

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
      fileList,
      avatarUrl,
      avatarLoading,
      checkImage,
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
      showAvatar,
      showQRCode,
      randomNum,
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
.avatar .avatar-button {
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
  flex-flow: column wrap;
  margin-top: 30px;
}
.tags .tags-item {
  margin-top: 18px;
}
.tags .el-tag {
  font-size: 14px;
  padding-left: 16px;
}
.tags .tags-input {
  margin-top: 18px;
  width: 100px;
  height: 32px;
}
.password {
  margin-top: 60px;
}
.preview {
  display: flex;
  justify-content: center;
  padding: 0 10px;
  padding-top: 5px;
  padding-bottom: 15px;
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
.drawer-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.drawer-footer a {
  text-decoration: none;
}
.drawer-footer .button {
  font-size: 16px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
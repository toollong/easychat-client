<template>
  <div class="img-upload">
    <el-upload
      ref="uploadRef"
      action="#"
      multiple
      :file-list="fileList"
      list-type="picture-card"
      :auto-upload="false"
      :limit="5"
      :on-preview="previewPicture"
      :on-change="checkPicture"
    >
      <icon-ep-plus />
      <template #tip>
        <div class="el-upload__tip">
          注意：只支持 JPG 或 PNG 格式的图片，每张图片大小不能超过 2MB
          ，一次最多可发送五张图片。
        </div>
      </template>
    </el-upload>
    <el-button
      class="submit-button"
      v-if="fileList.length > 0"
      type="primary"
      :loading="loading"
      :disabled="loading"
      size="large"
      @click="sendPictures"
    >
      发送
    </el-button>
    <el-dialog v-model="dialogVisible" width="40%" destroy-on-close>
      <div class="dialog">
        <el-image :src="dialogImageUrl" fit="contain" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  ref,
  toRefs,
} from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { reqSavePictureMsg } from "@/api";
import { computeMinuteDiff, formatDate } from "@/utils/date";

export default {
  name: "ImgUpload",
  props: {
    friend: String,
    session: String,
    scrollbar: Object,
    chatBody: Object,
  },
  setup(props) {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const store = useStore();
    const user = inject("user");

    const { friend, session, scrollbar, chatBody } = toRefs(props);
    const chatList = computed(() => store.state.home.chatList);
    const chatHistoryList = computed(() => store.state.home.chatHistories);
    const uploadRef = ref();
    const fileList = ref([]);
    const previewPicture = (file) => {
      dialogImageUrl.value = file.url;
      dialogVisible.value = true;
    };
    const checkPicture = (file, files) => {
      if (file.raw.type !== "image/jpeg" && file.raw.type !== "image/png") {
        ElMessage.warning("上传的图片仅支持 JPG 或 PNG 格式！");
        uploadRef.value.handleRemove(file);
        return;
      }
      if (file.size / 1024 / 1024 > 2) {
        ElMessage.warning("上传的图片大小不能超过 2MB ！");
        uploadRef.value.handleRemove(file);
        return;
      }
      fileList.value = files;
    };

    const loading = ref(false);
    const sendPictures = async () => {
      if (fileList.value.length > 0) {
        loading.value = true;
        let lastMessage = chatHistoryList.value.slice(-1)[0];
        let currentTime = formatDate(new Date(), "YYYY-MM-DD HH:mm:ss");
        let showTime = 1;
        if (
          lastMessage &&
          computeMinuteDiff(lastMessage.createTime, currentTime) < 5
        ) {
          showTime = 0;
        }
        let message = {
          senderId: user.userId,
          receiverId: friend.value,
          sessionId: session.value,
          type: 1,
          content: "",
          createTime: currentTime,
          hasRead: 0,
          showTime: showTime,
        };
        let formData = new FormData();
        fileList.value.forEach((file) => {
          formData.append("file", file.raw);
        });
        formData.append("message", JSON.stringify(message));
        let result = await reqSavePictureMsg(formData);
        if (result.success) {
          if (result.data === null) {
            ElMessage.error({
              message: "你还不是他（她）的好友",
              showClose: true,
            });
            loading.value = false;
            return;
          }
          result.data.forEach((message, index) => {
            socket.emit("sendMsg", message, (response, msg) => {
              if (response) {
                if (index === 0 && msg === "offline") {
                  ElMessage.warning({ message: "对方不在线", showClose: true });
                }
                chatHistoryList.value.push(response);
                nextTick(() => {
                  scrollbar.value.setScrollTop(chatBody.value.scrollHeight);
                });
                if (index === 0) {
                  uploadRef.value.clearFiles();
                  fileList.value = [];
                }
                let chatIndex = chatList.value.findIndex(
                  (chat) => chat.sessionId === response.sessionId
                );
                chatList.value[chatIndex].createTime = response.createTime;
                chatList.value[chatIndex].latestChatHistory = response;
                let delChat = chatList.value.splice(chatIndex, 1)[0];
                chatList.value.splice(0, 0, delChat);
              } else {
                ElMessage.error({ message: "网络异常", showClose: true });
              }
            });
          });
        } else {
          ElMessage.error({ message: "网络异常", showClose: true });
        }
        loading.value = false;
      }
    };

    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);

    return {
      uploadRef,
      fileList,
      previewPicture,
      checkPicture,
      loading,
      sendPictures,
      dialogVisible,
      dialogImageUrl,
    };
  },
};
</script>

<style scoped>
.img-upload {
  display: flex;
  align-items: flex-end;
  margin-top: 5px;
}
.img-upload .el-upload__tip {
  position: absolute;
}
.img-upload .submit-button {
  width: 80px;
  margin-left: 20px;
  margin-bottom: 10px;
}
.dialog {
  display: flex;
  justify-content: center;
  padding: 0 10px;
  padding-top: 5px;
  padding-bottom: 20px;
}
</style>
<template>
  <div class="file-upload">
    <el-upload
      ref="uploadRef"
      action="#"
      :file-list="fileList"
      :auto-upload="false"
      :limit="1"
      :on-change="checkFile"
      :on-exceed="overwriteFile"
    >
      <template #trigger>
        <div class="select">
          <el-button class="select-button" size="large">选择文件</el-button>
        </div>
      </template>
      <template #tip>
        <div class="el-upload__tip">
          注意：只支持单个文件上传，文件大小不能超过 30MB
          ，新文件将会覆盖旧文件。
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
      @click="sendFile"
    >
      发送
    </el-button>
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
import { genFileId, ElMessage } from "element-plus";
import { reqSaveFileMsg } from "@/api";
import { computeMinuteDiff, formatDate } from "@/utils/date";

export default {
  name: "FileUpload",
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
    const overwriteFile = (files) => {
      uploadRef.value.clearFiles();
      const file = files[0];
      file.uid = genFileId();
      uploadRef.value.handleStart(file);
    };
    const checkFile = (file, files) => {
      if (file.size / 1024 / 1024 > 30) {
        ElMessage.warning("上传的文件大小不能超过 30MB ！");
        uploadRef.value.handleRemove(file);
        return;
      }
      fileList.value = files;
    };

    const loading = ref(false);
    const sendFile = async () => {
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
          type: 2,
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
        let result = await reqSaveFileMsg(formData);
        if (result.success) {
          if (result.data === null) {
            ElMessage.error({
              message: "你还不是他（她）的好友",
              showClose: true,
            });
            loading.value = false;
            return;
          }
          socket.emit("sendMsg", result.data, (response, msg) => {
            if (response) {
              if (msg === "offline") {
                ElMessage.warning({ message: "对方不在线", showClose: true });
              }
              chatHistoryList.value.push(response);
              nextTick(() => {
                scrollbar.value.setScrollTop(chatBody.value.scrollHeight);
              });
              uploadRef.value.clearFiles();
              fileList.value = [];
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
        } else {
          ElMessage.error({ message: "网络异常", showClose: true });
        }
        loading.value = false;
      }
    };

    return {
      uploadRef,
      fileList,
      overwriteFile,
      checkFile,
      loading,
      sendFile,
    };
  },
};
</script>

<style scoped>
.file-upload {
  display: flex;
  margin-top: 10px;
}
.file-upload .select {
  width: 300px;
}
.file-upload .select .select-button {
  width: 130px;
}
.file-upload .submit-button {
  position: absolute;
  width: 80px;
  margin-left: 150px;
  margin-bottom: 10px;
}
</style>
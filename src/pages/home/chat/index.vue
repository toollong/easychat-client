<template>
  <div class="chat">
    <header>
      <div class="header-user">
        <figure>
          <el-avatar
            :src="friend.avatar"
            size="large"
            shape="square"
            @error="() => true"
          >
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </figure>
        <div>
          <p>{{ friend.remark }}</p>
          <small v-if="checkOnline(friend.userId)" class="success">
            <icon-mdi-circle style="font-size: 12px" />
            <span>在 线</span>
          </small>
          <small v-else class="info">
            <icon-mdi-circle style="font-size: 12px" />
            <span>离 线</span>
          </small>
        </div>
      </div>
      <div class="header-action">
        <el-tooltip
          effect="light"
          content="语音通话"
          placement="bottom"
          :offset="6"
          :show-arrow="false"
          :hide-after="100"
          :enterable="false"
        >
          <el-button type="success" size="large" text>
            <icon-ep-phone style="font-size: 26px" />
          </el-button>
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="视频通话"
          placement="bottom"
          :offset="6"
          :show-arrow="false"
          :hide-after="100"
          :enterable="false"
        >
          <el-button type="warning" size="large" text>
            <icon-ep-video-camera style="font-size: 26px" />
          </el-button>
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="关闭窗口"
          placement="bottom"
          :offset="6"
          :show-arrow="false"
          :hide-after="100"
          :enterable="false"
        >
          <el-button
            type="danger"
            size="large"
            text
            @click="this.$emit('update:showChat', '')"
          >
            <icon-ep-close style="font-size: 26px" />
          </el-button>
        </el-tooltip>
      </div>
    </header>
    <el-scrollbar ref="scrollbarRef">
      <div class="chat-body" ref="chatBodyRef">
        <div class="messages">
          <div
            class="message-item"
            v-for="message in chatHistoryList"
            :key="message.id"
            :class="{ send: message.senderId === user.userId }"
          >
            <div
              v-if="message.showTime === 1"
              class="divider"
              :label="
                compareDate(message.createTime)
                  ? formatDate(message.createTime, 'ah:mm')
                  : compareDate(message.createTime, 1)
                  ? '昨天 ' + formatDate(message.createTime, 'ah:mm')
                  : compareDate(message.createTime, 2)
                  ? '前天 ' + formatDate(message.createTime, 'ah:mm')
                  : compareYear(message.createTime)
                  ? formatDate(message.createTime, 'MM-DD ah:mm')
                  : formatDate(message.createTime, 'YYYY-MM-DD ah:mm')
              "
            />
            <div class="message">
              <div v-if="message.senderId === user.userId" class="header">
                <div>
                  <span>{{ user.nickName }}</span>
                  <small>
                    {{ formatDate(message.createTime, "YYYY-MM-DD HH:mm") }}
                  </small>
                </div>
                <el-avatar :src="user.avatar" :size="45" @error="() => true">
                  <img
                    src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                  />
                </el-avatar>
              </div>
              <div v-else class="header">
                <el-avatar :src="friend.avatar" :size="45" @error="() => true">
                  <img
                    src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                  />
                </el-avatar>
                <div>
                  <span>{{ friend.remark }}</span>
                  <small>
                    {{ formatDate(message.createTime, "YYYY-MM-DD HH:mm") }}
                  </small>
                </div>
              </div>
              <div v-if="message.type === 0" class="content">
                {{ message.content }}
              </div>
              <div v-if="message.type === 1" class="content-image">
                <el-image
                  class="image"
                  :src="message.content"
                  fit="contain"
                  :preview-src-list="[message.content]"
                  hide-on-click-modal
                  lazy
                />
              </div>
              <div v-if="message.type === 2" class="content">
                [暂不支持语音消息]
              </div>
              <!-- <div v-if="message.type === 3" class="content">
              <div class="file-icon">
                <i class="fa fa-file-pdf-o"></i>
              </div>
              <div>
                <div>
                  important_documents.pdf <i class="text-muted small">(50KB)</i>
                </div>
                <ul class="list-inline">
                  <li class="list-inline-item mb-0"><a href="#">下载</a></li>
                  <li class="list-inline-item mb-0"><a href="#">查看</a></li>
                </ul>
              </div>
            </div> -->
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <footer>
      <form>
        <el-input
          ref="inputRef"
          type="textarea"
          v-model="inputValue"
          maxlength="200"
          :autosize="{ minRows: 1, maxRows: 6 }"
          resize="none"
          @blur="focusIndex = $event.target.selectionStart"
          @focus="setFocusIndex"
          @keyup.enter.exact="sendMessage"
          @keydown.enter.exact="$event.preventDefault()"
        />
        <div class="buttons">
          <el-tooltip
            effect="light"
            content="表情"
            placement="top"
            :offset="6"
            :show-arrow="showEmoticon"
            :enterable="showEmoticon"
            :hide-after="100"
          >
            <template v-if="showEmoticon" #content>
              <div class="emoticons">
                <el-scrollbar>
                  <el-button
                    class="emoticon-item"
                    type="info"
                    text
                    v-for="emoticon in emoticons"
                    :key="emoticon"
                    @click="addEmoticon(emoticon)"
                  >
                    <span>{{ emoticon }}</span>
                  </el-button>
                </el-scrollbar>
              </div>
            </template>
            <el-button
              type="info"
              size="large"
              link
              @click="showEmoticon = !showEmoticon"
            >
              <icon-mdi-emoticon-outline style="font-size: 26px" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="图片"
            placement="top"
            :offset="6"
            :show-arrow="false"
            :hide-after="100"
            :enterable="false"
          >
            <el-button type="info" size="large" link @click="uploadImg">
              <icon-mdi-panorama-outline style="font-size: 26px" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="文件"
            placement="top"
            :offset="6"
            :show-arrow="false"
            :hide-after="100"
            :enterable="false"
          >
            <el-button type="info" size="large" link @click="uploadFile">
              <icon-mdi-folder-outline style="font-size: 26px" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="语音"
            placement="top"
            :offset="6"
            :show-arrow="false"
            :hide-after="100"
            :enterable="false"
          >
            <el-button type="info" size="large" link>
              <icon-ep-microphone style="font-size: 26px" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="发送"
            placement="top"
            :offset="6"
            :show-arrow="false"
            :hide-after="100"
            :enterable="false"
          >
            <el-button
              class="send"
              type="primary"
              size="large"
              :disabled="inputValue.length === 0"
              @click="sendMessage"
            >
              <icon-ep-promotion style="font-size: 24px" />
            </el-button>
          </el-tooltip>
        </div>
      </form>
      <ImgUpload v-show="showImgUpload" />
      <FileUpload v-show="showFileUpload" />
    </footer>
  </div>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import {
  compareYear,
  compareDate,
  computeMinuteDiff,
  formatDate,
} from "@/utils/date";
import emoticons from "./emoticons.json";
import ImgUpload from "@/pages/home/chat/img-upload";
import FileUpload from "@/pages/home/chat/file-upload";

export default {
  name: "Chat",
  components: {
    ImgUpload,
    FileUpload,
  },
  props: {
    showChat: String,
  },
  emits: ["update:showChat"],
  setup(props) {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const store = useStore();
    const user = inject("user");

    const { showChat } = toRefs(props);
    const chatList = computed(() => store.state.home.chatList);
    const chatHistoryList = computed(() => store.state.home.chatHistories);
    const onlineUsers = computed(() => store.state.home.onlineUsers);
    const friend = reactive({
      userId: "",
      avatar: "",
      remark: "",
    });
    const scrollbarRef = ref();
    const chatBodyRef = ref();
    const checkOnline = (userId) => {
      return onlineUsers.value.indexOf(userId) >= 0;
    };

    const inputRef = ref();
    const inputValue = ref("");
    const focusIndex = ref(0);
    const setFocusIndex = (event) => {
      event.target.selectionStart = focusIndex.value;
      event.target.selectionEnd = focusIndex.value;
    };
    const sendMessage = () => {
      if (inputValue.value) {
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
          receiverId: friend.userId,
          sessionId: showChat.value,
          type: 0,
          content: inputValue.value,
          createTime: currentTime,
          hasRead: 0,
          showTime: showTime,
        };
        socket.emit("sendMsg", message, (response) => {
          console.log(response);
          if (response) {
            if (response === "offline") {
              ElMessage.warning({ message: "对方不在线", showClose: true });
            }
            chatHistoryList.value.push(message);
            nextTick(() => {
              scrollbarRef.value.setScrollTop(chatBodyRef.value.scrollHeight);
            });
            inputValue.value = "";
            let chatIndex = chatList.value.findIndex(
              (chat) => chat.sessionId === message.sessionId
            );
            chatList.value[chatIndex].createTime = message.createTime;
            chatList.value[chatIndex].latestChatHistory = message;
            let delChat = chatList.value.splice(chatIndex, 1)[0];
            chatList.value.splice(0, 0, delChat);
          } else {
            ElMessage.error({ message: "网络异常", showClose: true });
          }
        });
      }
    };

    const showEmoticon = ref(false);
    const addEmoticon = (emoticon) => {
      showEmoticon.value = false;
      let inputContent = inputValue.value;
      inputValue.value =
        inputContent.slice(0, focusIndex.value) +
        emoticon +
        inputContent.slice(focusIndex.value);
      focusIndex.value += emoticon.length;
      inputRef.value.focus();
    };

    const showImgUpload = ref(false);
    const showFileUpload = ref(false);
    const uploadImg = () => {
      showFileUpload.value = false;
      showImgUpload.value = !showImgUpload.value;
    };
    const uploadFile = () => {
      showImgUpload.value = false;
      showFileUpload.value = !showFileUpload.value;
    };

    onMounted(() => {
      socket.on("receiveMsg", (message) => {
        if (friend.userId === message.senderId) {
          chatHistoryList.value.push(message);
          nextTick(() => {
            scrollbarRef.value.setScrollTop(chatBodyRef.value.scrollHeight);
          });
        }
      });
    });

    watch(showChat, () => {
      if (showChat.value) {
        let chatInfo = chatList.value.find(
          (chat) => chat.sessionId === showChat.value
        );
        if (chatInfo) {
          friend.userId = chatInfo.friendUserId;
          friend.avatar = chatInfo.friendAvatar;
          friend.remark = chatInfo.friendRemark
            ? chatInfo.friendRemark
            : chatInfo.friendNickName;
        }
      }
    });
    watch(chatHistoryList, () => {
      nextTick(() => {
        scrollbarRef.value.setScrollTop(chatBodyRef.value.scrollHeight);
      });
    });

    return {
      user,
      chatHistoryList,
      friend,
      scrollbarRef,
      chatBodyRef,
      checkOnline,
      compareYear,
      compareDate,
      formatDate,
      inputRef,
      inputValue,
      focusIndex,
      sendMessage,
      setFocusIndex,
      showEmoticon,
      emoticons,
      addEmoticon,
      showImgUpload,
      showFileUpload,
      uploadImg,
      uploadFile,
    };
  },
};
</script>

<style scoped>
.chat {
  display: flex;
  flex-flow: column nowrap;
  border-right: 1px solid var(--border-color);
  background-color: var(--fill-color-lighter);
  flex: 1;
}
.chat header {
  display: flex;
  height: 100px;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-color);
  color: var(--text-color-primary);
  padding: 20px 30px;
}
.header-user {
  display: flex;
  height: 65px;
}
.header-user figure {
  margin: 5px 15px 0 0;
}
.header-user p {
  font-size: 26px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0;
}
.header-user small {
  display: flex;
  align-items: center;
  font-size: 100%;
}
.header-user small.success {
  color: var(--color-success);
}
.header-user small.info {
  color: var(--color-info);
}
.header-user small span {
  margin-left: 4px;
  margin-bottom: 1px;
}
.chat-body {
  padding: 30px;
  padding-bottom: 10px;
  overflow: hidden;
  flex: 1;
}
.chat-body .messages {
  display: flex;
  flex-flow: column nowrap;
}
.chat-body .messages .message-item {
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  align-items: flex-start;
  margin-bottom: 20px;
}
.chat-body .messages .message-item.send {
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  align-items: flex-end;
  margin-bottom: 20px;
}
.chat-body .messages .message-item .divider {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
}
.chat-body .messages .message-item .divider::before {
  content: attr(label);
  display: block;
  position: absolute;
  top: -8px;
  letter-spacing: 0.5px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  background-color: var(--color-info-light-8);
  color: var(--text-color-regular);
  left: 50%;
  transform: translateX(-50%);
}
.chat-body .messages .message-item .message {
  display: flex;
  max-width: 60%;
  flex-flow: column nowrap;
  align-items: flex-start;
}
.chat-body .messages .message-item.send .message {
  display: flex;
  max-width: 60%;
  flex-flow: column nowrap;
  align-items: flex-end;
}
.chat-body .messages .message-item .message .header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.chat-body .messages .message-item .message .header div {
  display: flex;
  flex-flow: column nowrap;
  margin-left: 10px;
}
.chat-body .messages .message-item.send .message .header div {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  margin-right: 10px;
}
.chat-body .messages .message-item .message .header div span {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color-regular);
}
.chat-body .messages .message-item .message .header div small {
  font-style: italic;
  color: var(--text-color-secondary);
}
.chat-body .messages .message-item .message .content {
  white-space: pre-wrap;
  font-size: 15px;
  background-color: var(--color-info-light-8);
  border-radius: 7px;
  margin-left: 45px;
  padding: 10px 15px;
}
.chat-body .messages .message-item.send .message .content {
  background-color: var(--color-primary);
  color: var(--bg-color);
  margin-left: 0;
  margin-right: 45px;
}
.chat-body .messages .message-item .message .content-image {
  display: flex;
  width: 35%;
  margin-left: 45px;
}
.chat-body .messages .message-item.send .message .content-image {
  justify-content: flex-end;
  margin-left: 0;
  margin-right: 45px;
}
.chat-body .messages .message-item .message .content-image .image {
  border-radius: 6px;
}
.chat footer {
  background-color: var(--bg-color);
  padding: 20px 30px;
  padding-bottom: 50px;
}
.chat footer form {
  display: flex;
  align-items: center;
}
.chat footer form .buttons {
  display: flex;
  margin-left: 20px;
}
.chat footer form .buttons .send {
  width: 80px;
  margin-left: 20px;
}
.emoticons {
  height: 100px;
  width: 200px;
  overflow: hidden;
}
.emoticon-item {
  margin: 0;
  padding: 5px;
}
.emoticon-item span {
  font-size: 20px;
}
</style>
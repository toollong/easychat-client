<template>
  <div>
    <div class="chats">
      <header>
        <div>
          <span>Chats</span>
          <ul>
            <li>
              <el-tooltip
                effect="light"
                content="新建聊天"
                placement="bottom"
                :offset="6"
                :show-arrow="false"
                :hide-after="100"
                :enterable="false"
              >
                <el-button type="primary" link @click="showChatAdd = true">
                  <icon-mdi-comment-plus-outline style="font-size: 30px" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="light"
                content="隐藏窗口"
                placement="bottom"
                :offset="6"
                :show-arrow="false"
                :hide-after="100"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  link
                  @click="this.$emit('hideSidebar', -1)"
                >
                  <icon-mdi-minus style="font-size: 30px" />
                </el-button>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <p>聊天，是最好的陪伴。</p>
      </header>
      <form @submit.prevent>
        <el-autocomplete
          v-model="searchValue"
          :fetch-suggestions="search"
          :trigger-on-focus="false"
          :maxlength="11"
          size="large"
          placeholder="搜索"
          spellcheck="false"
          clearable
          @select="handleSelect"
        >
          <template #prefix><icon-ep-search /></template>
          <template #default="{ item }">
            <div class="search-item">
              <el-avatar
                :src="
                  item.friendAvatar
                    ? 'https://toollong.icu/easychat' + item.friendAvatar
                    : ''
                "
                @error="() => true"
              >
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
              <span class="value">
                {{ item.value }}
              </span>
            </div>
          </template>
        </el-autocomplete>
      </form>
      <el-skeleton :loading="loading" :count="6" animated>
        <template #template>
          <div
            style="
              display: flex;
              width: 400px;
              height: 96px;
              padding: 20px 30px;
            "
          >
            <el-skeleton-item
              variant="circle"
              style="width: 56px; height: 56px; margin: 0 10px 0 0"
            />
            <div style="flex: 1; margin-right: 15px">
              <el-skeleton-item
                variant="h1"
                style="width: 70%; margin-top: 8px"
              />
              <el-skeleton-item variant="text" />
            </div>
            <el-skeleton-item
              variant="text"
              style="width: 20%; margin-top: 5px"
            />
          </div>
        </template>
        <el-empty
          v-if="chatList.length === 0"
          class="chats-empty"
          description="还没有聊天哦..."
        >
          <template #image><icon-mdi-forum-remove-outline /></template>
        </el-empty>
        <div v-else class="chats-body">
          <el-scrollbar max-height="730px">
            <div v-auto-animate>
              <div
                class="list-item"
                v-for="(chat, index) in chatList"
                :key="chat.sessionId"
                :class="{ open: currentSession === chat.sessionId }"
                @click="this.$emit('update:showChat', chat.sessionId)"
              >
                <figure
                  :class="
                    checkOnline(chat.friendUserId)
                      ? 'avatar-success'
                      : 'avatar-info'
                  "
                >
                  <el-avatar
                    :src="
                      chat.friendAvatar
                        ? 'https://toollong.icu/easychat' + chat.friendAvatar
                        : ''
                    "
                    size="large"
                    @error="() => true"
                  >
                    <img
                      src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                    />
                  </el-avatar>
                </figure>
                <div class="list-item-body">
                  <div class="list-item-content">
                    <span>
                      {{
                        chat.friendRemark
                          ? chat.friendRemark
                          : chat.friendNickName
                      }}
                    </span>
                    <p>
                      {{
                        chat.latestChatHistory.type === 0
                          ? chat.latestChatHistory.content
                          : chat.latestChatHistory.type === 1
                          ? "[图片]"
                          : chat.latestChatHistory.type === 2
                          ? "[文件]"
                          : chat.latestChatHistory.type === 3
                          ? "[语音]"
                          : ""
                      }}
                    </p>
                  </div>
                  <div>
                    <small v-if="chat.latestChatHistory.createTime">
                      {{
                        compareDate(chat.latestChatHistory.createTime)
                          ? formatDate(
                              chat.latestChatHistory.createTime,
                              "a h:mm"
                            )
                          : compareDate(chat.latestChatHistory.createTime, 1)
                          ? "昨天"
                          : compareDate(chat.latestChatHistory.createTime, 2)
                          ? "前天"
                          : formatDate(
                              chat.latestChatHistory.createTime,
                              "YYYY-MM-DD"
                            )
                      }}
                    </small>
                    <small v-else>
                      {{
                        compareDate(chat.sessionTime)
                          ? formatDate(chat.sessionTime, "a h:mm")
                          : compareDate(chat.sessionTime, 1)
                          ? "昨天"
                          : compareDate(chat.sessionTime, 2)
                          ? "前天"
                          : formatDate(chat.sessionTime, "YYYY-MM-DD")
                      }}
                    </small>
                    <div
                      v-if="
                        chat.latestChatHistory.senderId !== user.userId &&
                        chat.latestChatHistory.hasRead === 0
                      "
                      class="list-item-badge"
                    >
                      <el-badge class="badge" value="..." />
                    </div>
                    <div v-else class="list-item-action" @click.stop="">
                      <el-dropdown trigger="click">
                        <icon-mdi-menu class="icon" />
                        <template #dropdown>
                          <el-dropdown-menu class="dropdown">
                            <el-dropdown-item
                              @click="
                                this.$emit('showProfile', chat.friendUserId)
                              "
                            >
                              <icon-ep-view class="dropdown-icons" />查看资料
                            </el-dropdown-item>
                            <el-dropdown-item>
                              <icon-ep-star class="dropdown-icons" />特别关心
                            </el-dropdown-item>
                            <el-dropdown-item
                              divided
                              @click="removeChat(chat, index)"
                            >
                              <span class="text-danger">
                                <icon-ep-delete
                                  class="dropdown-icons"
                                />删除聊天
                              </span>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-skeleton>
      <ChatAdd v-model:show="showChatAdd" @addChat="addNewChat" />
    </div>
  </div>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { compareDate, formatDate } from "@/utils/date";
import Notify from "@wcjiang/notify";
import ChatAdd from "@/pages/home/sidebar-chats/chat-add";

export default {
  name: "SidebarChats",
  components: {
    ChatAdd,
  },
  props: {
    showChat: String,
  },
  emits: ["hideSidebar", "update:showChat", "showProfile"],
  setup(props, { emit }) {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const store = useStore();
    const user = inject("user");

    const { showChat } = toRefs(props);
    const chatList = computed(() => store.state.home.chatList);
    const onlineUsers = computed(() => store.state.home.onlineUsers);
    const loading = ref(false);
    const currentSession = ref("");

    const showChatAdd = ref(false);
    const addNewChat = (friend) => {
      // 发送请求修改该好友的sessionId和sessionTime(sessionId需要双方统一！)
      socket.emit(
        "addSession",
        user.userId,
        friend.friendUserId,
        (response) => {
          if (response) {
            chatList.value.splice(0, 0, response);
            emit("update:showChat", response.sessionId);
            // store.dispatch("home/getFriendList");
            store.dispatch("home/getFriendList", user.userId);
          } else {
            ElMessage.error({ message: "网络异常", showClose: true });
          }
        }
      );
    };

    const searchValue = ref("");
    const search = (queryString, callback) => {
      let results = queryString
        ? chatList.value.filter((chat) => {
            if (chat.friendRemark) {
              return chat.friendRemark.includes(queryString);
            } else {
              return chat.friendNickName.includes(queryString);
            }
          })
        : chatList.value;
      callback(
        results.map((item) => {
          return {
            ...item,
            value: item.friendRemark ? item.friendRemark : item.friendNickName,
          };
        })
      );
    };
    const handleSelect = (item) => {
      emit("update:showChat", item.sessionId);
    };
    const checkOnline = (userId) => {
      return onlineUsers.value.indexOf(userId) >= 0;
    };
    const removeChat = (chat, index) => {
      ElMessageBox.confirm("您确定删除该聊天吗？", "", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            socket.emit(
              "removeSession",
              user.userId,
              chat.friendUserId,
              (response) => {
                if (response) {
                  if (showChat.value === chat.sessionId) {
                    emit("update:showChat", "");
                  }
                  chatList.value.splice(index, 1);
                  // store.dispatch("home/getFriendList");
                  store.dispatch("home/getFriendList", user.userId);
                } else {
                  ElMessage.error({ message: "网络异常", showClose: true });
                }
              }
            );
            done();
          } else {
            done();
          }
        },
      })
        .then(() => {})
        .catch(() => {});
    };

    onMounted(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1000);

      socket.on("receiveMsg", (message, callback) => {
        callback();
        let chatIndex = chatList.value.findIndex(
          (chat) => chat.sessionId === message.sessionId
        );
        if (chatIndex >= 0) {
          if (showChat.value === message.sessionId) {
            message.hasRead = 1;
            socket.emit("readMessages", showChat.value, user.userId);
          }
          chatList.value[chatIndex].createTime = message.createTime;
          chatList.value[chatIndex].latestChatHistory = message;
          let delChat = chatList.value.splice(chatIndex, 1)[0];
          chatList.value.splice(0, 0, delChat);
        } else {
          socket.emit(
            "addSession",
            user.userId,
            message.senderId,
            (response) => {
              if (response) {
                if (response !== "exist") {
                  response.createTime = message.createTime;
                  response.latestChatHistory = message;
                  chatList.value.splice(0, 0, response);
                }
              } else {
                ElMessage.error({ message: "网络异常", showClose: true });
              }
            }
          );
        }
        let chat = chatList.value.find(
          (chat) => chat.sessionId === message.sessionId
        );
        if (chat) {
          const notify = new Notify({
            disableFavicon: true,
            onclick: () => {
              notify.close();
            },
            audio: {
              file: "/audio/chat.wav",
            },
          });
          notify.isPermission();
          notify.player();
          ElNotification.success({
            title: "你有一条新消息（点我查看）",
            message:
              (chat.friendRemark ? chat.friendRemark : chat.friendNickName) +
              "：" +
              (message.type === 0
                ? message.content.length > 20
                  ? message.content.substring(0, 19) + "..."
                  : message.content
                : message.type === 1
                ? "[图片]"
                : message.type === 2
                ? "[文件]"
                : message.type === 3
                ? "[语音]"
                : ""),
            duration: 5000,
            onClick: () => {
              emit("update:showChat", chat.sessionId);
            },
          });
        }
      });
    });

    watch(showChat, () => {
      if (showChat.value) {
        currentSession.value = showChat.value;
        let chatIndex = chatList.value.findIndex(
          (chat) => chat.sessionId === showChat.value
        );
        let latestChatHistory = chatList.value[chatIndex].latestChatHistory;
        if (latestChatHistory && latestChatHistory.senderId !== user.userId) {
          chatList.value[chatIndex].latestChatHistory.hasRead = 1;
          socket.emit("readMessages", showChat.value, user.userId);
        }
        // store.dispatch("home/getHistory");
        store.dispatch("home/getHistory", {
          id: user.userId,
          session: showChat.value,
          page: 1,
          size: 15,
        });
      } else {
        currentSession.value = "";
      }
    });

    return {
      user,
      loading,
      chatList,
      currentSession,
      showChatAdd,
      addNewChat,
      searchValue,
      search,
      handleSelect,
      checkOnline,
      compareDate,
      formatDate,
      removeChat,
    };
  },
};
</script>

<style scoped>
.chats {
  display: flex;
  width: 400px;
  flex-flow: column nowrap;
  flex: 1;
}
.chats header {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  height: 100px;
  padding: 0 30px 0 35px;
}
.chats header div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.chats header span {
  font-size: 32px;
  font-weight: 600;
  color: var(--theme-color-light-1);
}
.chats header p {
  color: var(--theme-color-light-2);
  margin: 0;
  padding-left: 2px;
}
.chats header ul {
  list-style: none;
  margin-bottom: 0;
}
.chats header ul li {
  display: inline-block;
}
.chats form {
  display: flex;
  flex-flow: column nowrap;
  padding: 24px 30px;
}
.search-item {
  display: flex;
  height: 60px;
  align-items: center;
  padding: 0 10px;
}
.search-item .value {
  padding-left: 10px;
  font-size: 18px;
  font-weight: 600;
}
.chats-empty {
  height: 730px;
  justify-content: flex-start;
  padding-top: 150px;
}
.chats-body {
  height: 730px;
}
.list-item {
  display: flex;
  border-bottom: 1px solid var(--border-color-extra-light);
  border-radius: 10px;
  color: var(--text-color-primary);
  padding: 20px 30px;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
}
.list-item:hover {
  box-shadow: var(--theme-box-shadow-1);
}
.list-item.open {
  background-color: var(--theme-color-light-4);
}
.list-item.open .list-item-content span:first-child {
  color: var(--theme-color-light-1);
}
.list-item.open .list-item-content p {
  color: var(--text-color-regular);
}
.list-item.open .list-item-body small {
  color: var(--theme-color-light-2);
}
.list-item.open .list-item-action .icon {
  color: var(--theme-color-light-2);
}
.list-item figure {
  display: inline-block;
  position: relative;
  height: 56px;
  margin: 0 10px 0 0;
}
.list-item figure.avatar-success::before {
  content: "";
  position: absolute;
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  top: -2px;
  right: -2px;
  border: 3px solid var(--color-white);
  background: var(--color-success);
}
.list-item figure.avatar-info::before {
  content: "";
  position: absolute;
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  top: -2px;
  right: -2px;
  border: 3px solid var(--color-white);
  background: var(--color-info);
}
.list-item-body {
  display: flex;
  min-width: 0;
  line-height: 1.3;
  flex: 1;
}
.list-item-content {
  display: flex;
  min-width: 0;
  flex-flow: column nowrap;
  margin-right: 15px;
  flex: 1;
}
.list-item-content span:first-child {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color-regular);
  margin-top: 2px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-item-content p {
  font-size: 15px;
  color: var(--text-color-secondary);
  padding-left: 1px;
  margin: 0;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-item-body small {
  font-size: 14px;
  color: var(--text-color-regular);
}
.list-item-badge {
  margin-top: 10px;
  text-align: right;
}
.list-item-badge .badge {
  --el-badge-font-size: 20px;
}
.list-item-badge .badge:deep(.el-badge__content) {
  height: 20px;
  padding-bottom: 10px;
}
.list-item-action {
  opacity: 0;
  margin-top: 10px;
  text-align: right;
  padding-right: 2px;
}
.list-item:hover .list-item-action {
  opacity: 1;
}
.list-item-action .icon {
  font-size: 20px;
  color: var(--text-color-secondary);
}
.dropdown {
  width: 120px;
}
.dropdown-icons {
  margin-right: 8px;
}
.text-danger {
  display: flex;
  align-items: center;
  color: var(--color-danger);
}
</style>
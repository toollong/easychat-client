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
      <form @submit.prevent="">
        <el-autocomplete
          v-model="searchValue"
          :fetch-suggestions="search"
          :trigger-on-focus="false"
          :maxlength="11"
          size="large"
          placeholder="搜索"
          clearable
          @select="handleSelect"
        >
          <template #prefix><icon-ep-search /></template>
          <template #default="{ item }">
            <div class="search-item">
              <el-avatar :src="item.friendAvatar" @error="() => true">
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
          <template #image><icon-mdi-chat-remove /></template>
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
                    :src="chat.friendAvatar"
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
                    <p v-if="chat.latestChatHistory.type === 0">
                      {{ chat.latestChatHistory.content }}
                    </p>
                    <p v-else-if="chat.latestChatHistory.type === 1">
                      <icon-mdi-camera style="font-size: 16px" /><span
                        >[图片]</span
                      >
                    </p>
                    <p v-else-if="chat.latestChatHistory.type === 2">
                      <icon-mdi-microphone /><span>[语音]</span>
                    </p>
                    <p v-else-if="chat.latestChatHistory.type === 3">
                      <icon-mdi-file /><span>[文档]</span>
                    </p>
                    <p v-else-if="chat.latestChatHistory.type === 4">
                      <icon-mdi-video /><span>[视频]</span>
                    </p>
                    <p v-else></p>
                  </div>
                  <div>
                    <small>
                      {{
                        compareDate(chat.createTime)
                          ? formatDate(chat.createTime, "a h:mm")
                          : compareDate(chat.createTime, 1)
                          ? "昨天"
                          : compareDate(chat.createTime, 2)
                          ? "前天"
                          : formatDate(chat.createTime, "YYYY-MM-DD")
                      }}
                    </small>
                    <div
                      v-if="
                        chat.latestChatHistory.senderId !== user.userId &&
                        chat.latestChatHistory.hasRead === 0
                      "
                      class="list-item-badge"
                    >
                      <el-badge style="--el-badge-size: 20px" :value="1" />
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
import { ElMessage, ElMessageBox } from "element-plus";
import { compareDate, formatDate } from "@/utils/date";
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
      // let response = {
      //   sessionId: "10000000011",
      //   userId: user.userId,
      //   friendUserId: "20000000005",
      //   friendNickName: "11111",
      //   friendRemark: "22222",
      //   friendAvatar: "/images/avatar3.jpg",
      //   createTime: "2022-06-16 16:14:56",
      //   latestChatHistory: {},
      // };
      // 发送请求修改该好友的sessionId和sessionTime(sessionId需要双方统一！)
      socket.emit("addSession", friend.friendUserId, (response) => {
        if (response) {
          console.log(response);
          chatList.value.splice(0, 0, response);
          emit("update:showChat", response.sessionId);
        } else {
          ElMessage.error({ message: "网络异常", showClose: true });
        }
      });
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
            socket.emit("removeSession", chat.friendUserId, (response) => {
              if (response) {
                console.log(response);
                if (showChat.value === chat.sessionId) {
                  emit("update:showChat", "");
                }
                chatList.value.splice(index, 1);
              } else {
                ElMessage.error({ message: "网络异常", showClose: true });
              }
            });
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
      }, 500);

      socket.on("receiveMsg", (message, callback) => {
        console.log("收到消息：" + JSON.stringify(message));
        callback();
        let chatIndex = chatList.value.findIndex(
          (chat) => chat.sessionId === message.sessionId
        );
        if (chatIndex >= 0) {
          if (showChat.value === message.sessionId) {
            message.hasRead = 1;
            socket.emit("readMessages", showChat.value);
          }
          chatList.value[chatIndex].createTime = message.createTime;
          chatList.value[chatIndex].latestChatHistory = message;
          let delChat = chatList.value.splice(chatIndex, 1)[0];
          chatList.value.splice(0, 0, delChat);
        } else {
          socket.emit("addSession", friend.friendUserId, (response) => {
            if (response) {
              response.createTime = message.createTime;
              response.latestChatHistory = message;
              console.log(response);
              chatList.value.splice(0, 0, response);
            } else {
              ElMessage.error({ message: "网络异常", showClose: true });
            }
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
          socket.emit("readMessages", showChat.value);
        }
        store.dispatch("home/getHistory");
        // store.dispatch("home/getHistory", {
        //   userId: user.userId,
        //   sessionId: showChat.value,
        // });
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
  padding-top: 100px;
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
  font-size: 22px;
  font-weight: 600;
  color: var(--text-color-regular);
  margin-top: 2px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-item-content p {
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 1px;
  color: var(--text-color-secondary);
}
.list-item-content p span {
  margin-left: 5px;
}
.list-item-body small {
  font-size: 14px;
  color: var(--text-color-regular);
}
.list-item-badge {
  margin-top: 10px;
  text-align: right;
  padding-right: 2px;
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
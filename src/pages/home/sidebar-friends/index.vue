<template>
  <div>
    <div class="friends">
      <header>
        <div>
          <span>Friends</span>
          <ul>
            <li>
              <el-tooltip
                effect="light"
                content="新朋友"
                placement="bottom"
                :offset="6"
                :show-arrow="false"
                :hide-after="100"
                :enterable="false"
              >
                <el-button type="primary" link @click="showFriendVerify = true">
                  <icon-mdi-account-sync
                    style="font-size: 31px; margin-top: 2px"
                  />
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="light"
                content="添加好友"
                placement="bottom"
                :offset="6"
                :show-arrow="false"
                :hide-after="100"
                :enterable="false"
              >
                <el-button type="primary" link @click="showFriendAdd = true">
                  <icon-mdi-account-plus style="font-size: 30px" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="light"
                content="隐藏"
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
        <p>遇见，是故事的开始。</p>
      </header>
      <form @submit.prevent="">
        <el-input
          v-model="searchValue"
          :maxlength="11"
          size="large"
          placeholder="搜索"
          clearable
        >
          <template #prefix><icon-ep-search /></template>
        </el-input>
      </form>
      <el-empty
        v-if="searchFriendList.length === 0"
        class="friends-empty"
        description="还没有好友哦..."
      >
        <template #image><icon-mdi-account-cancel /></template>
      </el-empty>
      <div v-else class="friends-body">
        <el-scrollbar max-height="730px">
          <div
            class="list-item"
            v-for="friend in searchFriendList"
            :key="friend.id"
          >
            <el-popover
              trigger="click"
              :width="310"
              placement="right-start"
              :hide-after="100"
            >
              <template #reference>
                <figure
                  :class="
                    checkOnline(friend.friendUserId)
                      ? 'avatar-success'
                      : 'avatar-info'
                  "
                >
                  <el-avatar
                    :src="friend.friendAvatar"
                    :size="45"
                    @error="() => true"
                  >
                    <img
                      src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                    />
                  </el-avatar>
                </figure>
              </template>
              <template #default>
                <div class="avatar-card">
                  <el-avatar :src="friend.friendAvatar" @error="() => true">
                    <img
                      src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                    />
                  </el-avatar>
                  <div>
                    <p class="avatar-card-name">
                      {{ friend.friendNickName }}
                    </p>
                    <p class="avatar-card-tag">
                      {{ friend.friendTags.join(" ") }}
                    </p>
                  </div>
                  <p>
                    {{
                      friend.introduction
                        ? friend.introduction
                        : "这个人很神秘，什么都没有写..."
                    }}
                  </p>
                </div>
              </template>
            </el-popover>
            <div class="list-item-body">
              <div class="list-item-content">
                {{
                  friend.friendRemark
                    ? friend.friendRemark
                    : friend.friendNickName
                }}
              </div>
              <div class="list-item-action">
                <el-dropdown trigger="click">
                  <icon-mdi-menu class="icon" />
                  <template #dropdown>
                    <el-dropdown-menu class="dropdown">
                      <el-dropdown-item @click="toChat(friend)">
                        <icon-ep-chat-dot-round class="dropdown-icons" />
                        发送消息
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="this.$emit('showProfile', friend.friendUserId)"
                      >
                        <icon-ep-view class="dropdown-icons" />查看资料
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <icon-ep-star class="dropdown-icons" />特别关心
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="showRemarkReset = friend.friendUserId"
                      >
                        <icon-ep-edit-pen class="dropdown-icons" />修改备注
                      </el-dropdown-item>
                      <el-dropdown-item divided @click="removeFriend(friend)">
                        <span class="text-danger">
                          <icon-ep-delete class="dropdown-icons" />删除好友
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <FriendAdd v-model:show="showFriendAdd" />
      <FriendVerify v-model:show="showFriendVerify" @addChat="addNewChat" />
      <RemarkReset v-model:show="showRemarkReset" @resetRemark="updateRemark" />
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
} from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import FriendAdd from "@/pages/home/sidebar-friends/friend-add";
import FriendVerify from "@/pages/home/sidebar-friends/friend-verify";
import RemarkReset from "@/pages/home/sidebar-friends/remark-reset";

export default {
  name: "SidebarFriends",
  components: {
    FriendAdd,
    FriendVerify,
    RemarkReset,
  },
  props: {
    showChat: String,
  },
  emits: ["update:showChat", "hideSidebar", "showProfile"],
  setup(props, { emit }) {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const store = useStore();
    const user = inject("user");

    const { showChat } = toRefs(props);
    const friendList = computed(() => store.state.home.friendList);
    const friendVerifyList = computed(() => store.state.home.friendVerifyList);
    const chatList = computed(() => store.state.home.chatList);
    const onlineUsers = computed(() => store.state.home.onlineUsers);
    const searchValue = ref("");
    const searchFriendList = computed(() =>
      friendList.value.filter((friend) => {
        if (friend.friendRemark) {
          return friend.friendRemark.includes(searchValue.value);
        } else {
          return friend.friendNickName.includes(searchValue.value);
        }
      })
    );
    const showFriendAdd = ref(false);
    const showFriendVerify = ref(false);
    const showRemarkReset = ref("");
    const checkOnline = (userId) => {
      return onlineUsers.value.indexOf(userId) >= 0;
    };
    const addNewChat = (response) => {
      emit("hideSidebar", 1);
      chatList.value.splice(0, 0, response);
      emit("update:showChat", response.sessionId);
    };
    const toChat = (friend) => {
      emit("hideSidebar", 1);
      let chatSession = chatList.value.find(
        (chat) => chat.friendUserId === friend.friendUserId
      );
      if (!chatSession) {
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
        socket.emit("addSession", friend.friendUserId, (response) => {
          if (response) {
            console.log(response);
            chatList.value.splice(0, 0, response);
            chatSession = response;
          } else {
            ElMessage.error({ message: "网络异常", showClose: true });
          }
        });
      }
      emit("update:showChat", chatSession.sessionId);
    };
    const updateRemark = (friend) => {
      let friendIndex = friendList.value.findIndex(
        (item) => item.friendUserId === friend.friendUserId
      );
      friendList.value[friendIndex].friendRemark = friend.friendRemark;
    };
    const removeFriend = (friend) => {
      ElMessageBox.confirm("您确定删除该好友吗？", "", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            socket.emit("removeFriend", friend.friendUserId, (response) => {
              if (response) {
                console.log(response);
                let friendIndex = friendList.value.findIndex(
                  (item) => item.friendUserId === friend.friendUserId
                );
                friendList.value.splice(friendIndex, 1);
                let chatIndex = chatList.value.findIndex(
                  (chat) => chat.friendUserId === friend.friendUserId
                );
                if (chatIndex >= 0) {
                  if (showChat.value === chatList.value[chatIndex].sessionId) {
                    emit("update:showChat", "");
                  }
                  chatList.value.splice(chatIndex, 1);
                }
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
      socket.on("receiveVerify", (friendVerify, callback) => {
        console.log("收到好友申请：" + JSON.stringify(friendVerify));
        callback();
        friendVerifyList.value.splice(0, 0, friendVerify);
      });

      socket.on("applySucceed", (chatSession) => {
        console.log(chatSession.friendNickName + "已同意好友请求");
        store.dispatch("home/getFriendList");
        // store.dispatch("home/getFriendList", user.userId);
        let index = friendVerifyList.value.findIndex(
          (verify) =>
            verify.senderId === user.userId &&
            verify.receiverId === chatSession.friendUserId
        );
        if (index >= 0) {
          friendVerifyList.value[index].status = 1;
        }
        chatList.value.splice(0, 0, chatSession);
      });

      socket.on("applyFailed", (friendVerify) => {
        console.log(friendVerify.receiverNickName + "已拒绝好友请求");
        let index = friendVerifyList.value.findIndex(
          (verify) =>
            verify.senderId === friendVerify.senderId &&
            verify.receiverId === friendVerify.receiverId
        );
        if (index >= 0) {
          friendVerifyList.value[index].status = 2;
        }
      });
    });

    return {
      searchValue,
      searchFriendList,
      showFriendAdd,
      showFriendVerify,
      showRemarkReset,
      checkOnline,
      addNewChat,
      toChat,
      updateRemark,
      removeFriend,
    };
  },
};
</script>

<style scoped>
.friends {
  display: flex;
  width: 400px;
  flex-flow: column nowrap;
  flex: 1;
}
.friends header {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  height: 100px;
  padding: 0 30px 0 35px;
}
.friends header div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.friends header span {
  font-size: 32px;
  font-weight: 600;
  color: var(--theme-color-light-1);
}
.friends header p {
  color: var(--theme-color-light-2);
  margin: 0;
  padding-left: 0;
}
.friends header ul {
  list-style: none;
  margin-bottom: 0;
}
.friends header ul li {
  display: inline-block;
}
.friends form {
  padding: 24px 30px;
}
.friends-empty {
  height: 730px;
  justify-content: flex-start;
  padding-top: 100px;
}
.friends-body {
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
.list-item:first-child {
  border-top: 0;
}
.list-item figure {
  display: inline-block;
  position: relative;
  height: 45px;
  margin: 0 14px 0 0;
}
.list-item figure.avatar-success::before {
  content: "";
  position: absolute;
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  top: -2px;
  right: -2px;
  border: 2px solid var(--color-white);
  background: var(--color-success);
}
.list-item figure.avatar-info::before {
  content: "";
  position: absolute;
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  top: -2px;
  right: -2px;
  border: 2px solid var(--color-white);
  background: var(--color-info);
}
.list-item-body {
  display: flex;
  min-width: 0;
  line-height: 1.3;
  flex: 1;
}
.list-item-content {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color-regular);
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
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
.el-popover.el-popper {
  background-color: var(--color-info-light-9) !important;
}
.avatar-card {
  display: flex;
  gap: 10px;
  flex-direction: column;
}
.avatar-card p {
  margin: 0;
}
.avatar-card-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color-primary);
}
.avatar-card-tag {
  font-size: 12px;
  color: var(--text-color-secondary);
}
</style>
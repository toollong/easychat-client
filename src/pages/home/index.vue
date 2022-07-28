<template>
  <div class="home">
    <Menu v-model:menu="menu" @showProfile="showProfile = $event" />
    <div class="content">
      <div class="sidebar">
        <el-collapse-transition>
          <SidebarChats
            v-show="menu === 1"
            v-model:showChat="showChat"
            @hideSidebar="menu = $event"
            @showProfile="showProfile = $event"
          />
        </el-collapse-transition>
        <el-collapse-transition>
          <SidebarFriends
            v-show="menu === 3"
            v-model:showChat="showChat"
            @hideSidebar="menu = $event"
            @showProfile="showProfile = $event"
          />
        </el-collapse-transition>
        <div class="developing" v-show="menu === 2 || menu === 4 || menu === 5">
          <el-empty description="模块正在建设中，敬请期待...">
            <template #image>
              <icon-mdi-cogs />
            </template>
          </el-empty>
        </div>
      </div>
      <transition name="el-zoom-in-center">
        <Chat v-show="showChat" v-model:showChat="showChat" />
      </transition>
      <Empty v-show="showEmpty" />
      <Profile v-model:show="showProfile" />
    </div>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  onMounted,
  provide,
  reactive,
  readonly,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import { mockGetUserInfo, reqGetUserInfo } from "@/api";
import { getCookie } from "@/utils/cookie";
import Menu from "@/pages/home/menu";
import SidebarChats from "@/pages/home/sidebar-chats";
import SidebarFriends from "@/pages/home/sidebar-friends";
import Chat from "@/pages/home/chat";
import Empty from "@/pages/home/empty";
import Profile from "@/pages/home/profile";

export default {
  name: "Home",
  components: {
    Menu,
    SidebarChats,
    SidebarFriends,
    Chat,
    Empty,
    Profile,
  },
  setup() {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const store = useStore();
    const user = reactive({
      userId: "",
      avatar: "",
      nickName: "",
    });

    const menu = ref(1);
    const showChat = ref("");
    const showEmpty = ref(true);
    const showProfile = ref("");

    onMounted(async () => {
      user.userId = getCookie("uid");
      // let result = await mockGetUserInfo();
      let result = await reqGetUserInfo({ id: user.userId });
      if (result.success) {
        user.avatar = "https://toollong.icu/easychat" + result.data.avatar;
        user.nickName = result.data.nickName;
        socket.emit("online", user.userId, result.data.status);
      }
      // store.dispatch("home/getChatList");
      // store.dispatch("home/getFriendList");
      // store.dispatch("home/getFriendVerify");
      store.dispatch("home/getChatList", user.userId);
      store.dispatch("home/getFriendList", user.userId);
      store.dispatch("home/getFriendVerify", user.userId);
      socket.on("onlineUsers", (onlineUsers) => {
        store.commit("home/ONLINEUSERS", onlineUsers);
      });
    });

    watch(showChat, () => {
      if (showChat.value !== "") {
        showEmpty.value = false;
      }
      if (showChat.value === "") {
        setTimeout(() => {
          showEmpty.value = true;
        }, 400);
      }
    });

    provide("user", readonly(user));

    return {
      menu,
      showChat,
      showEmpty,
      showProfile,
    };
  },
};
</script>

<style scoped>
.home {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.content {
  display: flex;
  flex: 1;
}
.sidebar {
  max-width: 400px;
  border-right: 1px solid var(--border-color);
}
.developing {
  display: flex;
  height: 100%;
  width: 400px;
  flex-flow: column nowrap;
  background-color: var(--bg-color-page);
  padding-top: 250px;
  flex: 1;
}
</style>
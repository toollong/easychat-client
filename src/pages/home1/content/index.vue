<template>
  <!-- content -->
  <div class="content">
    <!-- sidebar group -->
    <div class="sidebar-group">
      <SidebarChats v-model:showChat="showChat" />
      <SidebarFriends @update:showChat="showChat = $event" />
      <SidebarFavorites />
      <SidebarArchived />
    </div>
    <!-- ./ sidebar group -->
    <Chat v-model:showChat="showChat" />
    <Profile />
  </div>
  <!-- ./ content -->
</template>

<script>
import { ref } from "vue";
import SidebarChats from "@/pages/home/content/sidebar-chats";
import SidebarFriends from "@/pages/home/content/sidebar-friends";
import SidebarFavorites from "@/pages/home/content/sidebar-favorites";
import SidebarArchived from "@/pages/home/content/sidebar-archived";
import Chat from "@/pages/home/content/chat";
import Profile from "@/pages/home/content/profile";

export default {
  name: "Content",
  components: {
    SidebarChats,
    SidebarFriends,
    SidebarFavorites,
    SidebarArchived,
    Chat,
    Profile,
  },
  setup() {
    const showChat = ref("");
    const friendUserId = ref("");

    return {
      showChat,
      friendUserId,
    };
  },
  // data() {
  //   return {
  //     currentIndex: -1,
  //     showChat: false,
  //   };
  // },
  // inject: ["userId"],
  // mounted() {
  //   this.$store.dispatch("home/getChatList", this.userId.value);
  // },
  // computed: {
  //   ...mapState("home", {
  //     chatList: (state) => state.chatList,
  //     friendList: (state) => state.friendList,
  //   }),
  // },
  // methods: {
  //   changeIndex: throttle(function (index) {
  //     this.currentIndex = index;
  //   }, 50),
  //   leaveIndex() {
  //     this.currentIndex = -1;
  //   },
  //   openChat() {
  //     this.showChat = true;
  //   },
  // openChat(event) {
  //   let element = event.target;
  //   let { user } = element.dataset;
  //   if (user) {
  //     this.showChat = true;
  //   }
  // },
  // },
};
</script>

<style scoped>
</style>
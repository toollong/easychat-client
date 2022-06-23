<template>
  <!-- layout -->
  <div class="layout">
    <Menu @editProfile="userInfo = $event" />
    <Content />
  </div>
  <!-- ./ layout -->
  <ProfileEdit :userInfo="userInfo" />
  <FriendAdd />
</template>

<script>
import { onMounted, provide, reactive, readonly, ref } from "vue";
import { mockGetUserInfo, reqGetUserInfo } from "@/api";
import { getCookie } from "@/utils/cookie";
import Menu from "@/pages/home/menu";
import Content from "@/pages/home/content";
import ProfileEdit from "@/pages/home/others/profile-edit";
import FriendAdd from "@/pages/home/others/friend-add";
import store from "@/store";

export default {
  name: "Home",
  components: {
    Menu,
    Content,
    ProfileEdit,
    FriendAdd,
  },
  setup() {
    const user = reactive({
      userId: "",
      avatar: "",
      nickName: "",
    });
    const userInfo = ref({});

    onMounted(async () => {
      user.userId = getCookie("uid");
      let result = await mockGetUserInfo();
      // let result = await reqGetUserInfo(userId.value);
      if (result.code === 200) {
        let userInfo = result.data;
        user.avatar = userInfo.avatar;
        user.nickName = userInfo.nickName;
      }
      store.dispatch("home/getChatList");
      store.dispatch("home/getFriendList");
      // store.dispatch("home/getChatList", userId.value);
      // store.dispatch("home/getFriendList", userId.value);
    });

    provide("user", readonly(user));

    return {
      userInfo,
    };
  },
  // data() {
  //   return {
  //     uid: "",
  //   };
  // },
  // provide() {
  //   return {
  //     userId: computed(() => this.uid),
  //   };
  // },
  // mounted() {
  //   this.uid = getCookie("uid");
  //   console.log(this.userId);
  //   this.$store.dispatch("home/getUserInfo", userId);
  // },
};
</script>

<style scoped>
</style>
<template>
  <!-- navigation -->
  <nav class="navigation">
    <div class="nav-group">
      <ul>
        <li class="logo">
          <a type="button" @click="reload">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="612px"
              height="612px"
              viewBox="0 0 612 612"
              style="enable-background: new 0 0 612 612"
              xml:space="preserve"
            >
              <g>
                <g id="_x32__26_">
                  <g>
                    <path
                      d="M401.625,325.125h-191.25c-10.557,0-19.125,8.568-19.125,19.125s8.568,19.125,19.125,19.125h191.25
                                    c10.557,0,19.125-8.568,19.125-19.125S412.182,325.125,401.625,325.125z M439.875,210.375h-267.75
                                    c-10.557,0-19.125,8.568-19.125,19.125s8.568,19.125,19.125,19.125h267.75c10.557,0,19.125-8.568,19.125-19.125
                                    S450.432,210.375,439.875,210.375z M306,0C137.012,0,0,119.875,0,267.75c0,84.514,44.848,159.751,114.75,208.826V612
                                    l134.047-81.339c18.552,3.061,37.638,4.839,57.203,4.839c169.008,0,306-119.875,306-267.75C612,119.875,475.008,0,306,0z
                                    M306,497.25c-22.338,0-43.911-2.601-64.643-7.019l-90.041,54.123l1.205-88.701C83.5,414.133,38.25,345.513,38.25,267.75
                                    c0-126.741,119.875-229.5,267.75-229.5c147.875,0,267.75,102.759,267.75,229.5S453.875,497.25,306,497.25z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </li>
        <li>
          <a
            class="active"
            data-navigation-target="chats"
            href="#"
            data-toggle="tooltip"
            title="Chats"
            data-placement="right"
          >
            <span class="badge badge-warning"></span>
            <i data-feather="message-circle"></i>
          </a>
        </li>
        <li>
          <a
            data-navigation-target="friends"
            href="#"
            data-toggle="tooltip"
            title="Friends"
            data-placement="right"
          >
            <span class="badge badge-danger"></span>
            <i data-feather="user"></i>
          </a>
        </li>
        <li>
          <a
            data-navigation-target="favorites"
            data-toggle="tooltip"
            title="Favorites"
            data-placement="right"
            href="#"
          >
            <i data-feather="star"></i>
          </a>
        </li>
        <li class="brackets">
          <a
            data-navigation-target="archived"
            href="#"
            data-toggle="tooltip"
            title="Archived"
            data-placement="right"
          >
            <i data-feather="archive"></i>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="dark-light-switcher"
            data-toggle="tooltip"
            title="Dark mode"
            data-placement="right"
          >
            <i data-feather="moon"></i>
          </a>
        </li>
        <li data-toggle="tooltip" title="我" data-placement="right">
          <a href="#" data-toggle="dropdown">
            <figure class="avatar">
              <img :src="user.avatar" class="rounded-circle" alt="" />
            </figure>
          </a>
          <div class="dropdown-menu">
            <a
              href="#"
              class="dropdown-item"
              data-navigation-target="contact-information"
              @click="getUserInfo"
              >我的资料</a
            >
            <a
              href="#"
              class="dropdown-item"
              data-toggle="modal"
              data-target="#editProfileModal"
              @click="editProfile"
              >编辑资料</a
            >
            <a
              href="#"
              class="dropdown-item"
              data-toggle="modal"
              data-target="#settingModal"
              >设置</a
            >
            <div class="dropdown-divider"></div>
            <a class="dropdown-item text-danger" @click="logout">退出登录</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <!-- ./ navigation -->
</template>

<script>
import { inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { mockGetUserInfo, reqGetUserInfo, reqLogout } from "@/api";

export default {
  name: "Menu",
  emits: ["editProfile"],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();

    const user = inject("user");
    const reload = () => router.go(0);
    const getUserInfo = () => store.dispatch("home/getUserInfo");
    // const getUserInfo = () => store.dispatch("home/getUserInfo", userId.value);
    const editProfile = async () => {
      let result = await mockGetUserInfo();
      // let result = await reqGetUserInfo(userId.value);
      if (result.code === 200) {
        emit("editProfile", result.data);
      }
    };
    const logout = async () => {
      let result = await reqLogout();
      if (result.code === 200) {
        router.push({ name: "login" });
      }
    };

    return {
      user,
      reload,
      getUserInfo,
      editProfile,
      logout,
    };
  },
  // computed: {
  //   ...mapState("home", {
  //     userInfo: (state) => state.userInfo,
  //   }),
  // },
  // methods: {
  //   reload() {
  //     this.$router.go(0);
  //   },
  //   getFriends() {
  //     this.$store.dispatch("home/getFriendList");
  //   },
  //   async logout() {
  //     let result = await reqLogout();
  //     if (result.status == 200 && result.data.success) {
  //       this.$router.push({ name: "login" });
  //     }
  //   },
  // },
};
</script>

<style scoped>
.avatar {
  width: 3rem;
  height: 3rem;
}
</style>
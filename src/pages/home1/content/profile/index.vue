<template>
  <div class="sidebar-group">
    <div id="contact-information" class="sidebar">
      <header>
        <span>Profile</span>
        <ul class="list-inline">
          <li class="list-inline-item">
            <a href="#" class="btn btn-outline-light text-danger sidebar-close">
              <i data-feather="x"></i>
            </a>
          </li>
        </ul>
      </header>
      <div class="sidebar-body">
        <div class="pl-4 pr-4">
          <div class="text-center">
            <figure class="avatar avatar-xl mb-4">
              <img :src="userInfo.avatar" class="rounded-circle" alt="" />
            </figure>
            <h5 class="mb-1">{{ remark }}</h5>
            <small v-if="online" class="online text-success">
              <i class="fa fa-circle" aria-hidden="true"></i
              ><span class="online-text"> 在 线</span>
            </small>
            <small v-else class="online text-secondary">
              <i class="fa fa-circle" aria-hidden="true"></i
              ><span class="online-text"> 离 线</span>
            </small>
          </div>
          <div id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <p class="introduction text-muted">
                {{
                  userInfo.introduction === ""
                    ? "这个人很神秘，什么都没有写..."
                    : userInfo.introduction
                }}
              </p>
              <div class="mt-4 mb-4">
                <h6>昵称</h6>
                <p class="text-muted">{{ userInfo.nickName }}</p>
              </div>
              <div class="mt-4 mb-4">
                <h6>性别</h6>
                <p v-if="userInfo.gender === '1'" class="text-muted">男</p>
                <p v-if="userInfo.gender === '0'" class="text-muted">女</p>
                <p v-if="userInfo.gender === '2'" class="text-muted">保密</p>
              </div>
              <div class="mt-4 mb-4">
                <h6>年龄</h6>
                <p class="text-muted">{{ userInfo.age }}</p>
              </div>
              <div class="mt-4 mb-4">
                <h6>生日</h6>
                <p class="text-muted">{{ userInfo.birthday }}</p>
              </div>
              <div class="mt-4 mb-4">
                <h6>邮箱</h6>
                <p class="text-muted">{{ userInfo.email }}</p>
              </div>
              <div class="mt-4 mb-4">
                <h6>联系方式</h6>
                <p class="text-muted">{{ userInfo.phone }}</p>
              </div>
              <div class="mt-4 mb-4">
                <h6>地区</h6>
                <p class="text-muted">{{ userInfo.region }}</p>
              </div>
              <div class="mt-4 mb-4">
                <h6 class="mb-3">社交媒体账号</h6>
                <ul class="list-inline social-links">
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="btn btn-sm btn-floating btn-facebook"
                      data-toggle="tooltip"
                      title="Facebook"
                    >
                      <i class="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="btn btn-sm btn-floating btn-twitter"
                      data-toggle="tooltip"
                      title="Twitter"
                    >
                      <i class="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="btn btn-sm btn-floating btn-instagram"
                      data-toggle="tooltip"
                      title="Instagram"
                    >
                      <i class="fa fa-instagram"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="btn btn-sm btn-floating btn-linkedin"
                      data-toggle="tooltip"
                      title="Linkedin"
                    >
                      <i class="fa fa-linkedin"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="btn btn-sm btn-floating btn-google"
                      data-toggle="tooltip"
                      title="Google"
                    >
                      <i class="fa fa-google"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="btn btn-sm btn-floating btn-whatsapp"
                      data-toggle="tooltip"
                      title="Whatsapp"
                    >
                      <i class="fa fa-whatsapp"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "Profile",
  setup() {
    const store = useStore();

    const user = inject("user");
    const remark = ref("");
    const online = ref(false);
    const userInfo = computed(() => store.state.home.userInfo);
    const friendList = computed(() => store.state.home.friendList);

    watch(userInfo, () => {
      if (userInfo.value.id !== user.userId) {
        let friend = friendList.value.find(
          (friend) => friend.friendUserId === userInfo.value.id
        );
        if (friend) {
          let friendRemark = friend.friendRemark;
          if (friendRemark) {
            remark.value = friendRemark;
          } else {
            remark.value = userInfo.value.nickName;
          }
        }
      } else {
        remark.value = userInfo.value.nickName;
      }
    });

    return {
      user,
      remark,
      online,
      userInfo,
    };
  },
};
</script>

<style scoped>
h6 {
  font-size: 18px;
}
.avatar {
  margin-bottom: 1rem !important;
}
.mb-1 {
  font-size: 30px;
  margin-bottom: 0.5rem !important;
}
.online-text {
  padding-left: 2px;
}
.introduction {
  height: 45px;
  margin-top: 1rem;
}
.mt-4 {
  font-size: 16px;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
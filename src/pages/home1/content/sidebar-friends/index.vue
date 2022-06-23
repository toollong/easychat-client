<template>
  <!-- Friends sidebar -->
  <div id="friends" class="sidebar">
    <header>
      <span>Friends</span>
      <ul class="list-inline">
        <li class="list-inline-item" data-toggle="tooltip" title="添加好友">
          <a
            class="btn btn-outline-light"
            href="#"
            data-toggle="modal"
            data-target="#addFriends"
          >
            <i data-feather="user-plus"></i>
          </a>
        </li>
        <li class="list-inline-item d-xl-none d-inline">
          <a href="#" class="btn btn-outline-light text-danger sidebar-close">
            <i data-feather="x"></i>
          </a>
        </li>
      </ul>
    </header>
    <form>
      <input type="text" class="form-control" placeholder="搜索" />
    </form>
    <div class="sidebar-body">
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item"
          v-for="(friend, index) in friendList"
          :key="friend.id"
          @click="friendActions(index, $event)"
        >
          <div>
            <figure
              class="avatar"
              :class="
                online ? 'avatar-state-success' : 'avatar-state-secondary'
              "
            >
              <img
                v-if="friend.friendAvatar !== ''"
                :src="friend.friendAvatar"
                class="rounded-circle"
                alt=""
              />
              <span v-else class="avatar-title bg-info rounded-circle">A</span>
            </figure>
          </div>
          <div class="users-list-body">
            <div>
              <h5 v-if="friend.friendRemark !== ''">
                {{ friend.friendRemark }}
              </h5>
              <h5 v-else>
                {{ friend.friendNickName }}
              </h5>
              <p>{{ friend.friendNickName }}</p>
            </div>
            <div class="users-list-action">
              <div class="action-toggle">
                <div class="dropdown">
                  <a data-toggle="dropdown" href="#">
                    <i class="ti-more-alt"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a
                      href="#"
                      class="dropdown-item"
                      data-navigation-target="chats"
                      :data-chat="friend.friendUserId"
                      >发送消息</a
                    >
                    <a
                      href="#"
                      class="dropdown-item"
                      data-navigation-target="contact-information"
                      :data-profile="friend.friendUserId"
                      >查看资料</a
                    >
                    <a
                      href="#"
                      class="dropdown-item"
                      data-navigation-target=""
                      :data-remark="friend.friendUserId"
                      >修改备注</a
                    >
                    <div class="dropdown-divider"></div>
                    <a
                      href="#"
                      class="dropdown-item text-danger"
                      :data-remove="friend.friendUserId"
                      >删除好友</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- ./ Friends sidebar -->
</template>

<script>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import { mockAddChat, reqAddChat, reqRemoveFriend } from "@/api";

export default {
  name: "SidebarFriends",
  emits: ["update:showChat"],
  setup(props, { emit }) {
    const store = useStore();

    const user = inject("user");
    const online = ref(false);
    const friendList = computed(() => store.state.home.friendList);
    const friendActions = async (index, event) => {
      let element = event.target;
      let { chat, profile, remove } = element.dataset;
      if (chat) {
        let result = await mockAddChat();
        // let result = await reqAddChat({
        //   userId: userId.value,
        //   friendUserId: chat,
        //   friendRemark: friendList.value[index].friendRemark,
        // });
        if (result.code === 200) {
          store.dispatch("home/getChatList");
          // store.dispatch("home/getChatList", userId.value);
          emit("update:showChat", result.data);
        }
      }
      if (profile) {
        store.dispatch("home/getUserInfo");
        // store.dispatch("home/getUserInfo", profile);
      }
      if (remove) {
        let result = await reqRemoveFriend({
          userId: user.userId,
          friendUserId: remove,
        });
        if (result.code === 200 && result.success) {
          alert("删除成功！");
          store.dispatch("home/getFriendList", user.userId);
          store.dispatch("home/getChatList", user.userId);
        }
      }
    };

    return {
      user,
      online,
      friendList,
      friendActions,
    };
  },
};
</script>

<style scoped>
.avatar {
  width: 3rem;
  height: 3rem;
}
</style>
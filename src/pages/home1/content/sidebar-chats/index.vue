<template>
  <!-- Chats sidebar -->
  <div id="chats" class="sidebar active">
    <header>
      <span>Chats</span>
      <ul class="list-inline">
        <li class="list-inline-item" data-toggle="tooltip" title="新建聊天组">
          <a
            class="btn btn-outline-light"
            href="#"
            data-toggle="modal"
            data-target="#newGroup"
          >
            <i data-feather="users"></i>
          </a>
        </li>
        <li class="list-inline-item">
          <a
            class="btn btn-outline-light"
            data-toggle="tooltip"
            title="新建聊天"
            href="#"
            data-navigation-target="friends"
          >
            <i data-feather="plus-circle"></i>
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
          v-for="(chat, index) in chatList"
          :key="chat.sessionId"
          :class="currentIndex == index ? 'open-chat' : ''"
          @click="chatActions(index, $event)"
        >
          <div>
            <figure
              class="avatar"
              :class="
                online ? 'avatar-state-success' : 'avatar-state-secondary'
              "
            >
              <img :src="chat.friendAvatar" class="rounded-circle" alt="" />
            </figure>
          </div>
          <div class="users-list-body">
            <div>
              <h5
                :class="
                  chat.latestChatHistory.hasRead === '0' ? 'text-primary' : ''
                "
              >
                {{
                  chat.friendRemark !== ""
                    ? chat.friendRemark
                    : chat.friendNickName
                }}
              </h5>
              <p v-if="chat.latestChatHistory.type === '0'">
                {{ chat.latestChatHistory.content }}
              </p>
              <p v-else-if="chat.latestChatHistory.type === '1'">
                <i class="fa fa-camera mr-1"></i> 图片
              </p>
              <p v-else-if="chat.latestChatHistory.type === '2'">
                <i class="fa fa-voice mr-1"></i> 语音
              </p>
              <p v-else-if="chat.latestChatHistory.type === '3'">
                <i class="fa fa-file mr-1"></i> 文件
              </p>
              <p v-else-if="chat.latestChatHistory.type === '4'">
                <i class="fa fa-video-camera mr-1"></i> 视频
              </p>
              <p v-else></p>
            </div>
            <div
              v-if="chat.latestChatHistory.sessionId"
              class="users-list-action"
            >
              <small
                v-if="compareDate(chat.latestChatHistory.createTime)"
                class="time"
                :class="
                  chat.latestChatHistory.hasRead === '1'
                    ? 'text-muted'
                    : 'text-primary'
                "
              >
                {{ formatDate(chat.latestChatHistory.createTime, "a h:mm") }}
              </small>
              <small
                v-else-if="compareDate(chat.latestChatHistory.createTime, 1)"
                class="time"
                :class="
                  chat.latestChatHistory.hasRead === '1'
                    ? 'text-muted'
                    : 'text-primary'
                "
                >昨天
              </small>
              <small
                v-else-if="compareDate(chat.latestChatHistory.createTime, 2)"
                class="time"
                :class="
                  chat.latestChatHistory.hasRead === '1'
                    ? 'text-muted'
                    : 'text-primary'
                "
                >前天
              </small>
              <small
                v-else
                class="time"
                :class="
                  chat.latestChatHistory.hasRead === '1'
                    ? 'text-muted'
                    : 'text-primary'
                "
              >
                {{
                  formatDate(chat.latestChatHistory.createTime, "YYYY-MM-DD")
                }}
              </small>
              <div
                v-if="chat.latestChatHistory.hasRead === '0'"
                class="new-message-count"
              >
                1
              </div>
              <div v-else class="action-toggle">
                <div class="dropdown">
                  <a data-toggle="dropdown" href="#">
                    <i class="ti-more-alt" data-more="..."></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a
                      href="#"
                      class="dropdown-item"
                      data-navigation-target="contact-information"
                      :data-profile="chat.friendUserId"
                      >查看资料</a
                    >
                    <a
                      href="#"
                      class="dropdown-item"
                      :data-favorite="chat.friendUserId"
                      >特别关心</a
                    >
                    <div class="dropdown-divider"></div>
                    <a
                      href="#"
                      class="dropdown-item text-danger"
                      :data-remove="chat.sessionId"
                      >删除该聊天</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="users-list-action">
              <small class="text-muted"> </small>
              <div class="action-toggle">
                <div class="dropdown">
                  <a data-toggle="dropdown" href="#">
                    <i class="ti-more-alt" data-more="..."></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a
                      href="#"
                      class="dropdown-item"
                      data-navigation-target="contact-information"
                      :data-profile="chat.friendUserId"
                      >查看资料</a
                    >
                    <a
                      href="#"
                      class="dropdown-item"
                      :data-favorite="chat.friendUserId"
                      >特别关心</a
                    >
                    <div class="dropdown-divider"></div>
                    <a
                      href="#"
                      class="dropdown-item text-danger"
                      :data-remove="chat.sessionId"
                      >删除该聊天</a
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
  <!-- ./ Chats sidebar -->
</template>

<script>
import { computed, inject, ref, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { reqRemoveChat } from "@/api";
import moment from "moment";

export default {
  name: "SidebarChats",
  props: {
    showChat: String,
  },
  emits: ["update:showChat"],
  setup(props, { emit }) {
    const store = useStore();
    const { showChat } = toRefs(props);

    const user = inject("user");
    const online = ref(false);
    const currentIndex = ref(-1);
    const chatList = computed(() => store.state.home.chatList);
    const compareDate = (time, day = 0) =>
      moment(time).format("YYYY-MM-DD") ===
      moment().subtract(day, "days").format("YYYY-MM-DD");
    const formatDate = (time, format) => moment(time).format(format);
    const chatActions = async (index, event) => {
      let element = event.target;
      let { more, profile, favorite, remove } = element.dataset;
      if (!more && !profile && !favorite && !remove) {
        if (currentIndex.value !== index) {
          currentIndex.value = index;
          emit("update:showChat", chatList.value[index].sessionId);
          store.dispatch("home/getHistory");
          // store.dispatch("home/getHistory", {
          //   userId: userId.value,
          //   sessionId: chat,
          // });
        }
      }
      if (profile) {
        store.dispatch("home/getUserInfo");
        // store.dispatch("home/getUserInfo", profile);
      }
      if (remove) {
        let result = await reqRemoveChat({
          userId: user.userId,
          sessionId: remove,
        });
        if (result.code === 200 && result.success) {
          alert("删除成功！");
          store.dispatch("home/getChatList", user.userId);
        }
      }
    };

    watch(showChat, (value) => {
      if (value == "") {
        currentIndex.value = -1;
      } else {
        let index = chatList.value.findIndex((chat) => chat.sessionId == value);
        if (index > -1) {
          currentIndex.value = index;
          store.dispatch("home/getHistory");
          // store.dispatch("home/getHistory", {
          //   userId: userId.value,
          //   sessionId: value,
          // });
        }
      }
    });

    return {
      user,
      online,
      currentIndex,
      chatList,
      compareDate,
      formatDate,
      chatActions,
    };
  },
};
</script>

<style scoped>
.avatar {
  width: 3rem;
  height: 3rem;
}
.time {
  font-size: 14px;
}
</style>
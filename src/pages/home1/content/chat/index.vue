<template>
  <!-- not-chat -->
  <div class="chat" v-show="!show">
    <div class="row mb-5">
      <div class="col-md-4 offset-4">
        <img src="@/assets/images/not-chat.svg" alt="" />
      </div>
    </div>
    <p class="lead">
      所 有 的 相 遇 都 是 久 别 重 逢，该 遇 见 的 人 总 归 不 晚
    </p>
  </div>
  <!-- chat -->
  <div class="chat" v-show="show">
    <div class="chat-header">
      <div class="chat-header-user">
        <figure class="avatar header-avatar">
          <img :src="friend.avatar" class="rounded-circle" alt="" />
        </figure>
        <div>
          <h5>{{ friend.remark }}</h5>
          <small v-if="friend.online" class="header-online text-success">
            <i class="fa fa-circle" aria-hidden="true"></i
            ><span class="online-text"> 在 线</span>
          </small>
          <small v-else class="header-online text-secondary">
            <i class="fa fa-circle" aria-hidden="true"></i
            ><span class="online-text"> 离 线</span>
          </small>
        </div>
      </div>
      <div class="chat-header-action">
        <ul class="list-inline">
          <li class="list-inline-item d-xl-none d-inline">
            <a href="#" class="btn btn-outline-light mobile-navigation-button">
              <i data-feather="menu"></i>
            </a>
          </li>
          <li
            class="list-inline-item header-list-item"
            data-toggle="tooltip"
            title="语音通话"
          >
            <a
              href="#"
              class="btn btn-outline-light text-success"
              data-toggle="modal"
              data-target="#call"
            >
              <i data-feather="phone"></i>
            </a>
          </li>
          <li
            class="list-inline-item header-list-item"
            data-toggle="tooltip"
            title="视频通话"
          >
            <a
              href="#"
              class="btn btn-outline-light text-warning"
              data-toggle="modal"
              data-target="#videoCall"
            >
              <i data-feather="video"></i>
            </a>
          </li>
          <li class="list-inline-item header-list-item">
            <a href="#" class="btn btn-outline-light" data-toggle="dropdown">
              <i data-feather="more-horizontal"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a
                href="#"
                data-navigation-target="contact-information"
                class="dropdown-item"
                @click="getUserInfo"
                >查看资料</a
              >
              <a href="#" class="dropdown-item">特别关心</a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item text-danger" @click="closeChat"
                >关闭窗口</a
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="chat-body" ref="chatBody">
      <div class="messages" v-for="message in chatHistories" :key="message.id">
        <div
          v-if="message.showDate === '1' && compareDate(message.createTime)"
          class="message-item messages-divider"
          :data-label="formatDate(message.createTime, 'ah:mm')"
        ></div>
        <div
          v-else-if="
            message.showDate === '1' && compareDate(message.createTime, 1)
          "
          class="message-item messages-divider"
          :data-label="'昨天 ' + formatDate(message.createTime, 'ah:mm')"
        ></div>
        <div
          v-else-if="
            message.showDate === '1' && compareDate(message.createTime, 2)
          "
          class="message-item messages-divider"
          :data-label="'前天 ' + formatDate(message.createTime, 'ah:mm')"
        ></div>
        <div
          v-else-if="
            message.showDate === '1' && compareYear(message.createTime)
          "
          class="message-item messages-divider"
          :data-label="formatDate(message.createTime, 'MM-DD ah:mm')"
        ></div>
        <div
          v-else-if="message.showDate === '1'"
          class="message-item messages-divider"
          :data-label="formatDate(message.createTime, 'YYYY-MM-DD ah:mm')"
        ></div>
        <div
          v-if="message.senderId === user.userId"
          class="message-item outgoing-message"
        >
          <div class="message-avatar">
            <figure class="avatar body-avatar">
              <img :src="user.avatar" class="rounded-circle" alt="" />
            </figure>
            <div>
              <h5>{{ user.nickName }}</h5>
              <div class="time">
                {{ formatDate(message.createTime, "YYYY-MM-DD hh:mm") }}
                <i class="ti-check text-info"></i>
              </div>
            </div>
          </div>
          <div v-if="message.type === '0'" class="message-text message-content">
            {{ message.content }}
          </div>
          <div v-if="message.type === '1'">
            <figure class="image">
              <img
                :src="message.content"
                class="w-25 img-fluid rounded"
                alt=""
              />
            </figure>
          </div>
          <div v-if="message.type === '2'" class="message-content">
            [暂不支持语音消息]
          </div>
          <div v-if="message.type === '3'" class="message-content message-file">
            <div class="file-icon">
              <i class="fa fa-file-pdf-o"></i>
            </div>
            <div>
              <div>
                important_documents.pdf <i class="text-muted small">(50KB)</i>
              </div>
              <ul class="list-inline">
                <li class="list-inline-item mb-0"><a href="#">下载</a></li>
                <li class="list-inline-item mb-0"><a href="#">查看</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="message.senderId !== user.userId" class="message-item">
          <div class="message-avatar">
            <figure class="avatar body-avatar">
              <img :src="friend.avatar" class="rounded-circle" alt="" />
            </figure>
            <div>
              <h5>{{ friend.remark }}</h5>
              <div class="time">
                {{ formatDate(message.createTime, "YYYY-MM-DD hh:mm") }}
              </div>
            </div>
          </div>
          <div v-if="message.type === '0'" class="message-text message-content">
            {{ message.content }}
          </div>
          <div v-if="message.type === '1'">
            <figure class="image">
              <img
                :src="message.content"
                class="w-25 img-fluid rounded"
                alt=""
              />
            </figure>
          </div>
          <div v-if="message.type === '2'" class="message-content">
            [暂不支持语音消息]
          </div>
          <div v-if="message.type === '3'" class="message-content message-file">
            <div class="file-icon">
              <i class="fa fa-file-pdf-o"></i>
            </div>
            <div>
              <div>
                important_documents.pdf <i class="text-muted small">(50KB)</i>
              </div>
              <ul class="list-inline">
                <li class="list-inline-item mb-0"><a href="#">下载</a></li>
                <li class="list-inline-item mb-0"><a href="#">查看</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-footer">
      <form>
        <div>
          <button
            class="btn btn-light mr-3"
            data-toggle="tooltip"
            title="表情"
            type="button"
          >
            <i data-feather="smile"></i>
          </button>
        </div>
        <input
          type="text"
          class="form-control"
          placeholder="Write a message."
        />
        <div class="form-buttons">
          <button
            class="btn btn-light"
            data-toggle="tooltip"
            title="添加文件"
            type="button"
          >
            <i data-feather="paperclip"></i>
          </button>
          <button
            class="btn btn-light"
            data-toggle="tooltip"
            title="发送语音"
            type="button"
          >
            <i data-feather="mic"></i>
          </button>
          <button
            class="btn btn-primary"
            data-toggle="tooltip"
            title="发送"
            type="submit"
          >
            <i data-feather="send"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
  <!-- ./ chat -->
</template>

<script>
import {
  computed,
  inject,
  watch,
  ref,
  toRefs,
  reactive,
  getCurrentInstance,
  nextTick,
  onUpdated,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import moment from "moment";

export default {
  name: "Chat",
  props: {
    showChat: String,
  },
  emits: ["update:showChat"],
  setup(props, { emit }) {
    const store = useStore();
    // const socket =
    //   getCurrentInstance().appContext.config.globalProperties.socket;
    const { showChat } = toRefs(props);

    const user = inject("user");
    const friend = reactive({
      userId: "",
      avatar: "",
      remark: "",
      online: false,
    });
    const show = ref(false);
    const chatBody = ref(null);
    const chatHistories = computed(() => store.state.home.chatHistories);
    const chatList = computed(() => store.state.home.chatList);
    const compareYear = (time) =>
      moment(time).format("YYYY") === moment().format("YYYY");
    const compareDate = (time, day = 0) =>
      moment(time).format("YYYY-MM-DD") ===
      moment().subtract(day, "days").format("YYYY-MM-DD");
    const formatDate = (time, format) => moment(time).format(format);
    const getUserInfo = () => {
      store.dispatch("home/getUserInfo");
      // store.dispatch("home/getUserInfo", friendUserId.value);
    };
    const closeChat = () => {
      show.value = false;
      emit("update:showChat", "");
    };

    watch(showChat, (value) => {
      if (value === "") {
        show.value = false;
      } else {
        let chatInfo = chatList.value.find((chat) => chat.sessionId === value);
        if (chatInfo) {
          friend.userId = chatInfo.friendUserId;
          friend.avatar = chatInfo.friendAvatar;
          let remark = chatInfo.friendRemark;
          if (remark) {
            friend.remark = remark;
          } else {
            friend.remark = chatInfo.friendNickName;
          }
        }
        show.value = true;
      }
    });
    watch(chatHistories, () => {
      nextTick(() => {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
      });
    });

    return {
      user,
      friend,
      show,
      chatBody,
      chatHistories,
      compareYear,
      compareDate,
      formatDate,
      getUserInfo,
      closeChat,
    };
  },
  // data() {
  //   return {
  //     showChat: false,
  //   };
  // },
  // watch: {
  //   show(value) {
  //     this.showChat = value;
  //   },
  // },
  // computed: {
  //   ...mapState("home", {
  //     history: (state) => state.history,
  //   }),
  // },
  // methods: {
  //   closeChat() {
  //     this.showChat = false;
  //     this.$emit("update:show", this.showChat);
  //   },
  // },
};
</script>

<style scoped>
.header-avatar {
  width: 3.5rem;
  height: 3.5rem;
}
.header-online {
  padding-left: 2px;
}
.online-text {
  padding-left: 2px;
}
.header-list-item {
  padding-right: 1rem;
}
.body-avatar {
  width: 2.5rem;
  height: 2.5rem;
}
.message-text {
  font-size: 14px;
}
.image {
  display: flex;
  justify-content: flex-end;
}
.w-25 {
  width: 40% !important;
}
.btn-outline-light {
  padding: 14px 20px;
}
.btn-primary {
  padding: 9px 25px;
}
.offset-4 {
  margin-left: 13%;
}
.lead {
  font-size: 1.15rem;
  font-weight: 600;
  font-style: italic;
  margin: auto;
}
</style>
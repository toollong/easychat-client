<template>
  <el-dialog
    v-model="isShow"
    :title="showApplyForm ? '申请添加好友' : '添加好友'"
    width="570px"
    destroy-on-close
    @closed="close"
  >
    <div class="friend-add">
      <div class="user-search" v-show="!showApplyForm">
        <el-alert title="输入用户名搜索用户" type="success" center />
        <el-input
          class="search"
          v-model.trim="username"
          maxlength="11"
          size="large"
          placeholder="用户名（例如：toollong）"
          spellcheck="false"
          clearable
          @keydown.enter="searchUser"
        >
          <template #prefix><icon-ep-search /></template>
          <template #append>
            <el-button class="search-button" size="large" @click="searchUser">
              搜索
            </el-button>
          </template>
        </el-input>
        <div
          ref="searchResultRef"
          class="search-result"
          v-show="showSearchResults"
        >
          <el-scrollbar>
            <el-empty v-if="userList.length === 0" description="暂无匹配用户">
              <template #image><icon-mdi-account-search /></template>
            </el-empty>
            <el-space size="default" wrap>
              <div class="user-item" v-for="user in userList" :key="user.id">
                <div class="header">
                  <figure>
                    <el-avatar
                      :src="
                        user.avatar
                          ? 'https://toollong.icu/easychat' + user.avatar
                          : ''
                      "
                      size="large"
                      shape="square"
                      @error="() => true"
                    >
                      <img
                        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                      />
                    </el-avatar>
                  </figure>
                  <div>
                    <span>
                      {{ user.nickName }}
                      <icon-mdi-account-tie
                        v-if="user.gender === 1"
                        style="
                          font-size: 16px;
                          color: #6464ff;
                          vertical-align: text-top;
                        "
                      />
                      <icon-mdi-account-tie-woman
                        v-if="user.gender === 0"
                        style="
                          font-size: 16px;
                          color: #ff6464;
                          vertical-align: text-top;
                        "
                      />
                    </span>
                    <p>用户名：{{ user.username }}</p>
                    <p v-if="user.region">所在地：{{ user.region }}</p>
                  </div>
                </div>
                <p class="body">
                  {{
                    user.introduction
                      ? user.introduction
                      : "这个人很神秘，什么都没有写..."
                  }}
                </p>
                <el-button
                  class="foot"
                  type="primary"
                  :disabled="checkIsFriend(user.id)"
                  @click="toApply(user)"
                >
                  <span v-if="checkIsFriend(user.id)">已添加</span>
                  <span v-else><icon-ep-plus />好友</span>
                </el-button>
              </div>
            </el-space>
          </el-scrollbar>
        </div>
      </div>
      <div class="apply-form" v-show="showApplyForm">
        <el-form
          ref="formRef"
          :model="friend"
          :rules="rules"
          label-width="80px"
          hide-required-asterisk
        >
          <div class="userinfo">
            <figure>
              <el-avatar
                :src="
                  friend.avatar
                    ? 'https://toollong.icu/easychat' + friend.avatar
                    : ''
                "
                :size="60"
                shape="square"
                @error="() => true"
              >
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
            </figure>
            <div>
              <span>
                {{ friend.nickName }}
                <icon-mdi-account-tie
                  v-if="friend.gender === 1"
                  style="
                    font-size: 20px;
                    color: #6464ff;
                    vertical-align: text-top;
                  "
                />
                <icon-mdi-account-tie-woman
                  v-if="friend.gender === 0"
                  style="
                    font-size: 20px;
                    color: #ff6464;
                    vertical-align: text-top;
                  "
                />
              </span>
              <p>用户名：{{ friend.username }}</p>
            </div>
          </div>
          <el-form-item label="申请理由" prop="applyReason">
            <el-input
              type="textarea"
              v-model="friend.applyReason"
              maxlength="60"
              :rows="3"
              placeholder="输入申请理由"
              size="large"
              resize="none"
              spellcheck="false"
              show-word-limit
              clearable
            >
              <template #suffix><icon-ep-user /></template>
            </el-input>
          </el-form-item>
          <el-form-item label="设置备注" prop="remark">
            <el-input
              v-model.trim="friend.remark"
              :placeholder="friend.nickName"
              size="large"
              spellcheck="false"
              clearable
              @focus="formRef.clearValidate('remark')"
            >
              <template #suffix><icon-ep-tickets /></template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template v-if="showApplyForm" #footer>
      <span>
        <el-button size="large" @click="showApplyForm = false">返回</el-button>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="loading"
          size="large"
          @click="applyFriend(formRef)"
        >
          {{ loading ? "发送中..." : "发送" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  inject,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "vuex";
import { ElMessage, ElLoading } from "element-plus";
import { reqSearchUsers } from "@/api";
import { formatDate } from "@/utils/date";

export default {
  name: "FriendAdd",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const user = inject("user");
    const store = useStore();

    const { show } = toRefs(props);
    const isShow = ref(false);
    const close = () => {
      emit("update:show", false);
      showApplyForm.value = false;
      formRef.value.resetFields();
    };

    const friendList = computed(() => store.state.home.friendList);
    const username = ref("");
    const showSearchResults = ref(false);
    const searchResultRef = ref();
    const userList = ref([]);
    const searchUser = async () => {
      if (username.value) {
        if (username.value.length < 6 || username.value.length > 11) {
          ElMessage.warning({ message: "查无此人！", showClose: true });
          return;
        }
        let loadingInstance = ElLoading.service({
          target: searchResultRef.value,
          fullscreen: false,
          text: "搜索中...",
        });
        showSearchResults.value = true;
        let result = await reqSearchUsers({ username: username.value });
        if (result.success) {
          userList.value = result.data;
        } else {
          ElMessage.error({ message: "网络异常", showClose: true });
        }
        loadingInstance.close();
      } else {
        showSearchResults.value = false;
        userList.value = [];
      }
    };
    const checkIsFriend = (userId) => {
      let index = friendList.value.findIndex(
        (friend) => friend.friendUserId === userId
      );
      return index >= 0;
    };
    const toApply = (user) => {
      friend.userId = user.id;
      friend.username = user.username;
      friend.nickName = user.nickName;
      friend.avatar = user.avatar;
      friend.gender = user.gender;
      showApplyForm.value = true;
    };

    const friendVerifyList = computed(() => store.state.home.friendVerifyList);
    const showApplyForm = ref(false);
    const formRef = ref();
    const friend = reactive({
      userId: "",
      username: "",
      nickName: "",
      avatar: "",
      gender: 2,
      applyReason: "",
      remark: "",
    });
    const loading = ref(false);
    const rules = reactive({
      remark: [
        { max: 11, message: "备注长度不能超过11个字符！", trigger: "blur" },
      ],
    });
    const applyFriend = async (formEl) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          loading.value = true;
          let friendVerify = {
            senderId: user.userId,
            receiverId: friend.userId,
            applyReason: friend.applyReason,
            remark: friend.remark,
            status: 0,
            hasRead: 0,
            createTime: formatDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
          };
          socket.emit("sendVerify", friendVerify, (response) => {
            if (response) {
              ElMessage.success({ message: "已发送请求", showClose: true });
              showApplyForm.value = false;
              friendVerifyList.value.splice(0, 0, response);
            } else {
              ElMessage.error({ message: "网络异常", showClose: true });
            }
            loading.value = false;
          });
        } else {
          return false;
        }
      });
    };

    watch(show, () => {
      if (show.value === true) {
        isShow.value = true;
      }
    });

    return {
      isShow,
      close,
      username,
      showSearchResults,
      searchResultRef,
      userList,
      searchUser,
      checkIsFriend,
      toApply,
      showApplyForm,
      formRef,
      friend,
      loading,
      rules,
      applyFriend,
    };
  },
};
</script>

<style scoped>
.friend-add {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 20px;
}
.friend-add .user-search {
  width: 500px;
  min-height: 120px;
}
.friend-add .apply-form {
  display: flex;
  width: 400px;
  flex-flow: column nowrap;
  margin-right: 20px;
}
.search {
  margin: 10px 0;
}
.search .search-button {
  background-color: var(--color-primary-light);
  color: var(--color-white);
  border-color: var(--color-primary-light);
}
.search .search-button:hover {
  background-color: var(--color-primary-light-3);
  color: var(--color-white);
}
.search-result {
  width: 500px;
  height: 330px;
  overflow: auto;
}
.user-item {
  display: flex;
  width: 235px;
  height: 153px;
  flex-flow: column nowrap;
  border: 1px solid var(--border-color-light);
  border-radius: 5px;
  color: var(--text-color-primary);
  padding: 12px;
  overflow: hidden;
  transition: 0.3s;
}
.user-item:hover {
  box-shadow: var(--theme-box-shadow-1);
}
.user-item .header {
  display: flex;
  height: 70px;
}
.user-item .header figure {
  width: 56px;
  height: 56px;
  margin: 0;
  margin-right: 10px;
}
.user-item .header div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-item .header div span {
  font-size: 20px;
  font-weight: 600;
}
.user-item .header div p {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin: 0;
  margin-left: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-item .body {
  color: var(--text-color-regular);
  margin-top: 0;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-item .foot span {
  display: flex;
  align-items: center;
}
.apply-form .userinfo {
  display: flex;
  margin-left: 80px;
  margin-bottom: 10px;
}
.apply-form .userinfo figure {
  width: 60px;
  height: 60px;
  margin: 0;
  margin-right: 14px;
}
.apply-form .userinfo div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.apply-form .userinfo div span {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color-primary);
}
.apply-form .userinfo div p {
  color: var(--text-color-secondary);
  margin-top: 2px;
  margin-left: 1px;
}
</style>
<template>
  <el-dialog
    v-model="isShow"
    title="新朋友"
    width="26%"
    destroy-on-close
    @closed="close"
  >
    <div class="new-friends">
      <div v-show="!showAgreeForm">
        <el-table
          :data="friendVerifyList"
          height="450"
          size="large"
          :show-header="false"
        >
          <template #empty>
            <el-empty description="还没有新朋友? 赶快去添加吧">
              <template #image><icon-mdi-account-convert /></template>
            </el-empty>
          </template>
          <el-table-column type="expand">
            <template #default="{ row }">
              <div class="apply-message">
                <span>申请理由：{{ row.applyReason }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="{ row }">
              <div class="verify-info">
                <figure>
                  <el-avatar
                    :src="
                      row.senderId === user.userId
                        ? row.receiverAvatar
                        : row.senderAvatar
                    "
                    :size="50"
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
                    {{
                      row.senderId === user.userId
                        ? row.receiverNickName
                        : row.senderNickName
                    }}
                  </span>
                  <p>
                    {{
                      row.senderId === user.userId
                        ? "请求添加对方为好友"
                        : "请求添加你为好友"
                    }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="160" align="center">
            <template #default="{ row, $index }">
              <span v-if="row.senderId === user.userId">
                {{
                  row.status === 0
                    ? "等待验证"
                    : row.status === 1
                    ? "对方已同意"
                    : row.status === 2
                    ? "对方已拒绝"
                    : "已过期"
                }}
              </span>
              <div v-else>
                <el-button-group v-if="row.status === 0">
                  <el-button type="primary" @click="agreeApply(row)"
                    >同意</el-button
                  >
                  <el-button type="danger" @click="rejectApply(row, $index)"
                    >拒绝</el-button
                  >
                </el-button-group>
                <span v-else>
                  {{
                    row.status === 1
                      ? "已同意"
                      : row.status === 2
                      ? "已拒绝"
                      : "已过期"
                  }}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="showAgreeForm" class="agree-form">
        <el-form
          ref="formRef"
          :model="friend"
          :rules="rules"
          hide-required-asterisk
        >
          <div class="userinfo">
            <figure>
              <el-avatar
                :src="friend.avatar"
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
              <span>{{ friend.nickName }}</span>
              <p>
                申请理由：{{ friend.applyReason ? friend.applyReason : "无" }}
              </p>
            </div>
          </div>
          <el-form-item prop="remark">
            <span class="label">好友备注</span>
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
    <template v-if="showAgreeForm" #footer>
      <span>
        <el-button size="large" @click="showAgreeForm = false">取消</el-button>
        <el-button type="primary" size="large" @click="addFriend(formRef)">
          完成
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
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/date";

export default {
  name: "FriendVerify",
  props: {
    show: Boolean,
  },
  emits: ["update:show", "addChat"],
  setup(props, { emit }) {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const user = inject("user");
    const store = useStore();

    const { show } = toRefs(props);
    const isShow = ref(false);
    const close = () => {
      emit("update:show", false);
      showAgreeForm.value = false;
      friend.remark = "";
    };

    const friendVerifyList = computed(() => store.state.home.friendVerifyList);
    const agreeApply = (friendVerify) => {
      showAgreeForm.value = true;
      friend.userId = friendVerify.senderId;
      friend.nickName = friendVerify.senderNickName;
      friend.avatar = friendVerify.senderAvatar;
      friend.applyReason = friendVerify.applyReason;
    };
    const rejectApply = (friendVerify, index) => {
      ElMessage.warning({ message: "已拒绝", showClose: true });
      friendVerifyList.value[index].status = 2;
      socket.emit("rejectApply", friendVerify);
    };

    const showAgreeForm = ref(false);
    const formRef = ref();
    const friend = reactive({
      userId: "",
      nickName: "",
      avatar: "",
      applyReason: "",
      remark: "",
    });
    const rules = reactive({
      remark: [
        { max: 11, message: "备注长度不能超过11个字符！", trigger: "blur" },
      ],
    });
    const addFriend = async (formEl) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          let friendInfo = {
            userId: user.userId,
            friendUserId: friend.userId,
            friendRemark: friend.remark,
            createTime: formatDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
          };
          socket.emit("agreeApply", friendInfo, (response) => {
            console.log(response);
            if (response) {
              ElMessage.success({ message: "已同意", showClose: true });
              let index = friendVerifyList.value.findIndex(
                (verify) =>
                  verify.senderId === friend.userId &&
                  verify.receiverId === user.userId
              );
              if (index >= 0) {
                friendVerifyList.value[index].status = 1;
                isShow.value = false;
              }
              store.dispatch("home/getFriendList");
              // store.dispatch("home/getFriendList", user.userId);
              emit("addChat", response);
            } else {
              ElMessage.error({ message: "网络异常", showClose: true });
            }
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
      user,
      isShow,
      close,
      friendVerifyList,
      agreeApply,
      rejectApply,
      showAgreeForm,
      formRef,
      friend,
      rules,
      addFriend,
    };
  },
};
</script>

<style scoped>
.new-friends {
  padding: 20px 0;
  padding-top: 0;
}
.apply-message {
  margin-left: 64px;
}
.verify-info {
  display: flex;
  align-items: center;
}
.verify-info figure {
  width: 50px;
  height: 50px;
  margin: 8px 14px 8px 0;
}
.verify-info span {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color-primary);
}
.verify-info p {
  color: var(--text-color-secondary);
  margin: 0;
  margin-left: 1px;
}
.agree-form {
  display: flex;
  flex-flow: column nowrap;
  padding: 0 80px;
}
.agree-form .userinfo {
  display: flex;
  margin-top: 20px;
  margin-bottom: 30px;
}
.agree-form .userinfo figure {
  width: 60px;
  height: 60px;
  margin: 0;
  margin-right: 14px;
}
.agree-form .userinfo div {
  display: flex;
  flex-flow: column wrap;
}
.agree-form .userinfo div span {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color-primary);
}
.agree-form .userinfo div p {
  color: var(--text-color-secondary);
  margin: 0;
  margin-left: 1px;
}
.agree-form .label {
  font-size: 16px;
}
</style>
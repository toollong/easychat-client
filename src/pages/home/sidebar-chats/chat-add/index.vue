<template>
  <el-config-provider :locale="locale">
    <el-dialog
      v-model="isShow"
      title="新建聊天"
      width="570px"
      destroy-on-close
      @closed="close"
    >
      <div class="chat-add">
        <el-alert title="选择一个好友开始聊天" type="success" center />
        <div class="select">
          <span>好友</span>
          <el-select
            v-model="friendIndex"
            size="large"
            filterable
            clearable
            placeholder="请选择一个好友"
            no-data-text="无好友"
            no-match-text="无匹配好友"
          >
            <el-option
              v-for="(friend, index) in friendList"
              :key="friend.id"
              :label="
                friend.friendRemark
                  ? friend.friendRemark
                  : friend.friendNickName
              "
              :value="index"
              :disabled="friend.sessionId !== '0'"
            />
          </el-select>
        </div>
      </div>
      <template #footer>
        <span>
          <el-button size="large" @click="isShow = false">返回</el-button>
          <el-button type="primary" size="large" @click="addChat">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-config-provider>
</template>

<script>
import { computed, ref, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

export default {
  name: "ChatAdd",
  props: {
    show: Boolean,
  },
  emits: ["update:show", "addChat"],
  setup(props, { emit }) {
    const store = useStore();

    const { show } = toRefs(props);
    const isShow = ref(false);
    const close = () => {
      emit("update:show", false);
      friendIndex.value = null;
    };

    const friendList = computed(() => store.state.home.friendList);
    const friendIndex = ref();
    const addChat = () => {
      if (friendIndex.value >= 0) {
        emit("addChat", friendList.value[friendIndex.value]);
        isShow.value = false;
      } else {
        ElMessage.warning({ message: "请选择一个好友！", showClose: true });
      }
    };

    watch(show, () => {
      if (show.value === true) {
        isShow.value = true;
      }
    });

    return {
      locale: zhCn,
      isShow,
      close,
      friendList,
      friendIndex,
      addChat,
    };
  },
};
</script>

<style scoped>
.chat-add {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 20px 40px;
}
.chat-add .select {
  margin-top: 20px;
}
.chat-add .select span {
  font-size: 16px;
  margin-right: 20px;
}
</style>
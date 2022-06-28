<template>
  <el-dialog
    v-model="isShow"
    title="修改备注"
    width="30%"
    destroy-on-close
    @open="open"
    @closed="close(formRef)"
  >
    <div class="remark-reset">
      <el-form
        ref="formRef"
        class="form"
        :model="friend"
        :rules="rules"
        label-width="100px"
        hide-required-asterisk
      >
        <el-form-item>
          <template #label>
            <span class="label">好友昵称</span>
          </template>
          <div class="value">
            <icon-mdi-account style="font-size: 20px" />
            <span>{{ friend.nickName }}</span>
          </div>
        </el-form-item>
        <el-form-item prop="remark">
          <template #label>
            <span class="label">好友备注</span>
          </template>
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
        <el-form-item>
          <el-button
            class="form-button"
            type="primary"
            :loading="loading"
            :disabled="loading"
            size="large"
            @click="resetRemark(formRef)"
          >
            {{ loading ? "保存中..." : "保存" }}
          </el-button>
          <el-button class="form-button" size="large" @click="isShow = false">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "RemarkReset",
  props: {
    show: String,
  },
  emits: ["update:show", "resetRemark"],
  setup(props, { emit }) {
    const socket =
      getCurrentInstance().appContext.config.globalProperties.socket;
    const store = useStore();

    const { show } = toRefs(props);
    const isShow = ref(false);
    const open = () => {
      const result = friendList.value.find(
        (friend) => friend.friendUserId === show.value
      );
      if (result) {
        friend.userId = result.friendUserId;
        friend.nickName = result.friendNickName;
        friend.remark = result.friendRemark;
        oldRemark.value = result.friendRemark;
      }
    };
    const close = (formEl) => {
      emit("update:show", "");
      formEl.resetFields();
      oldRemark.value = "";
      friend.userId = "";
      friend.nickName = "";
    };

    const friendList = computed(() => store.state.home.friendList);
    const formRef = ref();
    const loading = ref(false);
    const oldRemark = ref("");
    const friend = reactive({
      userId: "",
      nickName: "",
      remark: "",
    });
    const rules = reactive({
      remark: [
        { max: 11, message: "备注长度不能超过11个字符！", trigger: "blur" },
      ],
    });
    const resetRemark = async (formEl) => {
      if (!formEl) return;
      if (friend.remark === oldRemark.value) {
        ElMessage.warning({
          message: "好友备注没有发生变化！",
          showClose: true,
        });
        return;
      }
      await formEl.validate((valid) => {
        if (valid) {
          loading.value = true;
          socket.emit(
            "resetRemark",
            friend.userId,
            friend.remark,
            (response) => {
              console.log(response);
              if (response) {
                emit("resetRemark", response);
                ElMessage.success({ message: "保存成功", showClose: true });
                loading.value = false;
                isShow.value = false;
              } else {
                ElMessage.error({ message: "网络异常", showClose: true });
              }
            }
          );
        } else {
          return false;
        }
      });
    };

    watch(show, () => {
      if (show.value) {
        isShow.value = true;
      }
    });

    return {
      isShow,
      open,
      close,
      formRef,
      loading,
      friend,
      rules,
      resetRemark,
    };
  },
};
</script>

<style scoped>
.remark-reset {
  padding: 20px 40px;
}
.remark-reset .form {
  display: flex;
  flex-flow: column nowrap;
  margin-top: 20px;
  margin-right: 50px;
}
.remark-reset .form .label {
  font-size: 16px;
  margin-right: 10px;
}
.remark-reset .form .value {
  display: flex;
  align-items: center;
  font-size: 18px;
}
.remark-reset .form .value span {
  font-weight: 600;
  margin-left: 2px;
}
.remark-reset .form .form-button {
  width: 40%;
  margin-top: 20px;
}
</style>
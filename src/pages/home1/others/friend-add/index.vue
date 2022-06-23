<template>
  <div
    class="modal fade"
    id="addFriends"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-zoom"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i data-feather="user-plus" class="mr-2"></i> 添加好友
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="close"
          >
            <i class="ti-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="alert alert-info">请输入要添加好友的用户名</div>
          <form>
            <div class="form-group">
              <label for="username" class="col-form-label">用户名</label>
              <input
                type="text"
                id="username"
                class="form-control"
                v-model.trim="username"
              />
            </div>
            <div class="form-group">
              <label for="remark" class="col-form-label">备注</label>
              <input
                type="text"
                id="remark"
                class="form-control"
                v-model.trim="remark"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="addFriend">
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import { useStore } from "vuex";
import { reqAddFriend } from "@/api";

export default {
  name: "FriendAdd",
  setup() {
    const store = useStore();

    const user = inject("user");
    const username = ref("");
    const remark = ref("");
    const addFriend = async () => {
      if (username.value.length > 11 || remark.value.length > 11) {
        alert("用户名或备注的长度不能超过11个字符！");
      } else {
        let result = await reqAddFriend({
          userId: user.userId,
          friendUsername: username.value,
          friendRemark: remark.value,
        });
        if (result.code === 200 && result.success) {
          alert("添加成功！");
          store.dispatch("home/getFriendList", user.userId);
          username.value = "";
          remark.value = "";
        } else {
          alert("添加失败，该用户不存在！");
        }
      }
    };
    const close = () => {
      username.value = "";
      remark.value = "";
    };

    return {
      user,
      username,
      remark,
      addFriend,
      close,
    };
  },
};
</script>

<style scoped>
.modal-title {
  font-weight: 600;
}
.alert-info {
  font-size: 14px;
  margin-bottom: 0.6rem;
}
</style>
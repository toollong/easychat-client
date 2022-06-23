<template>
  <el-drawer
    v-model="isShow"
    size="25%"
    :show-close="false"
    destroy-on-close
    @open="open"
    @closed="close"
  >
    <template #header="{ titleId, titleClass, close }">
      <div class="drawer-header">
        <div class="title">
          <icon-ep-postcard />
          <span :id="titleId" :class="titleClass">详细资料</span>
        </div>
        <div class="close">
          <icon-ep-close-bold @click="close" />
        </div>
      </div>
    </template>
    <div class="profile">
      <figure>
        <el-avatar :src="userInfo.avatar" :size="80" @error="() => true">
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
      </figure>
      <span>{{ remark }}</span>
      <div>
        <p>
          {{
            userInfo.introduction
              ? userInfo.introduction
              : "这个人很神秘，什么都没有写..."
          }}
        </p>
      </div>
      <div>
        <el-descriptions :column="1" direction="vertical" border>
          <el-descriptions-item label-align="left">
            <template #label>
              <span class="label">昵称</span>
            </template>
            {{ userInfo.nickName }}
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <span class="label">性别</span>
            </template>
            {{
              userInfo.gender === "2"
                ? "保密"
                : userInfo.gender === "1"
                ? "男"
                : "女"
            }}
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <span class="label">年龄</span>
            </template>
            {{ userInfo.age }}
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <span class="label">生日</span>
            </template>
            {{ moment(userInfo.birthday).format("M 月 D 日") }}
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <span class="label">邮箱</span>
            </template>
            {{ userInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <span class="label">联系方式</span>
            </template>
            {{ userInfo.phone }}
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <span class="label">地区</span>
            </template>
            {{ userInfo.region }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { computed, inject, ref, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { mockGetUserInfo } from "@/api";
import moment from "moment";

export default {
  name: "Profile",
  props: {
    show: String,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const store = useStore();
    const user = inject("user");

    const { show } = toRefs(props);
    const isShow = ref(false);
    const open = async () => {
      let result = await mockGetUserInfo();
      // let result = await reqGetUserInfo(show.value);
      if (result.code === 200) {
        userInfo.value = result.data;
        if (show.value === user.userId) {
          remark.value = result.data.nickName;
        } else {
          let friend = friendList.value.find(
            (friend) => friend.friendUserId === show.value
          );
          if (friend.friendRemark) {
            remark.value = friend.friendRemark;
          } else {
            remark.value = result.data.nickName;
          }
        }
      }
    };
    const close = () => {
      emit("update:show", "");
    };

    const userInfo = ref({});
    const remark = ref("");
    const friendList = computed(() => store.state.home.friendList);

    watch(show, () => {
      if (show.value) {
        isShow.value = true;
      }
    });

    return {
      isShow,
      open,
      close,
      userInfo,
      remark,
      moment,
    };
  },
};
</script>

<style scoped>
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--theme-color-light-2);
}
.drawer-header .title {
  display: flex;
  align-items: center;
}
.drawer-header span {
  font-size: 22px;
  color: var(--theme-color-light-2);
  margin-left: 5px;
}
.drawer-header .close {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.drawer-header .close:hover {
  color: var(--color-danger);
}
.profile {
  display: flex;
  width: 350px;
  height: 750px;
  flex-flow: column nowrap;
  margin: auto;
}
.profile figure {
  text-align: center;
  margin-top: 0;
  margin-bottom: 0;
}
.profile span {
  font-size: 26px;
  color: var(--text-color-primary);
  text-align: center;
  margin-bottom: 15px;
}
.profile p {
  color: var(--text-color-secondary);
  min-height: 30px;
  margin-top: 0;
}
.profile .label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color-regular);
}
</style>
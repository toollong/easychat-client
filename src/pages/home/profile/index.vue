<template>
  <el-drawer
    v-model="isShow"
    size="23%"
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
        <el-avatar
          :src="
            userInfo.avatar
              ? 'http://49.235.73.114:9000/easychat' + userInfo.avatar
              : ''
          "
          :size="80"
          @error="() => true"
        >
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
      </figure>
      <span class="remark">{{ remark }}</span>
      <div class="tags">
        <el-space wrap>
          <el-tag v-for="tag in tags" :key="tag">
            {{ tag }}
          </el-tag>
        </el-space>
      </div>
      <div class="introduction">
        {{
          userInfo.introduction
            ? userInfo.introduction
            : "这个人很神秘，什么都没有写..."
        }}
      </div>
      <div class="general">
        <div class="profile-item">
          <span>用户名</span>
          <p>{{ userInfo.username }}</p>
        </div>
        <el-divider border-style="dotted" />
        <div class="profile-item">
          <span>昵称</span>
          <p>{{ userInfo.nickName }}</p>
        </div>
        <el-divider border-style="dotted" />
        <div class="profile-item">
          <span>性别</span>
          <p>
            {{
              userInfo.gender === 0
                ? "女"
                : userInfo.gender === 1
                ? "男"
                : "保密"
            }}
          </p>
        </div>
        <el-divider border-style="dotted" />
        <div class="profile-item">
          <span>年龄</span>
          <p>{{ userInfo.age > 0 ? userInfo.age : "保密" }}</p>
        </div>
        <el-divider border-style="dotted" />
        <div class="profile-item">
          <span>生日</span>
          <p>
            {{
              userInfo.birthday
                ? formatDate(userInfo.birthday, "M 月 D 日")
                : "保密"
            }}
          </p>
        </div>
        <el-divider border-style="dotted" />
        <div class="profile-item">
          <span>邮箱</span>
          <p>{{ userInfo.email }}</p>
        </div>
        <el-divider border-style="dotted" />
        <div class="profile-item">
          <span>手机号</span>
          <p>{{ userInfo.phone ? userInfo.phone : "保密" }}</p>
        </div>
        <el-divider border-style="dotted" />
        <div class="profile-item">
          <span>地区</span>
          <p>{{ userInfo.region ? userInfo.region : "银河 地球" }}</p>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { computed, inject, ref, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { mockGetUserInfo, reqGetUserInfo } from "@/api";
import { formatDate } from "@/utils/date";

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
      // let result = await mockGetUserInfo();
      let result = await reqGetUserInfo({ id: show.value });
      if (result.success) {
        userInfo.value = result.data;
        tags.value = result.data.tags ? result.data.tags.split(",") : [];
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

    const friendList = computed(() => store.state.home.friendList);
    const userInfo = ref({});
    const remark = ref("");
    const tags = ref([]);

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
      tags,
      formatDate,
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
.profile .remark {
  font-size: 26px;
  color: var(--text-color-primary);
  text-align: center;
}
.profile .tags {
  text-align: center;
  margin-top: 20px;
}
.profile .introduction {
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  box-shadow: var(--theme-box-shadow-1);
  color: var(--text-color-regular);
  margin-top: 20px;
  padding: 20px;
}
.profile .general {
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  box-shadow: var(--theme-box-shadow-1);
  margin-top: 20px;
  padding: 10px 20px;
}
.profile .profile-item {
  display: flex;
  align-items: center;
}
.profile .profile-item span {
  width: 80px;
  font-size: 16px;
  color: var(--text-color-primary);
  text-align: center;
}
.profile .profile-item p {
  font-size: 16px;
  color: var(--text-color-regular);
  text-align: center;
  flex: 1;
}
.el-divider--horizontal {
  margin: 0;
}
</style>
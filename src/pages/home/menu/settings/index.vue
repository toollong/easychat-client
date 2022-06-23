<template>
  <el-drawer
    v-model="isShow"
    size="29%"
    direction="ltr"
    :show-close="false"
    destroy-on-close
    @open="open"
    @closed="close"
  >
    <template #header="{ titleId, titleClass, close }">
      <div class="drawer-header">
        <div class="title">
          <icon-ep-setting />
          <span :id="titleId" :class="titleClass">设置</span>
        </div>
        <div class="close">
          <icon-ep-close-bold @click="close" />
        </div>
      </div>
    </template>
    <div class="settings">
      <div class="status">
        <span class="status-label">状态</span>
        <el-switch
          v-model="online"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="在线"
          inactive-text="隐身"
          :loading="loading"
          :before-change="changeStatus"
          size="default"
        />
      </div>
      <div class="tags">
        <span class="tags-label">标签</span>
        <el-space wrap>
          <el-tag
            class="tags-item"
            v-for="tag in tags"
            :key="tag"
            size="large"
            effect="plain"
            @close="removeTag(tag)"
            closable
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="tags-input"
            ref="inputRef"
            v-if="inputVisible"
            v-model.trim="inputValue"
            @keyup.enter="addTag"
            @blur="addTag"
          />
          <el-button class="tags-input" v-else @click="showInput">
            + 添加标签
          </el-button>
        </el-space>
      </div>
      <div class="password">
        <el-button type="primary" @click="showPasswordReset = true">
          修改密码
        </el-button>
      </div>
    </div>
    <PasswordReset v-model:show="showPasswordReset" />
  </el-drawer>
</template>

<script>
import { nextTick, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import PasswordReset from "@/pages/home/menu/settings/password-reset";

export default {
  name: "Settings",
  components: {
    PasswordReset,
  },
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const { show } = toRefs(props);
    const isShow = ref(false);
    const open = async () => {
      online.value = true;
      tags.value = ["程序员", "时间管理大师"];
    };
    const close = () => {
      emit("update:show", false);
    };

    const online = ref(true);
    const loading = ref(false);
    const changeStatus = () => {
      loading.value = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          ElMessage.success({ message: "设置成功", showClose: true });
          loading.value = false;
          return resolve(true);
        }, 1000);
      });
    };

    const tags = ref([]);
    const inputRef = ref();
    const inputValue = ref("");
    const inputVisible = ref(false);
    const removeTag = (tag) => {
      tags.value.splice(tags.value.indexOf(tag), 1);
    };
    const showInput = () => {
      inputVisible.value = true;
      nextTick(() => {
        inputRef.value.input.focus();
      });
    };
    const addTag = () => {
      if (inputValue.value) {
        if (tags.value.length > 2) {
          ElMessage.warning({ message: "最多设置三个标签！", showClose: true });
        } else {
          tags.value.push(inputValue.value);
          ElMessage.success({ message: "添加成功", showClose: true });
        }
      }
      inputVisible.value = false;
      inputValue.value = "";
    };

    const showPasswordReset = ref(false);

    watch(show, () => {
      if (show.value === true) {
        isShow.value = true;
      }
    });

    return {
      isShow,
      open,
      close,
      online,
      loading,
      changeStatus,
      tags,
      inputRef,
      inputValue,
      inputVisible,
      removeTag,
      showInput,
      addTag,
      showPasswordReset,
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
.settings {
  display: flex;
  width: 80%;
  flex-flow: column nowrap;
  font-size: 16px;
  margin: auto;
}
.status {
  display: flex;
  align-items: center;
}
.status-label {
  color: var(--text-color-regular);
  margin-right: 30px;
}
.tags {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-top: 20px;
}
.tags-label {
  color: var(--text-color-regular);
  margin-right: 30px;
}
.tags-item {
  margin-top: 5px;
}
.tags-input {
  margin-top: 5px;
  width: 100px;
  height: 30px;
}
.password {
  margin-top: 50px;
}
</style>
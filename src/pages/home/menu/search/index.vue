<template>
  <el-dialog
    v-model="isShow"
    width="40%"
    top="10vh"
    :show-close="false"
    draggable
    destroy-on-close
    @closed="close"
  >
    <template #header="{ titleId, titleClass, close }">
      <div class="dialog-header">
        <div class="title">
          <icon-ep-search />
          <span :id="titleId" :class="titleClass">搜一搜</span>
        </div>
        <div class="close">
          <icon-ep-close-bold @click="close" />
        </div>
      </div>
    </template>
    <div class="search">
      <el-input
        v-model.trim="searchValue"
        maxlength="100"
        size="large"
        placeholder="在这里输入您想搜的内容"
        spellcheck="false"
        clearable
        @keydown.enter="search"
      >
        <template #prepend>
          <el-select
            v-model="searchSite"
            size="large"
            fit-input-width
            style="width: 100px"
          >
            <el-option label="百度" value="1" />
            <el-option label="谷歌" value="2" />
            <el-option label="必应" value="3" />
          </el-select>
        </template>
        <template #append>
          <el-button class="search-button" size="large" @click="search">
            <icon-ep-search />搜索
          </el-button>
        </template>
      </el-input>
    </div>
  </el-dialog>
</template>

<script>
import { ref, toRefs, watch } from "vue";

export default {
  name: "Search",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const { show } = toRefs(props);
    const isShow = ref(false);
    const close = () => {
      emit("update:show", false);
    };

    const searchValue = ref("");
    const searchSite = ref("1");
    const search = () => {
      if (searchValue.value) {
        let url = "";
        if (searchSite.value === "1") {
          url = "https://www.baidu.com/s?wd=" + searchValue.value + "&ie=utf-8";
        }
        if (searchSite.value === "2") {
          url = "https://www.google.com/search?q=" + searchValue.value;
        }
        if (searchSite.value === "3") {
          url = "https://cn.bing.com/search?q=" + searchValue.value;
        }
        window.open(url, "_blank");
      }
    };

    watch(show, () => {
      if (show.value === true) {
        isShow.value = true;
      }
    });

    return {
      isShow,
      close,
      searchValue,
      searchSite,
      search,
    };
  },
};
</script>

<style scoped>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--theme-color-light-2);
}
.dialog-header .title {
  display: flex;
  align-items: center;
}
.dialog-header span {
  font-size: 22px;
  color: var(--theme-color-light-2);
  margin-left: 5px;
}
.dialog-header .close {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.dialog-header .close:hover {
  color: var(--color-danger);
}
.search {
  display: flex;
  flex-flow: column nowrap;
  padding: 20px 40px;
}
.search-button {
  background-color: var(--color-primary-light) !important;
  color: var(--color-white) !important;
}
.search-button:hover {
  background-color: var(--color-primary-light-3) !important;
}
</style>
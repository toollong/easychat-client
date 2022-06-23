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
          <icon-ep-calendar />
          <span :id="titleId" :class="titleClass">日历</span>
        </div>
        <div class="close">
          <icon-ep-close-bold @click="close" />
        </div>
      </div>
    </template>
    <el-config-provider :locale="locale">
      <el-calendar ref="calendar">
        <template #header="{ date }">
          <span style="font-weight: 600; color: #409eff">
            ⭐ 要天天开心哦 ! ⭐
          </span>
          <span style="font-size: 18px; font-weight: 600; color: #409eff">
            {{ date }}
          </span>
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              plain
              @click="selectDate('prev-year')"
            >
              上一年
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              @click="selectDate('prev-month')"
            >
              上个月
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              @click="selectDate('today')"
              >今天</el-button
            >
            <el-button
              type="primary"
              size="small"
              plain
              @click="selectDate('next-month')"
            >
              下个月
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              @click="selectDate('next-year')"
            >
              下一年
            </el-button>
          </el-button-group>
        </template>
      </el-calendar>
    </el-config-provider>
  </el-dialog>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

export default {
  name: "Calendar",
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

    const calendar = ref();
    const selectDate = (value) => {
      calendar.value.selectDate(value);
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
      calendar,
      selectDate,
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
</style>
<template>
  <router-view v-if="isLoad"></router-view>
</template>

<script>
import { nextTick, provide, ref } from "vue";

export default {
  name: "App",
  setup() {
    const isLoad = ref(true);

    const reload = () => {
      isLoad.value = false;
      nextTick(() => {
        isLoad.value = true;
      });
    };

    provide("reload", reload);

    return {
      isLoad,
    };
  },
};
</script>

<style scoped>
</style>

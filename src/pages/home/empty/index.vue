<template>
  <el-empty class="empty" :image-size="1000">
    <template #image>
      <img src="/images/empty.svg" />
    </template>
    <template #description>
      <p class="description">
        所 有 的 相 遇 都 是 久 别 重 逢，该 遇 见 的 人 总 归 不 晚
      </p>
    </template>
  </el-empty>
</template>

<script>
export default {
  name: "Empty",
};
</script>

<style scoped>
.empty {
  flex: 1;
}
.empty .description {
  font-size: 20px;
}
</style>
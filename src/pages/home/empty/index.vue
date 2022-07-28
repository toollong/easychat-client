<template>
  <el-empty class="empty" :image-size="1000">
    <template #image>
      <img src="/images/empty.svg" />
    </template>
    <template #description>
      <p class="description">
        所 有 的 相 遇 都 是 久 别 重 逢，该 遇 见 的 人 总 归 不 晚
      </p>
      <div class="footer">
        <p>Copyright © 2022 toollong. All Rights Reserved.</p>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          鲁ICP备2022024710号-1
        </a>
      </div>
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
  padding-bottom: 20px;
  flex: 1;
}
.empty:deep(.el-empty__image) {
  margin-top: 40px;
}
.empty:deep(.el-empty__description) {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  flex: 1;
}
.empty .description {
  font-size: 20px;
}
.empty .footer {
  margin-bottom: 0;
}
.empty .footer p {
  margin-bottom: 5px;
}
.empty .footer a {
  color: var(--text-color-secondary);
  text-decoration: none;
}
.empty .footer a:hover {
  color: var(--color-primary-light);
}
</style>
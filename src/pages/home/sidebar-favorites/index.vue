<template>
  <div>
    <div class="favorites"></div>
  </div>
</template>

<script>
export default {
  name: "SidebarFavorites",
};
</script>

<style scoped>
.favorites {
  display: flex;
  width: 400px;
  flex-flow: column nowrap;
  flex: 1;
}
</style>
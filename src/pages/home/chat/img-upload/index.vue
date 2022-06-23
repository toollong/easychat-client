<template>
  <div class="img-upload">
    <el-upload action="#" list-type="picture-card" :auto-upload="false">
      <icon-ep-plus />
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="previewPicture(file)"
            >
              <icon-ep-zoom-in />
            </span>
            <span class="el-upload-list__item-delete">
              <icon-ep-download />
            </span>
            <span class="el-upload-list__item-delete">
              <icon-ep-delete />
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <el-image :src="dialogImageUrl" fit="contain" />
    </el-dialog>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ImgUpload",
  setup() {
    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const previewPicture = (file) => {
      dialogImageUrl.value = file.url;
      dialogVisible.value = true;
    };

    return {
      dialogVisible,
      dialogImageUrl,
      previewPicture,
    };
  },
};
</script>

<style scoped>
.img-upload {
  margin-top: 5px;
}
</style>
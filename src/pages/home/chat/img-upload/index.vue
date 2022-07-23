<template>
  <div class="img-upload">
    <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :on-preview="previewPicture"
      :on-remove="removePicture"
    >
      <icon-ep-plus />
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
    const previewPicture = (uploadFile) => {
      dialogImageUrl.value = uploadFile.url;
      dialogVisible.value = true;
    };
    const removePicture = (uploadFile, uploadFiles) => {
      console.log(uploadFile, uploadFiles);
    };

    return {
      dialogVisible,
      dialogImageUrl,
      previewPicture,
      removePicture,
    };
  },
};
</script>

<style scoped>
.img-upload {
  margin-top: 5px;
}
</style>
<template>
  <div class="file-upload">
    <el-upload
      ref="fileUploadRef"
      action="#"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <template #tip>
        <div class="el-upload__tip">
          注意：只能单个文件上传，新文件将会覆盖旧文件！
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
import { ref } from "vue";
import { genFileId } from "element-plus";

export default {
  name: "FileUpload",
  setup() {
    const fileUploadRef = ref();
    const handleExceed = (files) => {
      fileUploadRef.value.clearFiles();
      const file = files[0];
      file.uid = genFileId();
      fileUploadRef.value.handleStart(file);
    };

    return {
      fileUploadRef,
      handleExceed,
    };
  },
};
</script>

<style scoped>
.file-upload {
  margin-top: 10px;
}
</style>
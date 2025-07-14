<template>
  <div>
    <!-- 其他页面内容 -->
    <van-button type="primary" @click="openCompleteDialog"
      >触发完成弹窗</van-button
    >
    <CompleteDialog ref="completeDialogRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CompleteDialog from "./CompleteDialog.vue";

const completeDialogRef = ref(null);

const openCompleteDialog = () => {
  completeDialogRef.value.openDialog();
};
</script>

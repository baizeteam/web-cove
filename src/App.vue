<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { stopDoubleScale } from "@/utils/dom.util.ts";

onMounted(() => {
  stopDoubleScale();
});
</script>

<style lang="less">
body {
  // 禁止长按复制
  user-select: none;
}
body {
  // 禁止双击放大页面
  touch-action: manipulation;
}
</style>

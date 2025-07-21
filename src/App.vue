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
* {
  box-sizing: border-box;
}
body {
  // 禁止长按复制
  user-select: none;
  // 禁止双击放大页面
  touch-action: manipulation;
}
</style>

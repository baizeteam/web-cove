<template>
  <div>
    <ChoiceQuestion />
    <div style="height: 40px"></div>
    <!-- 用于模拟页面空间，使底部组件在下方显示 -->
    <BottomIconBar />
  </div>
</template>

<script setup>
import ChoiceQuestion from "./ChoiceQuestion.vue";
import BottomIconBar from "./BottomIconBar.vue";
</script>

<style scoped>
/* 可根据需要补充页面样式 */
</style>

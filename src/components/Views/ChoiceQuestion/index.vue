<template>
  <div>
    <ChoiceQuestion />
    <div style="height: 40px"></div>
    <!-- 用于模拟页面空间，使底部组件在下方显示 -->
    <BottomIconBar />
  </div>
</template>

<script lang="ts" setup>
import ChoiceQuestion from "./ChoiceQuestion.vue";
import BottomIconBar from "./BottomIconBar.vue";

defineOptions({
  name: "ChoiceQuestion",
});
</script>

<style scoped lang="less">
/* 可根据需要补充页面样式 */
</style>

<template>
  <div class="top-progress-bar">
    <van-icon
      name="arrow-left"
      size="20"
      color="#333"
      style="margin-right: 8px"
      @click="onBack"
    />
    <van-progress
      :percentage="progressPercent"
      color="#4fc08d"
      :stroke-width="4"
      style="flex: 1"
    />
    <span class="page-info">4/9</span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { VanIcon, VanProgress } from "vant";

const progressPercent = ref((4 / 9) * 100); // 这里根据实际页数计算进度，4是当前页，9是总页数，可传参修改

const onBack = () => {
  // 返回逻辑，比如路由返回等，可根据实际需求完善
  console.log("返回操作");
};
</script>

<style scoped>
.top-progress-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.page-info {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}
</style>

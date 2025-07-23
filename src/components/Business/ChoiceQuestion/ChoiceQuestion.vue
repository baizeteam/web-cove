<template>
  <div class="question-card">
    <!-- 进度与标题区域 -->
    <div class="header">
      <div class="progress-info">
        <span class="progress-text">2/7</span>
      </div>
      <h2 class="question-title">
        {{ data.questions }}
      </h2>
    </div>

    <!-- 代码展示区域 -->
    <div class="code-box">
      <pre>
        <code>
          {{data.code}}
        </code>
      </pre>
    </div>

    <!-- 选项区域：用 Vant Radio，默认圆形 -->
    <van-radio-group v-model="selectedOption">
      <van-radio
        v-for="(option, index) in data.options"
        :key="index"
        :name="option"
        class="radio-item"
      >
        {{ option }}
      </van-radio>
    </van-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ChoiceStep } from "@/views/stepContainer/stepConfig.ts";

interface IProps {
  data: ChoiceStep<string[]>["data"];
}

defineProps<IProps>();
// 双向绑定选中值
const selectedOption = ref("");

watch(
  selectedOption,
  (value) => {
    console.log(value, "vvv");
  },
  { deep: true },
);
</script>

<style scoped>
.question-card {
  width: 320px;
  margin: 20px auto;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.progress-info {
  font-size: 14px;
  color: #999;
}

.question-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.code-box {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.code-box pre {
  margin: 0;
  font-size: 14px;
  color: #666;
  white-space: pre-wrap;
}

.radio-item {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}
</style>

<template>
  <div class="question-card">
    <!-- 进度与标题区域 -->
    <div class="header">
      <div class="progress-info">
        <span class="progress-text">2/7</span>
      </div>
      <h2 class="question-title">以下代码的运行的结果是什么？</h2>
    </div>

    <!-- 代码展示区域 -->
    <div class="code-box">
      <pre><code>def print_double(x):
    print(2 * x)
print_double(3)</code></pre>
    </div>

    <!-- 选项区域：用 Vant Radio，默认圆形 -->
    <van-radio-group v-model="selectedOption">
      <van-radio
        v-for="(option, index) in options"
        :key="index"
        :name="option.value"
        class="radio-item"
      >
        {{ option.label }}
      </van-radio>
    </van-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { VanRadioGroup, VanRadio } from 'vant';

// 选项数据
const options = [
  { label: "A. 6", value: "A" },
  { label: "B. 2", value: "B" },
  { label: "C. 3", value: "C" },
  { label: "D. 0", value: "D" },
];
// 双向绑定选中值
const selectedOption = ref("A");
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

<template>
  <div class="choice-question">
    <p class="question-text">{{ question }}</p>
    <pre class="code-example">{{ code }}</pre>
    <van-radio-group v-model="selectedOption" @change="handleOptionChange">
      <van-radio
        v-for="(option, index) in options"
        :key="index"
        :name="option.value"
      >
        {{ option.label }}. {{ option.value }}
      </van-radio>
    </van-radio-group>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { VanRadioGroup, VanRadio } from "vant";

const question = "以下代码中使用了哪个模块？";
const code = `import math
num = 10
print(math.sqrt(num))`;
const options = [
  { label: "A", value: "math" },
  { label: "B", value: "num" },
  { label: "C", value: "sqrt" },
];
const selectedOption = ref("math"); // 初始选中答案，可根据实际情况修改

const handleOptionChange = (value) => {
  // 选项改变逻辑，比如验证答案、提交等，这里可自行扩展
  console.log("选中的选项：", value);
};
</script>

<style scoped>
.choice-question {
  padding: 16px;
}
.question-text {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
}
.code-example {
  background-color: #f8f8f8;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}
.van-radio {
  margin-bottom: 8px;
}
</style>

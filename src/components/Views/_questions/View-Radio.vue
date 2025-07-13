<template>
  <div class="radio-question">
    <div class="question-title">
      <slot name="title">题目</slot>
    </div>
    <div class="question-code">
      <slot name="code"></slot>
    </div>
    <van-radio-group v-model="proxyValue" class="radio-group">
      <van-radio
        v-for="item in options"
        :key="item.value"
        :name="item.value"
        class="radio-item"
        checked-color="#2196f3"
      >
        {{ item.label }}
      </van-radio>
    </van-radio-group>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import { RadioGroup as VanRadioGroup, Radio as VanRadio } from "vant";

defineOptions({
  name: "ViewRadio",
});
const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array as () => Array<{ label: string; value: string | number }>,
    required: true,
  },
});
const emits = defineEmits(["update:modelValue"]);

const proxyValue = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});
</script>

<style scoped>
.radio-question {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px 20px;
  max-width: 600px;
  margin: 0 auto;
}
.question-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
}
.question-code {
  font-family: "Menlo", "Consolas", monospace;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 12px 16px;
  color: #333;
  margin-bottom: 24px;
  font-size: 15px;
}
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.radio-item {
  margin-bottom: 8px;
}
</style>

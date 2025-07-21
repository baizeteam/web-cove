<template>
  <div class="step-container">
    <!-- 动态渲染组件 -->
    <component
      :is="currentComponent"
      v-bind="componentProps"
      @next="handleNext"
      @prev="handlePrev"
    />

    <!-- 导航按钮（可选，根据需求控制显隐） -->
    <div class="nav">
      <button v-if="canPrev" @click="handlePrev">上一步</button>
      <button v-if="canNext" @click="handleNext">下一步</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import ViewMd from "@/components/Views/_questions/View-Md.vue";
import ChoiceQuestion from "@/components/Business/ChoiceQuestion/index.vue";

defineOptions({
  name: "StepContainer",
});
const props = defineProps({
  stepId: String,
  stepConfig: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

// 动态判断当前该渲染什么组件
const currentComponent = computed(() => {
  const config = props.stepConfig[props.stepId];
  return config.type === "md" ? ViewMd : ChoiceQuestion;
});

// 动态传递组件参数
const componentProps = computed(() => {
  const config = props.stepConfig[props.stepId];
  return config.type === "md"
    ? { src: config.src }
    : { quizData: config.quizData };
});

// 导航逻辑（可结合业务调整，比如做题需提交后才允许下一步）
const handleNext = () => {
  const nextId = +props.stepId + 1;
  if (props.stepConfig[nextId]) {
    router.push(`/step/${nextId}`);
  }
};

const handlePrev = () => {
  const prevId = +props.stepId - 1;
  if (props.stepConfig[prevId]) {
    router.push(`/step/${prevId}`);
  }
};

// 控制按钮显隐（可选）
const canPrev = computed(() => !!props.stepConfig[+props.stepId - 1]);
const canNext = computed(() => !!props.stepConfig[+props.stepId + 1]);
</script>

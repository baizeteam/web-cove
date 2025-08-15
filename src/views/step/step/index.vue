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
import ViewMd from "@/components/Views/Md/View-Md.vue";
import ChoiceQuestion from "@/components/Business/ChoiceQuestion/index.vue";
import { getCourseByLanguageAndId } from "@/data/courses";
import { updateLearningProgress } from "@/utils/learning.util";

defineOptions({
  name: "StepContainer",
});
const props = defineProps({
  language: {
    type: String,
    required: true,
  },
  stepId: {
    type: String,
    required: true,
  },
});

// 获取课程数据
const course = computed(() => {
  return getCourseByLanguageAndId(props.language as any, props.stepId);
});

// 获取当前步骤配置
const currentStepConfig = computed(() => {
  if (!course.value) return null;
  return course.value.steps[+props.stepId];
});

const router = useRouter();

// 动态判断当前该渲染什么组件
const currentComponent = computed(() => {
  const config = currentStepConfig.value;
  if (!config) return null;
  return config.type === "md" ? ViewMd : ChoiceQuestion;
});

// 动态传递组件参数
const componentProps = computed(() => {
  const config = currentStepConfig.value;
  if (!config) return {};
  console.log(config, "config");
  return config.type === "md" ? { src: config.src } : { data: config.data };
});

// 导航逻辑（可结合业务调整，比如做题需提交后才允许下一步）
const handleNext = () => {
  const nextId = +props.stepId + 1;
  if (course.value?.steps[nextId]) {
    // 更新学习进度
    updateLearningProgress(course.value.id, +props.stepId);
    router.replace(`/step/${props.language}/${nextId}`);
  }
};

const handlePrev = () => {
  const prevId = +props.stepId - 1;
  if (course.value?.steps[prevId]) {
    router.replace(`/step/${props.language}/${prevId}`);
  }
};

// 控制按钮显隐（可选）
const canPrev = computed(() => !!course.value?.steps[+props.stepId - 1]);
const canNext = computed(() => !!course.value?.steps[+props.stepId + 1]);
</script>

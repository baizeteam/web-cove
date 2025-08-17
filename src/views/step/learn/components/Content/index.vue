<template>
  <div class="content-body">
    <ViewMd
      v-bind="contentProps"
      :key="contentKey"
      @quiz-answered="handleQuizAnswered"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ViewMd from "@/components/Views/Md/View-Md.vue";

interface Props {
  stepInfo?: any;
  courseId: string;
  chapterId: number;
  stepId: number;
}

const props = defineProps<Props>();

// 定义事件
const emit = defineEmits<{
  quizAnswered: [isCorrect: boolean, selectedAnswer: string];
}>();

// 内容渲染的 key，用于重新渲染
const contentKey = computed(
  () => `${props.courseId}-${props.chapterId}-${props.stepId}`
);

// 动态传递给 ViewMd 的 props
const contentProps = computed(() => {
  if (!props.stepInfo) return {};

  const step = props.stepInfo;

  // 检查是否是选择题或填空题（根据title判断）
  const isChoice = step.title.endsWith("-选择题");
  const isBlank = step.title.endsWith("-填空题");
  const isQuiz = isChoice || isBlank;

  return {
    src: step.content.src,
    isQuiz,
    isBlank,
    quizAnswer: isQuiz ? step.answer : undefined,
  };
});

// 处理答题事件（选择题或填空题）
const handleQuizAnswered = (isCorrect: boolean, selectedAnswer: string) => {
  emit("quizAnswered", isCorrect, selectedAnswer);
};
</script>

<style scoped>
.content-body {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 24px;
}
</style>

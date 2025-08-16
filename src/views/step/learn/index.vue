<template>
  <div class="learn-container">
    <div class="">
      <!-- 头部组件 -->
      <Header
        :step-title="stepInfo?.title"
        :chapter-id="chapterId"
        :step-id="stepId"
      />

      <!-- 内容组件 -->
      <Content
        :step-info="stepInfo"
        :course-id="courseId"
        :chapter-id="chapterId"
        :step-id="stepId"
        @quiz-answered="handleQuizAnswered"
      />

      <!-- 导航组件 -->
      <Navigation
        :navigation-info="navigationInfo"
        :can-complete-chapter="canCompleteChapter"
        :is-next-button-disabled="isNextButtonDisabled"
        @prev="handlePrev"
        @next="handleNext"
        @back-to-catalog="goBackToCatalog"
        @complete-chapter="completeCurrentChapter"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getNavigationInfo } from "../step/stepConfig";
import { updateLearningProgress } from "@/utils/learning.util";
import type { LanguageType } from "@/data/courses";

// 导入拆分的组件
import Header from "./components/Header/index.vue";
import Content from "./components/Content/index.vue";
import Navigation from "./components/Navigation/index.vue";

// 导入 hooks
import { useQuizState } from "./hooks/useQuizState";
import { useNavigation } from "./hooks/useNavigation";

const route = useRoute();

// 从路由参数获取信息
const language = computed(() => route.params.language as LanguageType);
const courseId = computed(() => route.params.id as string);
const chapterId = computed(() => parseInt(route.params.chapter as string));
const stepId = computed(() => parseInt(route.params.step as string));

// 获取导航信息
const navigationInfo = computed(() => {
  return getNavigationInfo(
    language.value,
    courseId.value,
    chapterId.value,
    stepId.value
  );
});

// 获取步骤信息
const stepInfo = computed(() => navigationInfo.value?.currentStep);

console.log(stepInfo.value, "stepInfo");

// 使用答题状态管理
const { isNextButtonDisabled, resetAnswerState, handleQuizAnswered } =
  useQuizState(courseId, chapterId, stepId, stepInfo);

// 使用导航逻辑管理
const {
  canCompleteChapter,
  goBackToCatalog,
  handleNext,
  handlePrev,
  completeCurrentChapter,
} = useNavigation(
  language,
  courseId,
  chapterId,
  stepId,
  navigationInfo,
  resetAnswerState
);

// 生命周期
onMounted(() => {
  // 重置答题状态
  resetAnswerState();

  // 更新学习进度（访问当前步骤）
  updateLearningProgress(courseId.value, chapterId.value, stepId.value, false);

  // 触发存储事件，让其他组件知道学习状态变化
  window.dispatchEvent(new Event("storage"));
});
</script>

<style lang="less" scoped>
.learn-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-area {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
}
</style>

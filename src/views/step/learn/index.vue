<template>
  <div class="learn-container">
    <!-- 当前学习内容 -->
    <div class="">
      <!-- 内容头部 -->
      <div class="content-header">
        <div class="step-info">
          <h2 class="step-title">{{ navigationInfo?.currentStep?.title }}</h2>
          <div class="step-meta">第{{ chapterId }}章 · 步骤{{ stepId }}</div>
        </div>
      </div>

      <!-- 动态内容渲染 -->
      <div class="content-body">
        <component
          :is="currentComponent"
          v-bind="componentProps"
          :key="`${courseId}-${chapterId}-${stepId}`"
          @answered="handleAnswered"
          @quiz-answered="handleQuizAnswered"
        />
      </div>

      <!-- 底部导航 -->
      <div class="navigation-controls">
        <van-button
          v-if="navigationInfo?.hasPrev"
          type="default"
          size="large"
          class="nav-button"
          @click="handlePrev"
        >
          <!--          <van-icon name="arrow-left" />-->
          上一步
        </van-button>

        <van-button
          type="default"
          size="large"
          class="nav-button catalog-button"
          @click="goBackToCatalog"
        >
          <!--          <van-icon name="home-o" />-->
          返回
        </van-button>

        <van-button
          v-if="navigationInfo?.hasNext"
          type="primary"
          size="large"
          class="nav-button"
          :disabled="isNextButtonDisabled"
          @click="handleNext"
        >
          下一步
          <!--          <van-icon name="arrow" />-->
        </van-button>

        <van-button
          v-else-if="canCompleteChapter"
          type="success"
          size="large"
          class="nav-button"
          @click="completeCurrentChapter"
        >
          结束该章
          <van-icon name="checked" />
        </van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import ViewMd from "@/components/Views/Md/View-Md.vue";
// import ChoiceQuestion from "@/components/Business/ChoiceQuestion/index.vue";
import { getNavigationInfo } from "../step/stepConfig";
import {
  updateLearningProgress,
  markChapterCompleted,
} from "@/utils/learning.util";
import type { LanguageType } from "@/data/courses";

defineOptions({
  name: "LearnContainer",
});

const router = useRouter();
const route = useRoute();

// 从路由参数获取信息
const language = computed(() => route.params.language as LanguageType); // 语言
const courseId = computed(() => route.params.id as string); // 语言简易程度
const chapterId = computed(() => parseInt(route.params.chapter as string)); // 目录id
const stepId = computed(() => parseInt(route.params.step as string)); // 章节

// 答题状态管理
const hasAnswered = ref(false);
const currentAnswer = ref("");

// 获取导航信息
const navigationInfo = computed(() => {
  return getNavigationInfo(
    language.value,
    courseId.value,
    chapterId.value,
    stepId.value
  );
});

const stepInfo = computed(() => navigationInfo.value?.currentStep);

console.log(stepInfo.value, "stepInfo");

// 计算下一步按钮是否应该禁用
const isNextButtonDisabled = computed(() => {
  const isChoiceStep = stepInfo.value?.type === "choice";
  const result = isChoiceStep && !hasAnswered.value;
  console.log("下一步按钮状态:", {
    isChoiceStep,
    hasAnswered: hasAnswered.value,
    disabled: result,
  });
  return result;
});

// 都用 Markdown 渲染
const currentComponent = computed(() => {
  return ViewMd;
});

// 动态传递组件参数
const componentProps = computed(() => {
  if (!navigationInfo.value || !stepInfo.value) return {};

  const step = stepInfo.value;
  const { type } = step.content;
  console.log((step.content as any).src, "src");

  // 检查是否是选择题
  const isQuiz = step.type === "choice";

  return {
    src: type === "md" ? (step.content as any).src : "",
    isQuiz,
    quizAnswer: isQuiz ? step.answer : undefined,
  };
});

// 是否可以完成章节
const canCompleteChapter = computed(() => {
  if (!navigationInfo.value) return false;

  const chapter = navigationInfo.value.currentChapter;

  // 检查是否所有步骤都已完成
  return (
    chapter.steps.every(step => {
      // 这里需要实现检查步骤是否完成的逻辑
      // 为了简化，我们暂时只在章节的最后一步显示该按钮
      return step.id <= stepId.value;
    }) && stepId.value === chapter.steps[chapter.steps.length - 1].id
  );
});

// 返回目录
const goBackToCatalog = () => {
  router.push(`/step/${language.value}/${courseId.value}`);
};

// 处理选择题答题事件
const handleAnswered = (answered: boolean, answer: string) => {
  hasAnswered.value = answered;
  currentAnswer.value = answer;
  console.log("答题状态:", answered, "答案:", answer);
};

// 处理Markdown选择题答题事件
const handleQuizAnswered = (isCorrect: boolean, selectedAnswer: string) => {
  hasAnswered.value = true;
  currentAnswer.value = selectedAnswer;
  console.log(
    "选择题答题:",
    isCorrect ? "正确" : "错误",
    "答案:",
    selectedAnswer,
    "hasAnswered:",
    hasAnswered.value
  );
};

// 重置答题状态
const resetAnswerState = () => {
  hasAnswered.value = false;
  currentAnswer.value = "";
};

// 导航逻辑
const handleNext = () => {
  if (!navigationInfo.value || !navigationInfo.value.hasNext) return;

  // 标记当前步骤完成
  updateLearningProgress(courseId.value, chapterId.value, stepId.value, true);

  // 触发存储事件，让其他组件知道学习状态变化
  window.dispatchEvent(new Event("storage"));

  // 重置答题状态
  resetAnswerState();

  // 跳转到下一步
  router.push(
    `/step/${language.value}/${courseId.value}/${navigationInfo.value.nextChapter}/${navigationInfo.value.nextStep}`
  );
};

const handlePrev = () => {
  if (!navigationInfo.value || !navigationInfo.value.hasPrev) return;

  // 重置答题状态
  resetAnswerState();

  // 跳转到上一步
  router.push(
    `/step/${language.value}/${courseId.value}/${navigationInfo.value.prevChapter}/${navigationInfo.value.prevStep}`
  );
};

const completeCurrentChapter = () => {
  if (!navigationInfo.value) return;

  // 先标记当前步骤完成
  updateLearningProgress(courseId.value, chapterId.value, stepId.value, true);

  // 标记章节完成
  if (markChapterCompleted(courseId.value, chapterId.value)) {
    console.log(`第${chapterId.value}章已完成`);

    // 触发存储事件，让其他组件知道学习状态变化
    window.dispatchEvent(new Event("storage"));

    // 返回目录页面
    goBackToCatalog();
  } else {
    console.log(`第${chapterId.value}章无法完成，请先完成所有步骤`);
  }
};

// 监听步骤变化，重置答题状态
watch(
  [courseId, chapterId, stepId],
  () => {
    resetAnswerState();
  },
  { immediate: false }
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
  //height: calc(100vh - 200px); /* Adjust for header and footer */
}

.content-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #262626;
}

.step-meta {
  font-size: 14px;
  color: #8c8c8c;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.content-body {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 24px;
}

.navigation-controls {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-button:active {
  transform: scale(0.98);
}

.nav-button:hover {
  background-color: #f0f0f0;
}

.catalog-button {
  background-color: #f0f0f0;
  color: #595959;
}

.catalog-button:hover {
  background-color: #e0e0e0;
  color: #1890ff;
}
</style>

<template>
  <div class="learn-container">
    <!-- 内容头部 -->
    <div v-if="navigationInfo" class="content-header">
      <button class="back-to-catalog" @click="goBackToCatalog">
        <van-icon name="arrow-left" />
        返回目录
      </button>
      <div class="content-info">
        <h3 class="content-title">
          {{
            navigationInfo.currentStep.title ||
            `步骤 ${navigationInfo.currentStep.id}`
          }}
        </h3>
        <span class="content-location">
          第{{ navigationInfo.currentChapter.id }}章 · 步骤{{
            navigationInfo.currentStep.id
          }}
        </span>
      </div>
    </div>

    <!-- 动态渲染组件 -->
    <component
      :is="currentComponent"
      v-if="currentComponent && navigationInfo"
      v-bind="componentProps"
      @next="handleNext"
      @prev="handlePrev"
    />

    <!-- 导航按钮 -->
    <div v-if="navigationInfo" class="content-nav">
      <van-button
        v-if="navigationInfo.hasPrev"
        type="default"
        size="large"
        @click="handlePrev"
      >
        上一步
      </van-button>
      <van-button
        v-if="navigationInfo.hasNext"
        type="primary"
        size="large"
        @click="handleNext"
      >
        下一步
      </van-button>
      <van-button
        v-if="canCompleteChapter"
        type="success"
        size="large"
        @click="completeCurrentChapter"
      >
        结束该章
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ViewMd from "@/components/Views/Md/View-Md.vue";
import ChoiceQuestion from "@/components/Business/ChoiceQuestion/index.vue";
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

// 动态判断当前该渲染什么组件
const currentComponent = computed(() => {
  if (!navigationInfo.value) return null;
  const step = navigationInfo.value.currentStep;
  return step.type === "md" ? ViewMd : ChoiceQuestion;
});

// 动态传递组件参数
const componentProps = computed(() => {
  if (!navigationInfo.value) return {};
  const step = navigationInfo.value.currentStep;

  if (step.type === "md") {
    return { src: step.content.src };
  } else {
    return { data: step.content.data };
  }
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

// 导航逻辑
const handleNext = () => {
  if (!navigationInfo.value || !navigationInfo.value.hasNext) return;

  // 标记当前步骤完成
  updateLearningProgress(courseId.value, chapterId.value, stepId.value, true);

  // 触发存储事件，让其他组件知道学习状态变化
  window.dispatchEvent(new Event("storage"));

  // 跳转到下一步
  router.push(
    `/step/${language.value}/${courseId.value}/${navigationInfo.value.nextChapter}/${navigationInfo.value.nextStep}`
  );
};

const handlePrev = () => {
  if (!navigationInfo.value || !navigationInfo.value.hasPrev) return;

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

// 生命周期
onMounted(() => {
  // 更新学习进度（访问当前步骤）
  updateLearningProgress(courseId.value, chapterId.value, stepId.value, false);

  // 触发存储事件，让其他组件知道学习状态变化
  window.dispatchEvent(new Event("storage"));
});
</script>

<style scoped>
.learn-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
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

.back-to-catalog {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  color: #595959;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-catalog:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.content-info {
  flex: 1;
}

.content-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #262626;
}

.content-location {
  font-size: 14px;
  color: #8c8c8c;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.content-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>

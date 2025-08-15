<template>
  <div class="step-container">
    <!-- 章节信息 -->
    <div v-if="course && currentChapter" class="chapter-header">
      <div class="chapter-info">
        <h2 class="chapter-title">{{ currentChapter.title }}</h2>
        <p v-if="currentChapter.description" class="chapter-description">
          {{ currentChapter.description }}
        </p>
      </div>
      <div class="chapter-progress">
        <span class="progress-text">
          第 {{ currentChapter.id }} 章 / 共 {{ totalChapters }} 章
        </span>
        <van-progress
          :percentage="chapterProgress"
          :show-pivot="false"
          stroke-width="4"
          color="#1890ff"
        />
      </div>
    </div>

    <!-- 步骤信息 -->
    <div v-if="currentStep" class="step-header">
      <div class="step-info">
        <h3 class="step-title">
          {{ currentStep.title || `步骤 ${currentStep.id}` }}
        </h3>
        <span class="step-counter">
          步骤 {{ currentStep.id }} / 章节 {{ currentChapter?.id }}
        </span>
      </div>
    </div>

    <!-- 动态渲染组件 -->
    <component
      :is="currentComponent"
      v-if="currentComponent"
      v-bind="componentProps"
      @next="handleNext"
      @prev="handlePrev"
    />

    <!-- 导航按钮 -->
    <div class="nav">
      <button v-if="canPrev" class="nav-btn prev-btn" @click="handlePrev">
        上一步
      </button>
      <button v-if="canNext" class="nav-btn next-btn" @click="handleNext">
        下一步
      </button>
    </div>

    <!-- 章节导航 -->
    <div class="chapter-nav">
      <h4>章节导航</h4>
      <div class="chapter-list">
        <div
          v-for="chapter in course?.chapters"
          :key="chapter.id"
          class="chapter-item"
          :class="{
            current: chapter.id === currentChapterId,
            completed: isChapterCompleted(chapter.id),
          }"
          @click="goToChapter(chapter.id)"
        >
          <div class="chapter-item-header">
            <span class="chapter-number">{{ chapter.id }}</span>
            <span class="chapter-title">{{ chapter.title }}</span>
          </div>
          <div class="chapter-steps">
            <span
              v-for="step in chapter.steps"
              :key="step.id"
              class="step-dot"
              :class="{
                current: step.id === currentStepId,
                completed: isStepCompleted(chapter.id, step.id),
              }"
              @click.stop="goToStep(chapter.id, step.id)"
            >
              {{ step.id }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import ViewMd from "@/components/Views/Md/View-Md.vue";
import ChoiceQuestion from "@/components/Business/ChoiceQuestion/index.vue";
import {
  getCourseByLanguageAndId,
  getTotalChapters,
  getChapterStepsCount,
} from "@/data/courses";
import {
  updateLearningProgress,
  getCurrentLearningPosition,
  getCourseLearningStats,
} from "@/utils/learning.util";

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

const router = useRouter();

// 获取课程数据
const course = computed(() => {
  return getCourseByLanguageAndId(props.language as any, props.stepId);
});

// 当前章节ID和步骤ID
const currentChapterId = computed(() => {
  const position = getCurrentLearningPosition(props.stepId);
  return position ? position.chapter : 1;
});

const currentStepId = computed(() => {
  const position = getCurrentLearningPosition(props.stepId);
  return position ? position.step : parseInt(props.stepId);
});

// 当前章节
const currentChapter = computed(() => {
  if (!course.value) return null;
  return course.value.chapters.find((ch) => ch.id === currentChapterId.value);
});

// 当前步骤
const currentStep = computed(() => {
  if (!course.value || !currentChapter.value) return null;
  return currentChapter.value.steps.find(
    (step) => step.id === currentStepId.value,
  );
});

// 总章节数
const totalChapters = computed(() => {
  return course.value ? getTotalChapters(course.value) : 0;
});

// 章节进度
const chapterProgress = computed(() => {
  if (!course.value || !currentChapter.value) return 0;
  const chapterSteps = getChapterStepsCount(
    course.value,
    currentChapterId.value,
  );
  const completedInChapter = currentChapter.value.steps.filter((step) =>
    isStepCompleted(currentChapterId.value, step.id),
  ).length;
  return Math.round((completedInChapter / chapterSteps) * 100);
});

// 动态判断当前该渲染什么组件
const currentComponent = computed(() => {
  const step = currentStep.value;
  if (!step) return null;
  return step.type === "md" ? ViewMd : ChoiceQuestion;
});

// 动态传递组件参数
const componentProps = computed(() => {
  const step = currentStep.value;
  if (!step) return {};

  if (step.type === "md") {
    return { src: step.content.src };
  } else {
    return { data: step.content.data };
  }
});

// 检查步骤是否完成
const isStepCompleted = (chapterId: number, stepId: number): boolean => {
  const stats = getCourseLearningStats(props.stepId);
  if (!stats) return false;

  const stepKey = `${chapterId}-${stepId}`;
  return String(stats.completedSteps).includes(stepKey);
};

// 检查章节是否完成
const isChapterCompleted = (chapterId: number): boolean => {
  if (!course.value) return false;

  const chapter = course.value.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return false;

  return chapter.steps.every((step) => isStepCompleted(chapterId, step.id));
};

// 导航逻辑
const handleNext = () => {
  if (!course.value || !currentChapter.value || !currentStep.value) return;

  const currentStepIndex = currentChapter.value.steps.findIndex(
    (step) => step.id === currentStep.value!.id,
  );

  if (currentStepIndex < currentChapter.value.steps.length - 1) {
    // 同一章节内的下一步
    const nextStep = currentChapter.value.steps[currentStepIndex + 1];
    goToStep(currentChapter.value.id, nextStep.id);
  } else {
    // 下一章节的第一步
    const nextChapter = course.value.chapters.find(
      (ch) => ch.id === currentChapter.value!.id + 1,
    );
    if (nextChapter && nextChapter.steps.length > 0) {
      goToStep(nextChapter.id, nextChapter.steps[0].id);
    }
  }
};

const handlePrev = () => {
  if (!course.value || !currentChapter.value || !currentStep.value) return;

  const currentStepIndex = currentChapter.value.steps.findIndex(
    (step) => step.id === currentStep.value!.id,
  );

  if (currentStepIndex > 0) {
    // 同一章节内的上一步
    const prevStep = currentChapter.value.steps[currentStepIndex - 1];
    goToStep(currentChapter.value.id, prevStep.id);
  } else {
    // 上一章节的最后一步
    const prevChapter = course.value.chapters.find(
      (ch) => ch.id === currentChapter.value!.id - 1,
    );
    if (prevChapter && prevChapter.steps.length > 0) {
      const lastStep = prevChapter.steps[prevChapter.steps.length - 1];
      goToStep(prevChapter.id, lastStep.id);
    }
  }
};

// 跳转到指定章节
const goToChapter = (chapterId: number) => {
  if (!course.value) return;

  const chapter = course.value.chapters.find((ch) => ch.id === chapterId);
  if (chapter && chapter.steps.length > 0) {
    goToStep(chapterId, chapter.steps[0].id);
  }
};

// 跳转到指定步骤
const goToStep = (chapterId: number, stepId: number) => {
  // 更新学习进度
  updateLearningProgress(props.stepId, chapterId, stepId);

  // 跳转路由
  router.replace(`/step/${props.language}/${props.stepId}`);
};

// 控制按钮显隐
const canPrev = computed(() => {
  if (!course.value || !currentChapter.value || !currentStep.value)
    return false;

  const currentStepIndex = currentChapter.value.steps.findIndex(
    (step) => step.id === currentStep.value!.id,
  );
  return currentStepIndex > 0 || currentChapter.value.id > 1;
});

const canNext = computed(() => {
  if (!course.value || !currentChapter.value || !currentStep.value)
    return false;

  const currentStepIndex = currentChapter.value.steps.findIndex(
    (step) => step.id === currentStep.value!.id,
  );
  return (
    currentStepIndex < currentChapter.value.steps.length - 1 ||
    currentChapter.value.id < totalChapters.value
  );
});
</script>

<style scoped>
.step-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.chapter-header {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chapter-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #262626;
}

.chapter-description {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.chapter-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 14px;
  color: #595959;
  min-width: 120px;
}

.step-header {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #262626;
}

.step-counter {
  font-size: 12px;
  color: #8c8c8c;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
}

.nav-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-btn {
  background: #f5f5f5;
  color: #595959;
}

.prev-btn:hover {
  background: #e8e8e8;
}

.next-btn {
  background: #1890ff;
  color: white;
}

.next-btn:hover {
  background: #40a9ff;
}

.chapter-nav {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chapter-nav h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #262626;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chapter-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.chapter-item.current {
  border-color: #1890ff;
  background: #f0f8ff;
}

.chapter-item.completed {
  border-color: #52c41a;
  background: #f6ffed;
}

.chapter-item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.chapter-number {
  background: #1890ff;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.chapter-item.completed .chapter-number {
  background: #52c41a;
}

.chapter-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.chapter-steps {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-dot:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.step-dot.current {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}

.step-dot.completed {
  background: #52c41a;
  border-color: #52c41a;
  color: white;
}
</style>

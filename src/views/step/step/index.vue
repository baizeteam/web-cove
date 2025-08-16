<template>
  <div class="step-container">
    <!-- 课程头部信息 -->
    <div v-if="course" class="course-header">
      <div class="course-info">
        <h1 class="course-title">{{ course.title }}</h1>
        <p class="course-description">{{ course.description }}</p>
        <div class="course-meta">
          <span class="course-language">{{
            getLanguageText(course.type)
          }}</span>
          <span class="course-difficulty">{{
            getDifficultyText(course.difficulty)
          }}</span>
          <span class="course-steps">共 {{ totalSteps }} 步骤</span>
        </div>
      </div>
      <div class="course-progress">
        <div class="progress-info">
          <span class="progress-text">总体进度</span>
          <span class="progress-percentage">{{ overallProgress }}%</span>
        </div>
        <van-progress
          :percentage="overallProgress"
          :show-pivot="false"
          stroke-width="8"
          color="#1890ff"
        />
      </div>
    </div>

    <!-- 继续学习按钮 -->
    <div v-if="course" class="continue-learning">
      <van-button
        type="primary"
        size="large"
        round
        block
        @click="continueLearning"
      >
        {{ hasLearningProgress ? "继续学习" : "开始学习" }}
      </van-button>
      <div v-if="hasLearningProgress" class="last-study-info">
        上次学习：第{{ currentChapterId }}章 · 步骤{{ currentStepId }}
      </div>
    </div>

    <!-- 章节目录 -->
    <div v-if="course" class="chapters-container">
      <h2 class="chapters-title">课程章节</h2>
      <div class="chapters-list">
        <div
          v-for="chapter in course.chapters"
          :key="chapter.id"
          class="chapter-item"
          :class="{
            current: chapter.id === currentChapterId,
            completed: checkChapterCompleted(chapter.id),
            expanded: expandedChapters.includes(chapter.id),
          }"
        >
          <!-- 章节头部 -->
          <div class="chapter-header" @click="toggleChapter(chapter.id)">
            <div class="chapter-info">
              <div class="chapter-title-section">
                <span class="chapter-number">{{ chapter.id }}</span>
                <h3 class="chapter-title">{{ chapter.title }}</h3>
                <van-icon
                  :name="
                    expandedChapters.includes(chapter.id)
                      ? 'arrow-down'
                      : 'arrow'
                  "
                  class="expand-icon"
                />
              </div>
              <p v-if="chapter.description" class="chapter-description">
                {{ chapter.description }}
              </p>
            </div>
            <div class="chapter-status">
              <div class="chapter-progress">
                <span class="progress-text">
                  {{ getChapterCompletedSteps(chapter.id) }}/{{
                    chapter.steps.length
                  }}
                </span>
                <van-progress
                  :percentage="getChapterProgress(chapter.id)"
                  :show-pivot="false"
                  stroke-width="4"
                  color="#52c41a"
                />
              </div>
              <div class="chapter-actions">
                <van-button
                  v-if="
                    !checkChapterCompleted(chapter.id) &&
                    canCompleteChapter(chapter.id)
                  "
                  type="success"
                  size="small"
                  @click.stop="completeChapter(chapter.id)"
                >
                  结束该章
                </van-button>
                <van-icon
                  v-else-if="checkChapterCompleted(chapter.id)"
                  name="success"
                  color="#52c41a"
                  size="20"
                />
              </div>
            </div>
          </div>

          <!-- 章节步骤列表 -->
          <div
            v-if="expandedChapters.includes(chapter.id)"
            class="chapter-steps"
          >
            <div
              v-for="step in chapter.steps"
              :key="step.id"
              class="step-item"
              :class="{
                current:
                  step.id === currentStepId && chapter.id === currentChapterId,
                completed: isStepCompleted(chapter.id, step.id),
                accessible: isStepAccessible(chapter.id, step.id),
              }"
              @click="goToStep(chapter.id, step.id)"
            >
              <div class="step-info">
                <span class="step-number">{{ step.id }}</span>
                <span class="step-title">{{
                  step.title || `步骤 ${step.id}`
                }}</span>
                <span class="step-type">{{ getStepTypeText(step.type) }}</span>
              </div>
              <div class="step-status">
                <van-icon
                  v-if="isStepCompleted(chapter.id, step.id)"
                  name="success"
                  color="#52c41a"
                  size="16"
                />
                <van-icon
                  v-else-if="
                    step.id === currentStepId && chapter.id === currentChapterId
                  "
                  name="play-circle-o"
                  color="#1890ff"
                  size="16"
                />
                <van-icon v-else name="circle-o" color="#d9d9d9" size="16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCourseByLanguageAndId, getTotalSteps } from "@/data/courses";
import {
  updateLearningProgress,
  getCurrentLearningPosition,
  getCourseLearningStats,
  markChapterCompleted,
  isChapterCompleted,
  enrollCourse,
  isEnrolled,
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

// 响应式数据
const expandedChapters = ref<number[]>([]);

// 获取课程数据
const course = computed(() => {
  return getCourseByLanguageAndId(props.language as any, props.stepId);
});

// 检查是否有学习进度
const hasLearningProgress = computed(() => {
  return isEnrolled(props.stepId);
});

// 当前章节ID和步骤ID
const currentChapterId = computed(() => {
  const position = getCurrentLearningPosition(props.stepId);
  return position ? position.chapter : 1;
});

const currentStepId = computed(() => {
  const position = getCurrentLearningPosition(props.stepId);
  return position ? position.step : 1;
});

const totalSteps = computed(() => {
  return course.value ? getTotalSteps(course.value) : 0;
});

// 总体进度
const overallProgress = computed(() => {
  if (!course.value) return 0;
  const stats = getCourseLearningStats(props.stepId);
  return stats ? stats.progress : 0;
});

// 继续学习
const continueLearning = () => {
  if (!hasLearningProgress.value) {
    // 如果没有学习记录，则自动注册课程
    enrollCourse(props.stepId, props.language as any);

    // 触发存储事件，让其他组件知道学习状态变化
    window.dispatchEvent(new Event("storage"));
  }

  // 跳转到学习页面
  const chapterId = currentChapterId.value;
  const stepId = currentStepId.value;
  router.push(`/step/${props.language}/${props.stepId}/${chapterId}/${stepId}`);
};

// 方法
const toggleChapter = (chapterId: number) => {
  const index = expandedChapters.value.indexOf(chapterId);
  if (index > -1) {
    expandedChapters.value.splice(index, 1);
  } else {
    expandedChapters.value.push(chapterId);
  }
};

const goToStep = (chapterId: number, stepId: number) => {
  // 如果没有学习记录，自动注册课程
  if (!hasLearningProgress.value) {
    enrollCourse(props.stepId, props.language as any);
  }

  // 更新学习进度
  updateLearningProgress(props.stepId, chapterId, stepId);

  // 触发存储事件，让其他组件知道学习状态变化
  window.dispatchEvent(new Event("storage"));

  // 跳转到具体的学习页面
  router.push(`/step/${props.language}/${props.stepId}/${chapterId}/${stepId}`);
};

const completeChapter = (chapterId: number) => {
  if (markChapterCompleted(props.stepId, chapterId)) {
    // 章节完成后的处理
    console.log(`第${chapterId}章已完成`);

    // 可选：自动展开下一章
    const nextChapter = course.value?.chapters.find(
      ch => ch.id === chapterId + 1
    );
    if (nextChapter && !expandedChapters.value.includes(nextChapter.id)) {
      expandedChapters.value.push(nextChapter.id);
    }
  } else {
    console.log(`第${chapterId}章无法完成，请先完成所有步骤`);
  }
};

// 检查步骤是否完成
const isStepCompleted = (chapterId: number, stepId: number): boolean => {
  const stats = getCourseLearningStats(props.stepId);
  if (!stats) return false;

  const stepKey = `${chapterId}-${stepId}`;
  return String(stats.completedSteps).includes(stepKey);
};

// 检查章节是否完成
const checkChapterCompleted = (chapterId: number): boolean => {
  return isChapterCompleted(props.stepId, chapterId);
};

// 检查步骤是否可访问
const isStepAccessible = (chapterId: number): boolean => {
  // 第一章的所有步骤都可以访问
  if (chapterId === 1) return true;

  // 其他章节需要前一章完成
  const prevChapter = course.value?.chapters.find(
    ch => ch.id === chapterId - 1
  );
  if (prevChapter) {
    return checkChapterCompleted(chapterId - 1);
  }

  return false;
};

// 检查是否可以完成章节
const canCompleteChapter = (chapterId: number): boolean => {
  if (!course.value) return false;

  const chapter = course.value.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return false;

  // 检查是否所有步骤都已完成
  return chapter.steps.every(step => isStepCompleted(chapterId, step.id));
};

// 获取章节进度
const getChapterProgress = (chapterId: number): number => {
  if (!course.value) return 0;

  const chapter = course.value.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return 0;

  const completedSteps = chapter.steps.filter(step =>
    isStepCompleted(chapterId, step.id)
  ).length;

  return Math.round((completedSteps / chapter.steps.length) * 100);
};

// 获取章节已完成步骤数
const getChapterCompletedSteps = (chapterId: number): number => {
  if (!course.value) return 0;

  const chapter = course.value.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return 0;

  return chapter.steps.filter(step => isStepCompleted(chapterId, step.id))
    .length;
};

// 获取步骤类型文本
const getStepTypeText = (type: string): string => {
  const typeMap = {
    md: "文档",
    choice: "练习",
  };
  return typeMap[type as keyof typeof typeMap] || type;
};

// 获取语言文本
const getLanguageText = (language: string): string => {
  const languageMap = {
    python: "Python",
    javascript: "JavaScript",
    html: "HTML & CSS",
  };
  return languageMap[language as keyof typeof languageMap] || language;
};

// 获取难度文本
const getDifficultyText = (difficulty: string): string => {
  const difficultyMap = {
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
  };
  return difficultyMap[difficulty as keyof typeof difficultyMap] || difficulty;
};

// 生命周期
onMounted(() => {
  // 默认展开第一章
  if (course.value && course.value.chapters.length > 0) {
    expandedChapters.value.push(1);
  }
});
</script>

<style scoped>
.step-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.course-header {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.course-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #262626;
}

.course-description {
  font-size: 16px;
  color: #595959;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.course-language,
.course-difficulty,
.course-steps {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.course-language {
  background: #e6f7ff;
  color: #1890ff;
}

.course-difficulty {
  background: #f6ffed;
  color: #52c41a;
}

.course-steps {
  background: #f5f5f5;
  color: #595959;
}

.course-progress {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-text {
  font-size: 14px;
  color: #595959;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.continue-learning {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.last-study-info {
  margin-top: 12px;
  font-size: 14px;
  color: #8c8c8c;
}

.chapters-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.chapters-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #262626;
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter-item {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
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

.chapter-header {
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background-color 0.3s ease;
}

.chapter-header:hover {
  background-color: #fafafa;
}

.chapter-info {
  flex: 1;
}

.chapter-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.chapter-number {
  background: #1890ff;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.chapter-item.completed .chapter-number {
  background: #52c41a;
}

.chapter-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #262626;
}

.expand-icon {
  color: #8c8c8c;
  transition: transform 0.3s ease;
}

.chapter-item.expanded .expand-icon {
  transform: rotate(180deg);
}

.chapter-description {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.5;
}

.chapter-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.chapter-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: #595959;
}

.chapter-actions {
  display: flex;
  align-items: center;
}

.chapter-steps {
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.step-item {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.step-item:last-child {
  border-bottom: none;
}

.step-item:hover {
  background-color: #f0f0f0;
}

.step-item.current {
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
}

.step-item.completed {
  background-color: #f6ffed;
}

.step-item:not(.accessible) {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-number {
  background: #f0f0f0;
  color: #595959;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
}

.step-item.current .step-number {
  background: #1890ff;
  color: white;
}

.step-item.completed .step-number {
  background: #52c41a;
  color: white;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.step-type {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  background: #f0f0f0;
  color: #595959;
}
</style>

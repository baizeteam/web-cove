<template>
  <div class="step-container">
    <!-- 课程头部信息 -->
    <div v-if="course" class="course-header">
      <div class="course-info">
        <div class="course-title-row">
          <h1 class="course-title">{{ course.title }}</h1>
          <van-icon
            :name="checkIsFavorited(`course-${course.id}`) ? 'star' : 'star-o'"
            :color="
              checkIsFavorited(`course-${course.id}`) ? '#ffd700' : '#ccc'
            "
            size="24"
            class="course-favorite-icon"
            @click="toggleCourseFavorite"
          />
        </div>

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
                <span class="step-type">{{ getStepTypeText(step) }}</span>
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
import { getTotalSteps } from "@/data/courses";
import { useCoursesStore } from "@/stores/courses.store";
import {
  updateLearningProgress,
  getCurrentLearningPosition,
  getCourseLearningStats,
  isChapterCompleted,
  enrollCourse,
  isEnrolled,
} from "@/utils/learning.util";
import { isFavorited, toggleFavorite } from "@/utils/favorites.util";

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
const coursesStore = useCoursesStore();

// 响应式数据
const expandedChapters = ref<number[]>([]);
const favoritesUpdate = ref(0); // 用于强制更新收藏状态的响应式变量

// 获取课程数据
const course = computed(() => {
  return coursesStore.getCourseByLanguageAndId(
    props.language as any,
    props.stepId
  );
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

// 检查收藏状态 - 响应式版本
const checkIsFavorited = (id: string): boolean => {
  // 触发响应式更新
  console.log("课程详情收藏检查:", id, favoritesUpdate.value);
  return isFavorited(id);
};

// 切换课程收藏状态
const toggleCourseFavorite = () => {
  if (course.value) {
    toggleFavorite({
      id: `course-${course.value.id}`,
      type: "course",
      title: course.value.title,
      language: course.value.type,
      courseId: course.value.id,
    });
    // 强制更新收藏状态
    favoritesUpdate.value++;
  }
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
const getStepTypeText = (step: any): string => {
  if (step.title.endsWith("-选择题")) {
    return "选择题";
  } else if (step.title.endsWith("-填空题")) {
    return "填空题";
  } else {
    return "文档";
  }
};

// 使用 store 中的方法，避免重复定义
const { getLanguageText, getDifficultyText } = coursesStore;

// 生命周期
onMounted(() => {
  // 默认展开第一章
  if (course.value && course.value.chapters.length > 0) {
    expandedChapters.value.push(1);
  }

  // 监听收藏更新事件
  window.addEventListener("favorites-updated", () => {
    favoritesUpdate.value++;
  });
});
</script>

<style scoped>
@import "./index.css";
</style>

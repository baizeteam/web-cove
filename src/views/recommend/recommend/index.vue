<template>
  <ViewLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
      <van-search
        v-model="searchValue"
        placeholder="python · html · java..."
        action-text="搜索"
        :background="layoutStore.header.backgroundColor"
        @focus="router.push('/search')"
      />
    </template>
    <div class="recommend-content">
      <!-- 语言分类标签 -->
      <div class="language-tabs">
        <van-tabs v-model:active="activeLanguage" @change="onLanguageChange">
          <van-tab
            v-for="lang in availableLanguages"
            :key="lang.type"
            :title="lang.title"
            :name="lang.type"
          />
        </van-tabs>
      </div>

      <!-- 课程列表 -->
      <div class="courses-container">
        <div class="course-grid">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="course-card"
            @click="handleCourseClick(course)"
          >
            <div class="course-header">
              <img :src="course.icon" :alt="course.title" class="course-icon" />
              <div class="course-badge" :class="course.difficulty">
                {{ getDifficultyText(course.difficulty) }}
              </div>
            </div>

            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>

              <div class="course-meta">
                <span class="course-steps">{{ course.totalSteps }} 步骤</span>
                <div class="course-tags">
                  <span
                    v-for="tag in course.tags.slice(0, 2)"
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <div class="course-footer">
              <div class="enrollment-status">
                <van-button
                  v-if="!checkIsEnrolled(course.id)"
                  type="primary"
                  size="small"
                  @click.stop="handleEnrollCourse(course.id, course.type)"
                >
                  加入学习
                </van-button>
                <div v-else class="enrolled-status">
                  <van-icon name="success" color="#07c160" />
                  <span>已加入</span>
                </div>
              </div>

              <div v-if="checkIsEnrolled(course.id)" class="progress-info">
                <van-progress
                  :percentage="getCourseProgress(course.id)"
                  :show-pivot="false"
                  stroke-width="4"
                />
                <span class="progress-text"
                  >{{ getCourseProgress(course.id) }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 保留原有组件 -->
      <!--      <HotCourse />-->
      <Article />
    </div>
  </ViewLayout>
</template>

<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import { useRoute, useRouter } from "vue-router";
import Article from "@/views/recommend/recommend/components/Article/index.vue";
import { ref, computed } from "vue";
import { useLayoutStore } from "@/stores/layout.store.ts";
import { coursesData, type LanguageType, type Course } from "@/data/courses";
import {
  isEnrolled,
  enrollCourse,
  getLearningProgress,
} from "@/utils/learning.util";

const {
  meta: { title },
} = useRoute();
const router = useRouter();

const searchValue = ref("");
const layoutStore = useLayoutStore();
const activeLanguage = ref<LanguageType>("python");

// 可用语言列表
const availableLanguages = [
  { type: "python" as LanguageType, title: "Python" },
  { type: "javascript" as LanguageType, title: "JavaScript" },
  { type: "html" as LanguageType, title: "HTML & CSS" },
];

// 根据语言筛选课程
const filteredCourses = computed(() => {
  return coursesData.filter(course => course.type === activeLanguage.value);
});

// 语言切换处理
const onLanguageChange = (language: LanguageType) => {
  activeLanguage.value = language;
};

// 课程点击处理
const handleCourseClick = (course: Course) => {
  if (checkIsEnrolled(course.id)) {
    // 已加入学习，跳转到学习页面
    router.push(`/step/${course.type}/${course.id}`);
  } else {
    // 未加入学习，先加入再跳转
    handleEnrollCourse(course.id, course.type);
    router.push(`/step/${course.type}/${course.id}`);
  }
};

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  const difficultyMap = {
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
  };
  return difficultyMap[difficulty as keyof typeof difficultyMap] || difficulty;
};

// 检查是否已加入学习
const checkIsEnrolled = (courseId: string): boolean => {
  return isEnrolled(courseId);
};

// 获取学习进度
const getCourseProgress = (courseId: string): number => {
  return getLearningProgress(courseId);
};

// 加入学习处理
const handleEnrollCourse = (courseId: string, language: LanguageType) => {
  enrollCourse(courseId, language);
};
</script>

<style scoped>
.recommend-content {
  padding: 16px;
}

.language-tabs {
  margin-bottom: 20px;
}

.courses-container {
  margin-bottom: 30px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.course-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.course-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.course-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.course-badge.beginner {
  background: #e8f5e8;
  color: #52c41a;
}

.course-badge.intermediate {
  background: #fff7e6;
  color: #fa8c16;
}

.course-badge.advanced {
  background: #fff1f0;
  color: #f5222d;
}

.course-content {
  margin-bottom: 16px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #262626;
}

.course-description {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.course-steps {
  font-size: 12px;
  color: #595959;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.course-tags {
  display: flex;
  gap: 4px;
}

.tag {
  font-size: 11px;
  color: #1890ff;
  background: #e6f7ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.enrollment-status {
  display: flex;
  align-items: center;
}

.enrolled-status {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #07c160;
  font-size: 14px;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: #595959;
  min-width: 32px;
}
</style>

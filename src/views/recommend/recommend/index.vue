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
      <div class="language-tabs course-card">
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

              <!--              <div v-if="checkIsEnrolled(course.id)" class="progress-info">-->
              <!--                <van-progress-->
              <!--                  :percentage="getCourseProgress(course.id)"-->
              <!--                  :show-pivot="false"-->
              <!--                  stroke-width="4"-->
              <!--                />-->
              <!--                <span class="progress-text"-->
              <!--                  >{{ getCourseProgress(course.id) }}%</span-->
              <!--                >-->
              <!--              </div>-->
              <van-icon
                :name="isFavorited(`course-${course.id}`) ? 'star' : 'star-o'"
                :color="isFavorited(`course-${course.id}`) ? '#ffd700' : '#ccc'"
                size="20"
                class="favorite-icon"
                @click.stop="toggleCourseFavorite(course)"
              />
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
import { isEnrolled, enrollCourse } from "@/utils/learning.util";
import { isFavorited, toggleFavorite } from "@/utils/favorites.util";

const {
  meta: { title },
} = useRoute();
const router = useRouter();

const searchValue = ref("");
const layoutStore = useLayoutStore();
const activeLanguage = ref<LanguageType>("python");
// const favoritesUpdate = ref(0); // 用于强制更新收藏状态的响应式变量

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

// 加入学习处理
const handleEnrollCourse = (courseId: string, language: LanguageType) => {
  enrollCourse(courseId, language);
};

// 切换收藏状态
const toggleCourseFavorite = (course: Course) => {
  toggleFavorite({
    id: `course-${course.id}`,
    type: "course",
    title: course.title,
    description: course.description,
    language: course.type,
    courseId: course.id,
  });
};
</script>

<style scoped>
@import "./index.css";
</style>

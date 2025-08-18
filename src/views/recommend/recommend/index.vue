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
                  class="enroll-button"
                  @click.stop="handleEnrollCourse(course.id, course.type)"
                >
                  加入学习
                </van-button>
                <div v-else class="enrolled-actions">
                  <div class="enrolled-status">
                    <van-icon name="success" color="#07c160" />
                    <span>已加入</span>
                  </div>
                  <van-button
                    type="primary"
                    size="small"
                    class="study-button"
                    @click.stop="handleStartLearning(course)"
                  >
                    开始学习
                  </van-button>
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
                :name="
                  checkIsFavorited(`course-${course.id}`) ? 'star' : 'star-o'
                "
                :color="
                  checkIsFavorited(`course-${course.id}`) ? '#ffd700' : '#ccc'
                "
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
import { useCoursesStore } from "@/stores/courses.store";
import { useLearningStore } from "@/stores/learning.store";
import { useFavoritesStore } from "@/stores/favorites.store";
import { type LanguageType, type Course } from "@/data/courses";
import { showToast } from "vant";

const {
  meta: { title },
} = useRoute();
const router = useRouter();

const searchValue = ref("");
const layoutStore = useLayoutStore();
const coursesStore = useCoursesStore();
const learningStore = useLearningStore();
const favoritesStore = useFavoritesStore();

// 本地状态 - 推荐页面自己的筛选状态
const activeLanguage = ref<LanguageType>("python");

// 可用语言列表
const availableLanguages = [
  { type: "python" as LanguageType, title: "Python" },
  { type: "javascript" as LanguageType, title: "JavaScript" },
  { type: "html" as LanguageType, title: "HTML & CSS" },
];

// 使用store中的方法
const { getDifficultyText, filterCourses } = coursesStore;

// 本地筛选逻辑 - 只按语言筛选
const filteredCourses = computed(() => {
  return filterCourses({ language: activeLanguage.value });
});

// 语言切换处理
const onLanguageChange = (language: LanguageType) => {
  activeLanguage.value = language;
};

// 课程点击处理
const handleCourseClick = (course: Course) => {
  // 对中文课程ID进行URL编码
  const encodedCourseId = encodeURIComponent(course.id);

  if (checkIsEnrolled(course.id)) {
    // 已加入学习，跳转到学习页面
    router.push(`/step/${course.type}/${encodedCourseId}`);
  } else {
    // 未加入学习，先加入再跳转
    handleEnrollCourse(course.id, course.type);
    router.push(`/step/${course.type}/${encodedCourseId}`);
  }
};

// getDifficultyText 现在从 store 中获取，不需要重复定义

// 检查是否已加入学习 - 使用Pinia store
const checkIsEnrolled = (courseId: string): boolean => {
  return learningStore.isEnrolled(courseId);
};

// 加入学习处理
const handleEnrollCourse = (courseId: string, language: LanguageType) => {
  learningStore.enrollCourse(courseId, language);

  // 添加成功提示
  showToast({
    message: "已加入学习",
    type: "success",
    duration: 1500,
  });
};

// 开始学习处理
const handleStartLearning = (course: Course) => {
  // 添加点击反馈效果
  console.log("开始学习课程:", course.title);

  // 添加加载提示
  showToast({
    message: "正在进入学习...",
    type: "loading",
    duration: 800,
    forbidClick: true,
  });

  // 延迟跳转以显示加载效果
  setTimeout(() => {
    const encodedCourseId = encodeURIComponent(course.id);
    router.push(`/step/${course.type}/${encodedCourseId}`);
  }, 300);
};

// 检查收藏状态 - 使用Pinia store
const checkIsFavorited = (id: string): boolean => {
  return favoritesStore.isFavorited(id);
};

// 切换收藏状态
const toggleCourseFavorite = (course: Course) => {
  favoritesStore.toggleFavorite({
    id: `course-${course.id}`,
    type: "course",
    title: course.title,
    language: course.type,
    courseId: course.id,
  });
};

// 不再需要手动监听事件，Pinia提供了响应式支持
</script>

<style scoped>
@import "./index.css";
</style>

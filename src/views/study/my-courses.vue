<template>
  <ViewLayout :footer="false">
    <template #header>
      <ViewHeader :header-config="{ title: '我的课程' }" />
    </template>

    <div class="my-courses-container">
      <div class="header">
        <h2 class="title">我的课程</h2>
        <div class="stats">
          共 {{ enrolledCourses.length }} 门课程 · 总进度 {{ totalProgress }}%
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="search-section">
        <van-search
          v-model="searchQuery"
          placeholder="搜索课程名称"
          background="#f8fafc"
        />
      </div>

      <div class="filter-section">
        <van-button
          :type="selectedLanguage === 'all' ? 'primary' : 'default'"
          size="small"
          @click="selectedLanguage = 'all'"
        >
          全部语言 ({{ enrolledCourses.length }})
        </van-button>
        <van-button
          v-for="(count, language) in coursesByLanguage"
          :key="language"
          :type="selectedLanguage === language ? 'primary' : 'default'"
          size="small"
          @click="selectedLanguage = language as LanguageType"
        >
          {{ getLanguageText(language as LanguageType) }} ({{ count }})
        </van-button>
      </div>

      <!-- 课程列表 -->
      <div v-if="filteredCourses.length === 0" class="empty-state">
        <van-empty description="暂无课程">
          <van-button type="primary" size="small" @click="goToRecommend">
            去发现课程
          </van-button>
        </van-empty>
      </div>

      <div v-else class="courses-list">
        <div
          v-for="course in filteredCourses"
          :key="course.courseId"
          class="course-item"
          @click="goToCourse(course)"
        >
          <div class="course-header">
            <div class="course-info">
              <h4 class="course-title">
                {{ getCourseTitle(course.courseId) }}
              </h4>
              <div class="course-meta">
                <span class="language-tag">{{
                  getLanguageText(course.language)
                }}</span>
                <span class="enroll-time">
                  加入时间:
                  {{ formatTime(course.enrollTime || course.lastStudyTime) }}
                </span>
              </div>
            </div>
            <div class="course-status">
              <div class="progress-circle">
                <van-circle
                  :percentage="course.progress"
                  :size="60"
                  :stroke-width="6"
                  color="#1890ff"
                >
                  {{ course.progress }}%
                </van-circle>
              </div>
            </div>
          </div>

          <div class="course-progress-detail">
            <div class="progress-bar">
              <van-progress
                :percentage="course.progress"
                :show-pivot="false"
                stroke-width="8"
                color="#1890ff"
              />
            </div>
            <div class="progress-info">
              <span class="current-position">
                当前进度: 第{{ course.currentChapter }}章 · 步骤{{
                  course.currentStep
                }}
              </span>
              <span class="last-study">
                最后学习: {{ formatTime(course.lastStudyTime) }}
              </span>
            </div>
          </div>

          <div class="course-actions">
            <van-button
              type="primary"
              size="small"
              @click.stop="continueLearning(course)"
            >
              继续学习
            </van-button>
            <van-button
              icon="star-o"
              size="small"
              @click.stop="addToFavorites(course)"
            >
              收藏
            </van-button>
            <van-button
              type="warning"
              size="small"
              @click.stop="unenrollCourse(course.courseId)"
            >
              退出学习
            </van-button>
          </div>
        </div>
      </div>

      <!-- 学习统计 -->
      <div class="study-stats">
        <h3 class="stats-title">学习统计</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ enrolledCourses.length }}</div>
            <div class="stat-label">进行的课程</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ completedCoursesCount }}</div>
            <div class="stat-label">已完成课程</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalStudyTime }}</div>
            <div class="stat-label">学习天数</div>
          </div>
        </div>
      </div>
    </div>
  </ViewLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import {
  getAllLearningStatus,
  unenrollCourse as unenrollCourseUtil,
} from "@/utils/learning.util";
import { addToFavorites as addToFavoritesUtil } from "@/utils/favorites.util";
import { useCoursesStore } from "@/stores/courses.store";
import type { LearningStatus, LanguageType } from "@/data/courses";

const router = useRouter();
const coursesStore = useCoursesStore();

// 响应式数据
const learningStatus = ref<LearningStatus[]>([]);
const searchQuery = ref("");
const selectedLanguage = ref<LanguageType | "all">("all");

// 计算属性
const enrolledCourses = computed(() => {
  return learningStatus.value.filter(status => status.isEnrolled);
});

const filteredCourses = computed(() => {
  let result = enrolledCourses.value;

  // 按语言筛选
  if (selectedLanguage.value !== "all") {
    result = result.filter(
      course => course.language === selectedLanguage.value
    );
  }

  // 按搜索关键字筛选
  if (searchQuery.value.trim()) {
    const lowerQuery = searchQuery.value.toLowerCase();
    result = result.filter(course => {
      const courseTitle = getCourseTitle(course.courseId).toLowerCase();
      return courseTitle.includes(lowerQuery);
    });
  }

  return result;
});

const coursesByLanguage = computed(() => {
  const counts: Record<string, number> = {};
  enrolledCourses.value.forEach(course => {
    counts[course.language] = (counts[course.language] || 0) + 1;
  });
  return counts;
});

const totalProgress = computed(() => {
  if (enrolledCourses.value.length === 0) return 0;
  const total = enrolledCourses.value.reduce(
    (sum, course) => sum + course.progress,
    0
  );
  return Math.round(total / enrolledCourses.value.length);
});

const completedCoursesCount = computed(() => {
  return enrolledCourses.value.filter(course => course.progress >= 100).length;
});

const totalStudyTime = computed(() => {
  if (learningStatus.value.length === 0) return 0;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oldestStudy = Math.min(
    ...learningStatus.value.map(s => s.lastStudyTime)
  );
  return Math.ceil((now - oldestStudy) / oneDay);
});

// 方法
const loadLearningStatus = () => {
  learningStatus.value = getAllLearningStatus();
};

const getCourseTitle = (courseId: string): string => {
  const course = coursesStore.getCourseById(courseId);
  return course ? course.title : "未知课程";
};

// 使用 store 中的方法
const { getLanguageText } = coursesStore;

const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay) {
    return "今天";
  } else if (diff < 2 * oneDay) {
    return "昨天";
  } else {
    const days = Math.floor(diff / oneDay);
    return `${days}天前`;
  }
};

const goToCourse = (course: LearningStatus) => {
  router.push(`/step/${course.language}/${course.courseId}`);
};

const continueLearning = (course: LearningStatus) => {
  router.push(
    `/step/${course.language}/${course.courseId}/${course.currentChapter}/${course.currentStep}`
  );
};

const addToFavorites = (course: LearningStatus) => {
  const courseInfo = coursesStore.getCourseById(course.courseId);
  if (courseInfo) {
    const success = addToFavoritesUtil({
      id: `course-${course.courseId}`,
      type: "course",
      title: courseInfo.title,
      description: courseInfo.description,
      language: course.language,
      courseId: course.courseId,
    });

    if (success) {
      // 可以添加成功提示
      console.log("已添加到收藏");
    } else {
      console.log("该课程已在收藏中");
    }
  }
};

const unenrollCourse = (courseId: string) => {
  unenrollCourseUtil(courseId);
  loadLearningStatus(); // 重新加载状态
};

const goToRecommend = () => {
  router.push("/recommend");
};

// 生命周期
onMounted(() => {
  loadLearningStatus();
});

// 监听存储变化
window.addEventListener("storage", () => {
  loadLearningStatus();
});
</script>

<style scoped>
.my-courses-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: calc(100vh - 120px);
}

.header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.stats {
  font-size: 14px;
  color: #718096;
  background: white;
  padding: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.search-section {
  margin-bottom: 16px;
}

.filter-section {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.course-item {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.course-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.language-tag {
  background: #bee3f8;
  color: #2b6cb0;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.enroll-time {
  font-size: 12px;
  color: #a0aec0;
}

.course-status {
  margin-left: 16px;
}

.progress-circle {
  text-align: center;
}

.course-progress-detail {
  margin-bottom: 16px;
}

.progress-bar {
  margin-bottom: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #718096;
  flex-wrap: wrap;
  gap: 8px;
}

.course-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.study-stats {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stats-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #718096;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .my-courses-container {
    padding: 12px;
  }

  .course-header {
    flex-direction: column;
    gap: 16px;
  }

  .course-status {
    margin-left: 0;
    align-self: center;
  }

  .progress-info {
    flex-direction: column;
    gap: 4px;
  }

  .course-actions {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .stat-card {
    padding: 12px 8px;
  }

  .stat-number {
    font-size: 20px;
  }
}
</style>

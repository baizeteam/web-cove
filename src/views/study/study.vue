<template>
  <ViewLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
      <Icon />
    </template>

    <div class="study-content">
      <!-- 学习统计 -->
      <div class="study-stats">
        <div class="stat-card">
          <div class="stat-number">{{ enrolledCourses.length }}</div>
          <div class="stat-label">进行的课程</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalProgress }}%</div>
          <div class="stat-label">总体进度</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalStudyTime }}</div>
          <div class="stat-label">学习天数</div>
        </div>
      </div>

      <!-- 我的课程 -->
      <div class="my-courses">
        <div class="align-center justify-between">
          <h3 class="section-title">我的课程</h3>
          <div>更多课程</div>
        </div>
        <div v-if="enrolledCourses.length === 0" class="empty-state">
          <van-icon name="bookmark-o" size="48" color="#ccc" />
          <p>还没有加入任何课程</p>
          <van-button type="primary" @click="goToRecommend">
            去发现课程
          </van-button>
        </div>

        <div v-else class="course-list">
          <div
            v-for="course in enrolledCourses.slice(0, 5)"
            :key="course.courseId"
            class="course-item"
            @click="goToCourse(course)"
          >
            <div class="course-info">
              <div class="course-header">
                <h4 class="course-title">
                  {{ getCourseTitle(course.courseId) }}
                </h4>
                <div class="course-language">
                  {{ getLanguageText(course.language) }}
                </div>
              </div>

              <div class="course-progress">
                <van-progress
                  :percentage="course.progress"
                  :show-pivot="false"
                  stroke-width="6"
                  color="#1890ff"
                />
                <span class="progress-text">{{ course.progress }}%</span>
              </div>

              <div class="course-meta">
                <span class="current-position">
                  第{{ course.currentChapter }}章 · 步骤{{ course.currentStep }}
                </span>
                <span class="last-study">
                  上次学习: {{ formatTime(course.lastStudyTime) }}
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
                type="default"
                size="small"
                @click.stop="unenrollCourse(course.courseId)"
              >
                退出学习
              </van-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习历史 -->
      <div class="study-history">
        <h3 class="section-title">学习历史</h3>
        <History />
      </div>
    </div>
  </ViewLayout>
</template>

<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import { useRoute, useRouter } from "vue-router";
import Icon from "@/views/study/components/Icon.vue";
import History from "@/views/study/components/History.vue";
import { ref, computed, onMounted } from "vue";
import {
  getAllLearningStatus,
  unenrollCourse as unenrollCourseUtil,
} from "@/utils/learning.util";
import { getCourseById } from "@/data/courses";
import type { LearningStatus, LanguageType } from "@/data/courses";

const {
  meta: { title },
} = useRoute();
const router = useRouter();

// 响应式数据
const learningStatus = ref<LearningStatus[]>([]);

// 计算属性
const enrolledCourses = computed(() => {
  return learningStatus.value.filter(status => status.isEnrolled);
});

const totalProgress = computed(() => {
  if (enrolledCourses.value.length === 0) return 0;
  const total = enrolledCourses.value.reduce(
    (sum, course) => sum + course.progress,
    0
  );
  return Math.round(total / enrolledCourses.value.length);
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
  const course = getCourseById(courseId);
  return course ? course.title : "未知课程";
};

const getLanguageText = (language: LanguageType): string => {
  const languageMap = {
    python: "Python",
    javascript: "JavaScript",
    html: "HTML & CSS",
    java: "Java",
    css: "CSS",
  };
  return languageMap[language] || language;
};

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
  router.push(`/step/${course.language}/${course.courseId}`);
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
</script>

<style scoped>
.study-content {
  padding: 16px;
}

.study-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 16px 0;
  color: #262626;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #8c8c8c;
}

.empty-state p {
  margin: 16px 0;
  font-size: 14px;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.course-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.course-info {
  margin-bottom: 16px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #262626;
}

.course-language {
  font-size: 12px;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4px 8px;
  border-radius: 12px;
}

.course-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 14px;
  color: #595959;
  min-width: 40px;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8c8c8c;
}

.course-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.study-history {
  margin-top: 24px;
}
</style>

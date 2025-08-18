<template>
  <div class="history-container">
    <div class="section-header">
      <h2 class="section-title">最近学习</h2>
      <div class="more" @click="handleViewMore">
        查看更多 <van-icon name="arrow" />
      </div>
    </div>

    <div v-if="recentCourses.length === 0" class="empty-state">
      <van-empty description="暂无学习记录">
        <van-button type="primary" size="small" @click="goToRecommend">
          去发现课程
        </van-button>
      </van-empty>
    </div>

    <div v-else class="course-list">
      <div
        v-for="courseStatus in recentCourses"
        :key="courseStatus.courseId"
        class="course-item"
        @click="goToCourse(courseStatus)"
      >
        <div class="course-image">
          <img
            :src="getCourseIcon(courseStatus.courseId)"
            :alt="getCourseTitle(courseStatus.courseId)"
            class="course-icon"
          />
        </div>

        <div class="course-content">
          <div class="course-header">
            <h3 class="course-name">
              {{ getCourseTitle(courseStatus.courseId) }}
            </h3>
            <div class="course-language">
              {{ getLanguageText(courseStatus.language) }}
            </div>
          </div>

          <div class="course-progress-section">
            <div class="progress-info">
              <span class="progress-text">
                第{{ courseStatus.currentChapter }}章 · 步骤{{
                  courseStatus.currentStep
                }}
              </span>
              <span class="progress-percentage"
                >{{ courseStatus.progress }}%</span
              >
            </div>
            <van-progress
              :percentage="courseStatus.progress"
              :show-pivot="false"
              stroke-width="6"
              color="#1890ff"
            />
          </div>

          <div class="course-meta">
            <span class="study-stats">
              已学{{ getCompletedSteps(courseStatus.courseId) }}/{{
                getTotalSteps(courseStatus.courseId)
              }}步
            </span>
            <span class="last-study">
              {{ formatTime(courseStatus.lastStudyTime) }}
            </span>
          </div>
        </div>

        <div class="course-actions">
          <van-button
            type="primary"
            size="small"
            round
            @click.stop="continueLearning(courseStatus)"
          >
            继续学习
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getRecentCourses,
  getCourseLearningStats,
} from "@/utils/learning.util";
import {
  getCourseById,
  getTotalSteps as getTotalStepsFromCourse,
} from "@/data/courses";
import type { LearningStatus, LanguageType } from "@/data/courses";
import logoIcon from "@/assets/images/icon/logo.png";

const router = useRouter();

// 响应式数据
const recentCourses = ref<LearningStatus[]>([]);

// 方法
const loadRecentCourses = () => {
  recentCourses.value = getRecentCourses(5);
};

const getCourseTitle = (courseId: string): string => {
  const course = getCourseById(courseId);
  return course ? course.title : "未知课程";
};

const getCourseIcon = (courseId: string): string => {
  const course = getCourseById(courseId);
  return course ? course.icon : logoIcon;
};

const getLanguageText = (language: LanguageType): string => {
  const languageMap = {
    python: "Python",
    javascript: "JavaScript",
    html: "HTML & CSS",
    css: "CSS",
  };
  return languageMap[language as keyof typeof languageMap] || language;
};

const getCompletedSteps = (courseId: string): number => {
  const stats = getCourseLearningStats(courseId);
  return stats ? stats.completedSteps : 0;
};

const getTotalSteps = (courseId: string): number => {
  const course = getCourseById(courseId);
  return course ? getTotalStepsFromCourse(course) : 0;
};

const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const oneDay = 24 * 60 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  const oneMinute = 60 * 1000;

  if (diff < oneMinute) {
    return "刚刚";
  } else if (diff < oneHour) {
    const minutes = Math.floor(diff / oneMinute);
    return `${minutes}分钟前`;
  } else if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    return `${hours}小时前`;
  } else if (diff < 2 * oneDay) {
    return "昨天";
  } else {
    const days = Math.floor(diff / oneDay);
    return `${days}天前`;
  }
};

const goToCourse = (courseStatus: LearningStatus) => {
  router.push(`/step/${courseStatus.language}/${courseStatus.courseId}`);
};

const continueLearning = (courseStatus: LearningStatus) => {
  // 直接跳转到当前学习位置
  router.push(
    `/step/${courseStatus.language}/${courseStatus.courseId}/${courseStatus.currentChapter}/${courseStatus.currentStep}`
  );
};

const handleViewMore = () => {
  router.push("/study");
};

const goToRecommend = () => {
  router.push("/recommend");
};

// 生命周期
onMounted(() => {
  loadRecentCourses();
});

// 监听存储变化，实时更新
window.addEventListener("storage", e => {
  if (e.key === "learning_status") {
    loadRecentCourses();
  }
});

// 监听自定义学习状态更新事件
window.addEventListener("learning-status-updated", () => {
  loadRecentCourses();
});
</script>

<style lang="less" scoped>
.history-container {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin: 0;
}

.more {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #40a9ff;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #1890ff;
  }

  &:active {
    transform: translateY(0);
  }
}

.course-image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.course-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.course-content {
  flex: 1;
  min-width: 0;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.course-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.course-language {
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
}

.course-progress-section {
  margin-bottom: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-text {
  font-size: 12px;
  color: #8c8c8c;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #8c8c8c;
}

.study-stats {
  font-weight: 500;
}

.last-study {
  color: #bfbfbf;
}

.course-actions {
  flex-shrink: 0;
}

// 响应式设计
@media (max-width: 480px) {
  .course-item {
    padding: 12px;
    gap: 12px;
  }

  .course-image {
    width: 50px;
    height: 50px;
  }

  .course-icon {
    width: 32px;
    height: 32px;
  }

  .course-name {
    font-size: 14px;
    max-width: 150px;
  }

  .course-language {
    font-size: 10px;
    padding: 1px 6px;
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .course-item {
    background: #1f1f1f;
    border-color: #303030;

    &:hover {
      border-color: #1890ff;
    }
  }

  .course-name {
    color: #ffffff;
  }

  .course-image {
    background: #303030;
  }
}
</style>

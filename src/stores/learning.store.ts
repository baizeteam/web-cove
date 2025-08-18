import { defineStore } from "pinia";
import type { LanguageType } from "@/data/courses";

// 学习状态接口
export interface LearningStatus {
  courseId: string;
  language: LanguageType;
  currentChapter: number;
  currentStep: number;
  completedSteps: number[];
  completedChapters: number[];
  isEnrolled: boolean;
  lastStudyTime: number;
  progress: number;
}

// 学习记录接口
export interface StudyHistory {
  courseId: string;
  language: LanguageType;
  studyTime: number;
  duration: number; // 学习时长（秒）
  stepsCompleted: number; // 本次完成的步骤数
}

interface LearningState {
  learningStatuses: Record<string, LearningStatus>;
  studyHistories: StudyHistory[];
}

export const useLearningStore = defineStore("learning", {
  state: (): LearningState => ({
    learningStatuses: {},
    studyHistories: [],
  }),

  getters: {
    // 获取指定课程的学习状态
    getLearningStatus:
      state =>
      (courseId: string): LearningStatus | null => {
        return state.learningStatuses[courseId] || null;
      },

    // 检查是否已加入学习
    isEnrolled:
      state =>
      (courseId: string): boolean => {
        const status = state.learningStatuses[courseId];
        return status ? status.isEnrolled : false;
      },

    // 获取所有已加入的课程
    getAllEnrolledCourses: (state): LearningStatus[] => {
      return Object.values(state.learningStatuses).filter(
        status => status.isEnrolled
      );
    },

    // 获取最近学习的课程
    getRecentCourses:
      state =>
      (limit: number = 5): LearningStatus[] => {
        return Object.values(state.learningStatuses)
          .filter(status => status.isEnrolled)
          .sort((a, b) => b.lastStudyTime - a.lastStudyTime)
          .slice(0, limit);
      },

    // 检查章节是否完成
    isChapterCompleted:
      state =>
      (courseId: string, chapterId: number): boolean => {
        const status = state.learningStatuses[courseId];
        return status ? status.completedChapters.includes(chapterId) : false;
      },

    // 检查步骤是否完成
    isStepCompleted:
      state =>
      (courseId: string, chapterId: number, stepId: number): boolean => {
        const status = state.learningStatuses[courseId];
        if (!status) return false;
        const stepKey = chapterId * 1000 + stepId;
        return status.completedSteps.includes(stepKey);
      },
  },

  actions: {
    // 加入学习
    enrollCourse(courseId: string, language: LanguageType) {
      const existingStatus = this.learningStatuses[courseId];

      if (!existingStatus) {
        this.learningStatuses[courseId] = {
          courseId,
          language,
          currentChapter: 1,
          currentStep: 1,
          completedSteps: [],
          completedChapters: [],
          isEnrolled: true,
          lastStudyTime: Date.now(),
          progress: 0,
        };
      } else if (!existingStatus.isEnrolled) {
        existingStatus.isEnrolled = true;
        existingStatus.lastStudyTime = Date.now();
      }

      console.log(`已加入课程: ${courseId}`);
    },

    // 退出学习
    unenrollCourse(courseId: string) {
      const status = this.learningStatuses[courseId];
      if (status) {
        status.isEnrolled = false;
        console.log(`已退出课程: ${courseId}`);
      }
    },

    // 更新学习进度
    updateLearningProgress(
      courseId: string,
      chapterId: number,
      stepId: number,
      completed: boolean = false
    ) {
      const status = this.learningStatuses[courseId];

      // 如果不存在学习状态，创建一个
      if (!status) {
        console.error(`课程 ${courseId} 的学习状态不存在`);
        return;
      }

      // 更新当前位置
      status.currentChapter = chapterId;
      status.currentStep = stepId;
      status.lastStudyTime = Date.now();

      // 如果步骤完成，添加到完成列表
      if (completed) {
        const stepKey = chapterId * 1000 + stepId;
        if (!status.completedSteps.includes(stepKey)) {
          status.completedSteps.push(stepKey);
        }
      }

      console.log(
        `更新学习进度: ${courseId} - 第${chapterId}章第${stepId}步 ${
          completed ? "已完成" : "已访问"
        }`
      );
    },

    // 标记章节完成
    markChapterCompleted(courseId: string, chapterId: number): boolean {
      const status = this.learningStatuses[courseId];
      if (!status) return false;

      // 检查章节是否已经完成
      if (status.completedChapters.includes(chapterId)) {
        return true;
      }

      // 这里应该检查章节的所有步骤是否都已完成
      // 为了简化，我们直接标记为完成
      status.completedChapters.push(chapterId);
      status.lastStudyTime = Date.now();

      console.log(`章节 ${chapterId} 已完成`);
      return true;
    },

    // 添加学习历史记录
    addStudyHistory(history: StudyHistory) {
      this.studyHistories.push(history);

      // 限制历史记录数量
      if (this.studyHistories.length > 1000) {
        this.studyHistories = this.studyHistories.slice(-1000);
      }
    },

    // 获取学习统计信息
    getCourseLearningStats(courseId: string) {
      const status = this.learningStatuses[courseId];
      if (!status) return null;

      return {
        courseId: status.courseId,
        language: status.language,
        currentChapter: status.currentChapter,
        currentStep: status.currentStep,
        completedSteps: status.completedSteps,
        completedChapters: status.completedChapters,
        isEnrolled: status.isEnrolled,
        progress: status.progress,
        lastStudyTime: status.lastStudyTime,
      };
    },

    // 从localStorage迁移数据（仅在初始化时调用一次）
    migrateFromLocalStorage() {
      try {
        // 检查是否已经迁移过
        const migrated = localStorage.getItem("learning-migrated");
        if (migrated) return;

        console.log("开始迁移localStorage学习数据到Pinia...");

        // 迁移学习状态
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith("learning-status-")) {
            try {
              const courseId = key.replace("learning-status-", "");
              const data = JSON.parse(localStorage.getItem(key) || "{}");
              this.learningStatuses[courseId] = data;
              console.log(`迁移课程学习状态: ${courseId}`);
            } catch (e) {
              console.error(`迁移学习状态失败: ${key}`, e);
            }
          }
        });

        // 迁移学习历史
        try {
          const historyData = localStorage.getItem("study-histories");
          if (historyData) {
            this.studyHistories = JSON.parse(historyData);
            console.log("迁移学习历史记录完成");
          }
        } catch (e) {
          console.error("迁移学习历史失败", e);
        }

        // 标记迁移完成
        localStorage.setItem("learning-migrated", "true");
        console.log("学习数据迁移完成");
      } catch (error) {
        console.error("迁移学习数据失败:", error);
      }
    },
  },

  persist: {
    key: "learning-store",
    storage: localStorage,
    // 持久化所有状态
    paths: ["learningStatuses", "studyHistories"],
  },
});

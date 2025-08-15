import type { LearningStatus, LanguageType } from "@/data/courses";
import { getCourseById } from "@/data/courses";

const LEARNING_STATUS_KEY = "learning_status";

// 获取所有学习状态
export const getAllLearningStatus = (): LearningStatus[] => {
  try {
    const stored = localStorage.getItem(LEARNING_STATUS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("获取学习状态失败:", error);
    return [];
  }
};

// 获取指定课程的学习状态
export const getLearningStatus = (courseId: string): LearningStatus | null => {
  const allStatus = getAllLearningStatus();
  return allStatus.find((status) => status.courseId === courseId) || null;
};

// 保存学习状态
export const saveLearningStatus = (status: LearningStatus): void => {
  try {
    const allStatus = getAllLearningStatus();
    const existingIndex = allStatus.findIndex(
      (s) => s.courseId === status.courseId,
    );

    if (existingIndex >= 0) {
      allStatus[existingIndex] = status;
    } else {
      allStatus.push(status);
    }

    localStorage.setItem(LEARNING_STATUS_KEY, JSON.stringify(allStatus));
  } catch (error) {
    console.error("保存学习状态失败:", error);
  }
};

// 加入学习
export const enrollCourse = (
  courseId: string,
  language: LanguageType,
): void => {
  const existingStatus = getLearningStatus(courseId);

  if (!existingStatus) {
    const newStatus: LearningStatus = {
      courseId,
      language,
      currentStep: 1,
      completedSteps: [],
      isEnrolled: true,
      lastStudyTime: Date.now(),
      progress: 0,
    };
    saveLearningStatus(newStatus);
  } else if (!existingStatus.isEnrolled) {
    existingStatus.isEnrolled = true;
    existingStatus.lastStudyTime = Date.now();
    saveLearningStatus(existingStatus);
  }
};

// 退出学习
export const unenrollCourse = (courseId: string): void => {
  const existingStatus = getLearningStatus(courseId);

  if (existingStatus) {
    existingStatus.isEnrolled = false;
    saveLearningStatus(existingStatus);
  }
};

// 更新学习进度
export const updateLearningProgress = (
  courseId: string,
  stepNumber: number,
  isCompleted: boolean = true,
): void => {
  const status = getLearningStatus(courseId);

  if (status) {
    if (isCompleted && !status.completedSteps.includes(stepNumber)) {
      status.completedSteps.push(stepNumber);
    }

    status.currentStep = Math.max(status.currentStep, stepNumber + 1);
    status.lastStudyTime = Date.now();
    status.progress = Math.round(
      (status.completedSteps.length / getTotalSteps(courseId)) * 100,
    );

    saveLearningStatus(status);
  }
};

// 获取总步骤数（这里需要从课程数据中获取，暂时返回默认值）
const getTotalSteps = (courseId: string): number => {
  // 这里应该从课程数据中获取，暂时返回默认值
  const course = getCourseById(courseId);
  return course ? course.totalSteps : 5;
};

// 获取学习进度百分比
export const getLearningProgress = (courseId: string): number => {
  const status = getLearningStatus(courseId);
  return status ? status.progress : 0;
};

// 检查是否已加入学习
export const isEnrolled = (courseId: string): boolean => {
  const status = getLearningStatus(courseId);
  return status ? status.isEnrolled : false;
};

// 获取最近学习的课程
export const getRecentCourses = (limit: number = 5): LearningStatus[] => {
  const allStatus = getAllLearningStatus()
    .filter((status) => status.isEnrolled)
    .sort((a, b) => b.lastStudyTime - a.lastStudyTime);

  return allStatus.slice(0, limit);
};

// 清除所有学习状态（用于测试或重置）
export const clearAllLearningStatus = (): void => {
  localStorage.removeItem(LEARNING_STATUS_KEY);
};

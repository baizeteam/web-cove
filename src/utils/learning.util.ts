import type { LearningStatus, LanguageType } from "@/data/courses";
import { getCourseById, getTotalSteps } from "@/data/courses";

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
  return allStatus.find(status => status.courseId === courseId) || null;
};

// 保存学习状态
export const saveLearningStatus = (status: LearningStatus): void => {
  try {
    const allStatus = getAllLearningStatus();
    const existingIndex = allStatus.findIndex(
      s => s.courseId === status.courseId
    );

    if (existingIndex >= 0) {
      allStatus[existingIndex] = status;
    } else {
      allStatus.push(status);
    }

    localStorage.setItem(LEARNING_STATUS_KEY, JSON.stringify(allStatus));

    // 触发自定义事件，通知其他组件数据已更新
    const event = new CustomEvent("learning-status-updated", {
      detail: { courseId: status.courseId, status },
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error("保存学习状态失败:", error);
  }
};

// 加入学习
export const enrollCourse = (
  courseId: string,
  language: LanguageType
): void => {
  const existingStatus = getLearningStatus(courseId);

  if (!existingStatus) {
    const newStatus: LearningStatus = {
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

// 更新学习进度（章节和步骤）
export const updateLearningProgress = (
  courseId: string,
  chapterId: number,
  stepId: number,
  isCompleted: boolean = true
): void => {
  const status = getLearningStatus(courseId);

  if (status) {
    // 更新当前章节和步骤
    status.currentChapter = chapterId;
    status.currentStep = stepId;

    if (isCompleted) {
      // 使用章节和步骤的组合作为唯一标识
      const stepKey = `${chapterId}-${stepId}`;
      if (!status.completedSteps.includes(parseInt(stepKey))) {
        status.completedSteps.push(parseInt(stepKey));
      }
    }

    status.lastStudyTime = Date.now();

    // 计算进度
    const course = getCourseById(courseId);
    if (course) {
      const totalSteps = getTotalSteps(course);
      status.progress = Math.round(
        (status.completedSteps.length / totalSteps) * 100
      );
    }

    saveLearningStatus(status);
  }
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

// 获取当前学习位置
export const getCurrentLearningPosition = (
  courseId: string
): { chapter: number; step: number } | null => {
  const status = getLearningStatus(courseId);
  if (!status) return null;

  return {
    chapter: status.currentChapter,
    step: status.currentStep,
  };
};

// 获取最近学习的课程
export const getRecentCourses = (limit: number = 5): LearningStatus[] => {
  const allStatus = getAllLearningStatus()
    .filter(status => status.isEnrolled)
    .sort((a, b) => b.lastStudyTime - a.lastStudyTime);

  return allStatus.slice(0, limit);
};

// 获取课程学习统计
export const getCourseLearningStats = (courseId: string) => {
  const status = getLearningStatus(courseId);
  if (!status) return null;

  const course = getCourseById(courseId);
  if (!course) return null;

  return {
    currentChapter: status.currentChapter,
    currentStep: status.currentStep,
    completedSteps: status.completedSteps.length,
    totalSteps: getTotalSteps(course),
    progress: status.progress,
    lastStudyTime: status.lastStudyTime,
  };
};

// 标记章节完成
export const markChapterCompleted = (
  courseId: string,
  chapterId: number
): boolean => {
  const status = getLearningStatus(courseId);
  if (!status) return false;

  // 确保 completedChapters 数组存在
  if (!status.completedChapters) {
    status.completedChapters = [];
  }

  // 检查章节是否已经完成
  if (status.completedChapters.includes(chapterId)) {
    return true; // 已经完成
  }

  // 获取课程信息
  const course = getCourseById(courseId);
  if (!course) return false;

  // 找到对应章节
  const chapter = course.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return false;

  // 检查该章节的所有步骤是否都已完成
  const allStepsCompleted = chapter.steps.every(step => {
    const stepKey = `${chapterId}-${step.id}`;
    return status.completedSteps.includes(parseInt(stepKey));
  });

  if (!allStepsCompleted) {
    console.log(
      `章节 ${chapterId} 未完成，已完成步骤: ${status.completedSteps.length}/${chapter.steps.length}`
    );
    return false; // 章节未完成，不能标记
  }

  // 标记章节完成
  status.completedChapters.push(chapterId);
  status.lastStudyTime = Date.now();

  // 重新计算总体进度（基于完成的章节数）
  const totalChapters = course.chapters.length;
  status.progress = Math.round(
    (status.completedChapters.length / totalChapters) * 100
  );

  console.log(`章节 ${chapterId} 已完成，总体进度: ${status.progress}%`);
  saveLearningStatus(status);
  return true;
};

// 检查章节是否完成
export const isChapterCompleted = (
  courseId: string,
  chapterId: number
): boolean => {
  const status = getLearningStatus(courseId);
  if (!status) return false;

  // 确保 completedChapters 数组存在
  if (!status.completedChapters) {
    status.completedChapters = [];
  }

  return status.completedChapters.includes(chapterId);
};

// 获取章节完成状态
export const getChapterCompletionStatus = (
  courseId: string,
  chapterId: number
) => {
  const status = getLearningStatus(courseId);
  if (!status) return null;

  const course = getCourseById(courseId);
  if (!course) return null;

  const chapter = course.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return null;

  const completedSteps = chapter.steps.filter(step => {
    const stepKey = `${chapterId}-${step.id}`;
    return status.completedSteps.includes(parseInt(stepKey));
  }).length;

  // 确保 completedChapters 数组存在
  if (!status.completedChapters) {
    status.completedChapters = [];
  }

  return {
    totalSteps: chapter.steps.length,
    completedSteps,
    progress: Math.round((completedSteps / chapter.steps.length) * 100),
    isCompleted: status.completedChapters.includes(chapterId),
  };
};

// 获取课程总体完成状态
export const getCourseOverallStatus = (courseId: string) => {
  const status = getLearningStatus(courseId);
  if (!status) return null;

  const course = getCourseById(courseId);
  if (!course) return null;

  const totalChapters = course.chapters.length;
  const completedChapters = status.completedChapters.length;
  const totalSteps = getTotalSteps(course);
  const completedSteps = status.completedSteps.length;

  return {
    totalChapters,
    completedChapters,
    totalSteps,
    completedSteps,
    chapterProgress: Math.round((completedChapters / totalChapters) * 100),
    stepProgress: Math.round((completedSteps / totalSteps) * 100),
    overallProgress: Math.round((completedChapters / totalChapters) * 100), // 基于章节的进度
  };
};

// 清除所有学习状态（用于测试或重置）
export const clearAllLearningStatus = (): void => {
  localStorage.removeItem(LEARNING_STATUS_KEY);
};

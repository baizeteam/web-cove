import { getCourseByLanguageAndId, getStepConfig } from "@/data/courses";
import type { LanguageType } from "@/data/courses";

// 获取步骤配置
export const getStepConfigByRoute = (
  language: LanguageType,
  courseId: string,
  chapterId: number,
  stepId: number
) => {
  const course = getCourseByLanguageAndId(language, courseId);
  if (!course) return null;

  return getStepConfig(course, chapterId, stepId);
};

// 获取导航信息
export const getNavigationInfo = (
  language: LanguageType,
  courseId: string,
  chapterId: number,
  stepId: number
) => {
  const course = getCourseByLanguageAndId(language, courseId);
  if (!course) return null;

  const currentChapter = course.chapters.find(ch => ch.id === chapterId);
  if (!currentChapter) return null;

  const currentStepIndex = currentChapter.steps.findIndex(
    step => step.id === stepId
  );
  if (currentStepIndex === -1) return null;

  // 判断是否有上一步
  let hasPrev = false;
  let prevChapter = chapterId;
  let prevStep = stepId;

  if (currentStepIndex > 0) {
    // 同一章节内的上一步
    hasPrev = true;
    prevStep = currentChapter.steps[currentStepIndex - 1].id;
  } else if (chapterId > 1) {
    // 上一章节的最后一步
    const prevChapterData = course.chapters.find(ch => ch.id === chapterId - 1);
    if (prevChapterData && prevChapterData.steps.length > 0) {
      hasPrev = true;
      prevChapter = prevChapterData.id;
      prevStep = prevChapterData.steps[prevChapterData.steps.length - 1].id;
    }
  }

  // 判断是否有下一步
  let hasNext = false;
  let nextChapter = chapterId;
  let nextStep = stepId;

  if (currentStepIndex < currentChapter.steps.length - 1) {
    // 同一章节内的下一步
    hasNext = true;
    nextStep = currentChapter.steps[currentStepIndex + 1].id;
  } else {
    // 下一章节的第一步
    const nextChapterData = course.chapters.find(ch => ch.id === chapterId + 1);
    if (nextChapterData && nextChapterData.steps.length > 0) {
      hasNext = true;
      nextChapter = nextChapterData.id;
      nextStep = nextChapterData.steps[0].id;
    }
  }

  return {
    course,
    currentChapter,
    currentStep: currentChapter.steps[currentStepIndex],
    hasPrev,
    hasNext,
    prevChapter,
    prevStep,
    nextChapter,
    nextStep,
  };
};

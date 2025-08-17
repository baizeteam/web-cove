// 导出类型定义
export * from "./types";

// 导入各个课程配置
import { getPythonBasicCourse } from "./python";
import { getJavaScriptBasicCourse } from "./javascript";
import type { Course, LanguageType, Step } from "./types";

// ID映射表：旧ID -> 新ID
const ID_MIGRATION_MAP: Record<string, string> = {
  "python-basics": "Python基础入门",
  "javascript-basics": "JavaScript基础",
};

// 课程数据 [[memory:6414545]]
export const coursesData: Course[] = [
  getPythonBasicCourse(),
  getJavaScriptBasicCourse(),
];

// 获取指定课程（兼容旧ID）
export const getCourseById = (id: string): Course | undefined => {
  // 首先尝试用原ID查找
  let course = coursesData.find(course => course.id === id);

  // 如果没找到，尝试使用ID映射
  if (!course && ID_MIGRATION_MAP[id]) {
    const newId = ID_MIGRATION_MAP[id];
    course = coursesData.find(course => course.id === newId);
  }

  return course;
};

// 获取指定语言的课程
export const getCoursesByLanguage = (language: LanguageType): Course[] => {
  return coursesData.filter(course => course.type === language);
};

// 获取指定语言和ID的课程
export const getCourseByLanguageAndId = (
  language: LanguageType,
  id: string
): Course | undefined => {
  return coursesData.find(
    course => course.type === language && course.id === id
  );
};

// 根据章节和步骤ID获取步骤配置
export const getStepConfig = (
  course: Course,
  chapterId: number,
  stepId: number
): Step | undefined => {
  const chapter = course.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return undefined;

  return chapter.steps.find(step => step.id === stepId);
};

// 获取课程的总章节数
export const getTotalChapters = (course: Course): number => {
  return course.chapters.length;
};

// 获取指定章节的总步骤数
export const getChapterStepsCount = (
  course: Course,
  chapterId: number
): number => {
  const chapter = course.chapters.find(ch => ch.id === chapterId);
  return chapter ? chapter.steps.length : 0;
};

// 获取课程的总步骤数
export const getTotalSteps = (course: Course): number => {
  return course.totalSteps;
};

// 判断步骤是否为选择题（根据title是否以'-选择题'结尾）
export const isChoiceStep = (step: Step): boolean => {
  return step.title.endsWith("-选择题");
};

// 判断步骤是否为填空题（根据title是否以'-填空题'结尾）
export const isBlankStep = (step: Step): boolean => {
  return step.title.endsWith("-填空题");
};

// 判断步骤是否为互动题目（选择题或填空题）
export const isInteractiveStep = (step: Step): boolean => {
  return isChoiceStep(step) || isBlankStep(step);
};

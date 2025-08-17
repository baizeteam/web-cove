import { urlMd } from "@/utils/url.util.ts";

// 课程类型定义
export type LanguageType = "javascript" | "python" | "html" | "css";

// 步骤配置类型 - 现在统一为markdown内容
interface StepContent {
  src: string;
}

// 答案配置（选择题和填空题通用）
export interface QuizAnswer {
  correct: string; // 正确答案 (选择题: A, B, C, D; 填空题: 实际答案字符串)
  explanation?: string; // 答案解析
}

interface Step {
  id: number;
  title: string; // 必须的标题，用于判断是否为选择题或填空题
  content: StepContent;
  answer?: QuizAnswer; // 答案配置（选择题：title以'-选择题'结尾；填空题：title以'-填空题'结尾）
}

// 章节
interface Chapter {
  id: number;
  title: string;
  steps: Step[];
}

// 课程接口
export interface Course {
  id: string;
  type: LanguageType;
  title: string;
  icon: string;
  totalSteps: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  chapters: Chapter[];
  tags: string[];
}

// 学习状态接口
export interface LearningStatus {
  courseId: string;
  language: LanguageType;
  currentChapter: number;
  currentStep: number;
  completedSteps: number[];
  completedChapters: number[]; // 新增：已完成的章节
  isEnrolled: boolean;
  lastStudyTime: number;
  progress: number; // 0-100
}

function getPython(): Course {
  return {
    id: "python-basics",
    type: "python",
    title: "Python 基础入门",
    icon: "/src/assets/images/icon/python-icon.png",
    totalSteps: 5,
    difficulty: "beginner",
    tags: ["编程", "Python", "入门"],
    chapters: [
      {
        id: 1,
        title: "初识Python",
        steps: [
          {
            id: 1,
            title: "001-Python特点",
            content: {
              src: urlMd().Python + "/001-Python特点.md?raw",
            },
          },
          {
            id: 2,
            title: "002-选择题",
            content: {
              src: urlMd().Python + "/002-选择题.md",
            },
            // 选择题答案配置（前端存储，用户看不到源码）
            answer: {
              correct: "C", // 正确答案
              explanation: "Python是一种解释型语言",
            },
          },
        ],
      },
      {
        id: 2,
        title: "第一个Python程序",
        steps: [
          {
            id: 3,
            title: "003-第一个程序",
            content: {
              src: urlMd().Python + "/003-第一个程序.md",
            },
          },
          {
            id: 4,
            title: "004-填空题",
            content: {
              src: urlMd().Python + "/004-填空题.md",
            },
            // 填空题答案配置
            answer: {
              correct: "print", // 正确答案：print
              explanation: "print函数用于输出内容到控制台",
            },
          },
        ],
      },
    ],
  };
}

function getJavaScript(): Course {
  return {
    id: "javascript-basics",
    type: "javascript",
    title: "JavaScript 基础",
    icon: "/src/assets/images/icon/js-icon.png",
    totalSteps: 4,
    difficulty: "beginner",
    tags: ["编程", "JavaScript", "前端"],
    chapters: [
      {
        id: 1,
        title: "JavaScript 基础语法",
        steps: [
          {
            id: 1,
            title: "JavaScript简介",
            content: {
              src: urlMd().Python + "/001-Python特点.md?raw", // 临时使用Python的MD
            },
          },
        ],
      },
      {
        id: 2,
        title: "JavaScript 数据类型",
        steps: [
          {
            id: 3,
            title: "数据类型-选择题",
            content: {
              src: urlMd().Python + "/js-data-types-quiz.md", // 需要创建对应的MD文件
            },
            answer: {
              correct: "B", // 正确答案
              explanation:
                "JavaScript支持string数据类型，而int、float、double是其他语言的类型",
            },
          },
        ],
      },
    ],
  };
}
// 课程数据
export const coursesData: Course[] = [getPython(), getJavaScript()];

// 获取指定语言的课程
export const getCoursesByLanguage = (language: LanguageType): Course[] => {
  return coursesData.filter(course => course.type === language);
};

// 获取指定课程
export const getCourseById = (id: string): Course | undefined => {
  return coursesData.find(course => course.id === id);
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
  return course.chapters.reduce(
    (total, chapter) => total + chapter.steps.length,
    0
  );
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

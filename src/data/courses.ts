import { urlMd } from "@/utils/url.util.ts";

// 课程类型定义
export type LanguageType = "javascript" | "python" | "html" | "css";

// 步骤配置类型
interface MdStep {
  type: "md";
  src: string;
}

export interface ChoiceStep<Options extends readonly string[]> {
  type: "choice";
  data: {
    questions: string;
    code?: string;
    options: Options;
    answer: Options[number];
  };
}

type StepContent = MdStep | ChoiceStep<readonly string[]>;

// 单个步骤
interface Step {
  id: number;
  type: "md" | "choice";
  title?: string;
  content: StepContent;
}

// 章节
interface Chapter {
  id: number;
  title: string;
  description?: string;
  steps: Step[];
}

// 课程接口
export interface Course {
  id: string;
  type: LanguageType;
  title: string;
  description: string;
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
    description: "从零开始学习Python编程语言，掌握基础语法和概念",
    icon: "/src/assets/images/icon/python-icon.png",
    totalSteps: 4,
    difficulty: "beginner",
    tags: ["编程", "Python", "入门"],
    chapters: [
      {
        id: 1,
        title: "Python 简介",
        description: "了解Python语言的特点和优势",
        steps: [
          {
            id: 1,
            type: "md",
            title: "Python特点",
            content: {
              type: "md",
              src: urlMd().Python.yuque + "/001-Python特点.md?raw",
            },
          },
          {
            id: 2,
            type: "choice",
            title: "选择题",
            content: {
              type: "md",
              src: urlMd().Python.yuque + "/002-选择题.md",
            },
          },
          {
            id: 3,
            type: "md",
            title: "代码高亮测试",
            content: {
              type: "md",
              src: urlMd().Python.yuque + "/test-prism-highlight.md",
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
    description: "学习JavaScript编程语言，掌握前端开发基础",
    icon: "/src/assets/images/icon/js-icon.png",
    totalSteps: 4,
    difficulty: "beginner",
    tags: ["编程", "JavaScript", "前端"],
    chapters: [
      {
        id: 1,
        title: "JavaScript 基础语法",
        description: "学习JavaScript的基本语法和概念",
        steps: [
          {
            id: 1,
            type: "md",
            title: "JavaScript简介",
            content: {
              type: "md",
              src: urlMd().Python.yuque + "/001-Python特点.md?raw", // 临时使用Python的MD
            },
          },
        ],
      },
      {
        id: 2,
        title: "JavaScript 数据类型",
        description: "了解JavaScript的数据类型系统",
        steps: [
          {
            id: 3,
            type: "choice",
            title: "数据类型测试",
            content: {
              type: "choice",
              data: {
                questions: "以下哪个是JavaScript的数据类型？",
                code: `
                  // 选择JavaScript支持的数据类型
                `,
                options: [
                  "A. int",
                  "B. string",
                  "C. float",
                  "D. double",
                ] as const,
                answer: "B. string",
              },
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

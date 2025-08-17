import { urlMd } from "@/utils/url.util.ts";

// 课程类型定义
export type LanguageType = "javascript" | "python" | "html" | "css";

// 步骤配置类型 - 现在统一为markdown内容
interface StepContent {
  src: string;
}

// 答案配置（选择题和填空题通用）
export interface QuizAnswer {
  correct: string | string[]; // 正确答案 (选择题: A, B, C, D; 填空题: 答案数组)
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
  // 辅助函数：从title提取id
  const extractIdFromTitle = (title: string): number => {
    const match = title.match(/^(\d+)-/);
    return match ? parseInt(match[1]) : 0;
  };

  // 辅助函数：创建步骤，自动提取id
  const createStep = (title: string, answer?: QuizAnswer): Step => ({
    id: extractIdFromTitle(title),
    title,
    content: {
      src:
        urlMd().Python + `/${title}.md${title.includes("特点") ? "?raw" : ""}`,
    },
    ...(answer && { answer }),
  });

  const chapters = [
    {
      id: 1,
      title: "初识Python",
      steps: [
        createStep("001-Python特点"),
        createStep("002-选择题", {
          correct: "C", // 正确答案
          explanation: "Python是一种解释型语言",
        }),
      ],
    },
    {
      id: 2,
      title: "第一个Python程序",
      steps: [
        createStep("003-第一个程序"),
        createStep("004-填空题", {
          correct: "print", // 正确答案：print
          explanation: "print函数用于输出内容到控制台",
        }),
        createStep("005-打印文本"),
        createStep("006-注释"),
        createStep("007-选择题", {
          correct: "B", // 正确答案：使用三个单引号'''包裹注释内容
          explanation:
            "Python中使用三个单引号'''或三个双引号\"\"\"来进行多行注释",
        }),
      ],
    },
  ];

  // 自动计算总步骤数
  const totalSteps = chapters.reduce(
    (total, chapter) => total + chapter.steps.length,
    0
  );

  return {
    id: "python-basics",
    type: "python",
    title: "Python基础入门",
    icon: "/src/assets/images/icon/python-icon.png",
    totalSteps,
    difficulty: "beginner",
    tags: ["编程", "Python", "入门"],
    chapters,
  };
}

function getJavaScript(): Course {
  // 辅助函数：从title提取id（兼容非标准格式）
  const extractIdFromTitle = (title: string): number => {
    const match = title.match(/^(\d+)-/);
    if (match) return parseInt(match[1]);
    // 对于JavaScript简介和数据类型-选择题，使用序号
    if (title === "JavaScript简介") return 1;
    if (title === "数据类型-选择题") return 3;
    return 0;
  };

  // 辅助函数：创建步骤，自动提取id
  const createStep = (title: string, answer?: QuizAnswer): Step => ({
    id: extractIdFromTitle(title),
    title,
    content: {
      src:
        title === "JavaScript简介"
          ? urlMd().Python + "/001-Python特点.md?raw" // 临时使用Python的MD
          : urlMd().Python + "/js-data-types-quiz.md", // 需要创建对应的MD文件
    },
    ...(answer && { answer }),
  });

  const chapters = [
    {
      id: 1,
      title: "JavaScript 基础语法",
      steps: [createStep("JavaScript简介")],
    },
    {
      id: 2,
      title: "JavaScript 数据类型",
      steps: [
        createStep("数据类型-选择题", {
          correct: "B", // 正确答案
          explanation:
            "JavaScript支持string数据类型，而int、float、double是其他语言的类型",
        }),
      ],
    },
  ];

  // 自动计算总步骤数
  const totalSteps = chapters.reduce(
    (total, chapter) => total + chapter.steps.length,
    0
  );

  return {
    id: "javascript-basics",
    type: "javascript",
    title: "JavaScript 基础",
    icon: "/src/assets/images/icon/js-icon.png",
    totalSteps,
    difficulty: "beginner",
    tags: ["编程", "JavaScript", "前端"],
    chapters,
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

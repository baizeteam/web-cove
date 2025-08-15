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

type StepConfig = MdStep | ChoiceStep<readonly string[]>;

// 课程接口
export interface Course {
  id: string;
  type: LanguageType;
  title: string;
  description: string;
  icon: string;
  totalSteps: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: Record<number, StepConfig>;
  tags: string[];
}

// 学习状态接口
export interface LearningStatus {
  courseId: string;
  language: LanguageType;
  currentStep: number;
  completedSteps: number[];
  isEnrolled: boolean;
  lastStudyTime: number;
  progress: number; // 0-100
}

// 课程数据
export const coursesData: Course[] = [
  {
    id: "python-basics",
    type: "python",
    title: "Python 基础入门",
    description: "从零开始学习Python编程语言，掌握基础语法和概念",
    icon: "/src/assets/images/icon/python-icon.png",
    totalSteps: 5,
    difficulty: "beginner",
    tags: ["编程", "Python", "入门"],
    steps: {
      1: {
        type: "md",
        src: urlMd().Python.yuque + "/001-Python特点.md?raw",
      },
      2: {
        type: "choice",
        data: {
          questions: "以下的代码运行什么？",
          code: ` 
            def print_double(x):
              print(2 * x)
            print_double(3)
          `,
          options: ["A.6", "B.2", "C.3", "D.0"] as const,
          answer: "A.6",
        },
      },
      3: {
        type: "md",
        src: urlMd().Python.typora + "/test.md",
      },
      4: {
        type: "choice",
        data: {
          questions: "Python中如何定义一个函数？",
          code: `
            # 选择正确的函数定义语法
          `,
          options: [
            "A. function name():",
            "B. def name():",
            "C. func name():",
            "D. define name():",
          ] as const,
          answer: "B. def name():",
        },
      },
      5: {
        type: "md",
        src: urlMd().Python.yuque + "/thrid.md",
      },
    },
  },
  {
    id: "javascript-basics",
    type: "javascript",
    title: "JavaScript 基础",
    description: "学习JavaScript编程语言，掌握前端开发基础",
    icon: "/src/assets/images/icon/js-icon.png",
    totalSteps: 4,
    difficulty: "beginner",
    tags: ["编程", "JavaScript", "前端"],
    steps: {
      1: {
        type: "md",
        src: urlMd().Python.yuque + "/001-Python特点.md?raw", // 临时使用Python的MD
      },
      2: {
        type: "choice",
        data: {
          questions: "JavaScript中如何声明变量？",
          code: `
            // 选择正确的变量声明方式
          `,
          options: [
            "A. var x = 1",
            "B. let x = 1",
            "C. const x = 1",
            "D. 以上都对",
          ] as const,
          answer: "D. 以上都对",
        },
      },
      3: {
        type: "choice",
        data: {
          questions: "以下哪个是JavaScript的数据类型？",
          code: `
            // 选择JavaScript支持的数据类型
          `,
          options: ["A. int", "B. string", "C. float", "D. double"] as const,
          answer: "B. string",
        },
      },
      4: {
        type: "md",
        src: urlMd().Python.typora + "/test.md", // 临时使用Python的MD
      },
    },
  },
  {
    id: "html-css-basics",
    type: "html",
    title: "HTML & CSS 基础",
    description: "学习网页开发的基础知识，HTML结构和CSS样式",
    icon: "/src/assets/images/icon/html-icon.png",
    totalSteps: 3,
    difficulty: "beginner",
    tags: ["网页", "HTML", "CSS"],
    steps: {
      1: {
        type: "md",
        src: urlMd().Python.yuque + "/001-Python特点.md?raw", // 临时使用Python的MD
      },
      2: {
        type: "choice",
        data: {
          questions: "HTML中如何创建链接？",
          code: `
            <!-- 选择正确的HTML链接标签 -->
          `,
          options: ["A. <link>", "B. <a>", "C. <href>", "D. <url>"] as const,
          answer: "B. <a>",
        },
      },
      3: {
        type: "choice",
        data: {
          questions: "CSS中如何改变文字颜色？",
          code: `
            /* 选择正确的CSS属性 */
          `,
          options: [
            "A. text-color",
            "B. color",
            "C. font-color",
            "D. text-style",
          ] as const,
          answer: "B. color",
        },
      },
    },
  },
];

// 获取指定语言的课程
export const getCoursesByLanguage = (language: LanguageType): Course[] => {
  return coursesData.filter((course) => course.type === language);
};

// 获取指定课程
export const getCourseById = (id: string): Course | undefined => {
  return coursesData.find((course) => course.id === id);
};

// 获取指定语言和ID的课程
export const getCourseByLanguageAndId = (
  language: LanguageType,
  id: string,
): Course | undefined => {
  return coursesData.find(
    (course) => course.type === language && course.id === id,
  );
};

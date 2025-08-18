import type { Course, Step, QuizAnswer } from "../types";
import { PYTHON_BASIC_PATH_CONFIG, resolveStepPath } from "../path-config";
import pythonIcon from "@/assets/images/icon/python-icon.png";

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
    src: resolveStepPath(PYTHON_BASIC_PATH_CONFIG, title),
  },
  ...(answer && { answer }),
});

// 严格的章节步骤定义 - 按实际文件分布
const CHAPTER_DEFINITIONS = {
  初识Python: {
    folderName: "1-初识Python",
    allowedStepIds: [1, 2], // 只允许001, 002
    steps: [
      createStep("001-Python特点"),
      createStep("002-选择题", {
        correct: "C", // 正确答案
        explanation: "Python是一种解释型语言",
      }),
    ],
  },
  第一个Python程序: {
    folderName: "2-第一个Python程序",
    allowedStepIds: [3, 4, 5, 6, 7], // 只允许003-007
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
      // 如果有人错误地把008放在这里，验证会报错
      // createStep("008-变量"), // 这行如果取消注释，会立即报错
    ],
  },
  变量和命名规则: {
    folderName: "3-变量和命名规则",
    allowedStepIds: [8, 9, 10], // 只允许008-010
    steps: [
      createStep("008-变量"),
      createStep("009-选择题", {
        correct: "A", // 正确答案
        explanation: 'name 是一个变量并且赋值"eggs" 所以输出的是 eggseggseggs',
      }),
      createStep("010-变量重新赋值"),
    ],
  },
} as const;

// 编译时验证函数
function validateChapterSteps() {
  Object.entries(CHAPTER_DEFINITIONS).forEach(([chapterName, definition]) => {
    definition.steps.forEach(step => {
      const stepId = extractIdFromTitle(step.title);
      if (!definition.allowedStepIds.includes(stepId)) {
        throw new Error(
          `错误: 步骤 "${step.title}" (ID: ${stepId}) 不属于章节 "${chapterName}"` +
            `\n允许的步骤ID: [${definition.allowedStepIds.join(", ")}]` +
            `\n请检查课程配置！`
        );
      }
    });
  });
}

// 立即执行验证
validateChapterSteps();

export function getPythonBasicCourse(): Course {
  // 将章节定义转换为课程章节结构
  const chapters = Object.entries(CHAPTER_DEFINITIONS).map(
    ([title, definition], index) => ({
      id: index + 1, // 自动生成ID
      title,
      steps: definition.steps,
    })
  );

  // 自动计算总步骤数 [[memory:6442364]]
  const totalSteps = chapters.reduce(
    (total, chapter) => total + chapter.steps.length,
    0
  );

  return {
    id: "Python基础入门", // 使用中文ID
    type: "python",
    title: "Python基础入门",
    icon: pythonIcon,
    totalSteps,
    difficulty: "beginner",
    tags: ["编程", "Python", "入门"],
    chapters,
  };
}

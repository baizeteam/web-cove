import type { Course, Step, QuizAnswer } from "../types";

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
    src: "/Markdown/JavaScript/JavaScript基础入门/" + title + ".md",
  },
  ...(answer && { answer }),
});

export function getJavaScriptBasicCourse(): Course {
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

  // 自动计算总步骤数 [[memory:6442364]]
  const totalSteps = chapters.reduce(
    (total, chapter) => total + chapter.steps.length,
    0
  );

  return {
    id: "JavaScript基础", // 使用中文ID
    type: "javascript",
    title: "JavaScript基础",
    icon: "/src/assets/images/icon/js-icon.png",
    totalSteps,
    difficulty: "beginner",
    tags: ["编程", "JavaScript", "前端"],
    chapters,
  };
}

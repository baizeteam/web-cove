import type { Course, Step, QuizAnswer } from "../types";

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
    src: `/Markdown/Python/Python基础入门/${title}.md${title.includes("特点") ? "?raw" : ""}`,
  },
  ...(answer && { answer }),
});

export function getPythonBasicCourse(): Course {
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
        createStep("008-变量"),
        createStep("009-选择题", {
          correct: "A", // 正确答案
          explanation:
            'name 是一个变量并且赋值"eggs" 所以输出的是 eggseggseggs',
        }),
        createStep("010-变量重新赋值"),
      ],
    },
  ];

  // 自动计算总步骤数 [[memory:6442364]]
  const totalSteps = chapters.reduce(
    (total, chapter) => total + chapter.steps.length,
    0
  );

  return {
    id: "Python基础入门", // 使用中文ID
    type: "python",
    title: "Python基础入门",
    icon: "/src/assets/images/icon/python-icon.png",
    totalSteps,
    difficulty: "beginner",
    tags: ["编程", "Python", "入门"],
    chapters,
  };
}

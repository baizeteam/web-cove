// 课程类型定义
export type LanguageType = "javascript" | "python" | "html" | "css";

// 步骤配置类型 - 现在统一为markdown内容
export interface StepContent {
  src: string;
}

// 答案配置（选择题和填空题通用）
export interface QuizAnswer {
  correct: string | string[]; // 正确答案 (选择题: A, B, C, D; 填空题: 答案数组)
  explanation?: string; // 答案解析
}

export interface Step {
  id: number;
  title: string; // 必须的标题，用于判断是否为选择题或填空题
  content: StepContent;
  answer?: QuizAnswer; // 答案配置（选择题：title以'-选择题'结尾；填空题：title以'-填空题'结尾）
}

// 章节
export interface Chapter {
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

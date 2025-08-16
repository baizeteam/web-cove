import type { LanguageType } from "@/data/courses";

// 错题记录接口
export interface WrongQuestion {
  id: string; // 唯一标识：courseId-chapterId-stepId
  courseId: string;
  chapterId: number;
  stepId: number;
  language: LanguageType;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  timestamp: number;
  attempts: number; // 尝试次数
}

// 错题统计接口
export interface WrongQuestionStats {
  totalWrong: number;
  byLanguage: Record<LanguageType, number>;
  recentWrong: WrongQuestion[];
}

const WRONG_QUESTIONS_KEY = "wrong_questions";

// 获取所有错题记录
export const getAllWrongQuestions = (): WrongQuestion[] => {
  try {
    const stored = localStorage.getItem(WRONG_QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("获取错题记录失败:", error);
    return [];
  }
};

// 保存错题记录
export const saveWrongQuestions = (wrongQuestions: WrongQuestion[]): void => {
  try {
    localStorage.setItem(WRONG_QUESTIONS_KEY, JSON.stringify(wrongQuestions));

    // 触发自定义事件，通知其他组件数据已更新
    const event = new CustomEvent("wrong-questions-updated", {
      detail: { wrongQuestions },
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error("保存错题记录失败:", error);
  }
};

// 添加错题记录
export const addWrongQuestion = (
  wrongQuestion: Omit<WrongQuestion, "id" | "timestamp" | "attempts">
): void => {
  const allWrongQuestions = getAllWrongQuestions();
  const questionId = `${wrongQuestion.courseId}-${wrongQuestion.chapterId}-${wrongQuestion.stepId}`;

  // 检查是否已存在相同题目
  const existingIndex = allWrongQuestions.findIndex(q => q.id === questionId);

  if (existingIndex >= 0) {
    // 更新现有错题记录
    allWrongQuestions[existingIndex] = {
      ...allWrongQuestions[existingIndex],
      userAnswer: wrongQuestion.userAnswer,
      timestamp: Date.now(),
      attempts: allWrongQuestions[existingIndex].attempts + 1,
    };
  } else {
    // 添加新的错题记录
    const newWrongQuestion: WrongQuestion = {
      ...wrongQuestion,
      id: questionId,
      timestamp: Date.now(),
      attempts: 1,
    };
    allWrongQuestions.push(newWrongQuestion);
  }

  saveWrongQuestions(allWrongQuestions);
};

// 移除错题记录（答对时调用）
export const removeWrongQuestion = (
  courseId: string,
  chapterId: number,
  stepId: number
): void => {
  const allWrongQuestions = getAllWrongQuestions();
  const questionId = `${courseId}-${chapterId}-${stepId}`;

  const filteredQuestions = allWrongQuestions.filter(q => q.id !== questionId);
  saveWrongQuestions(filteredQuestions);
};

// 根据语言获取错题记录
export const getWrongQuestionsByLanguage = (
  language: LanguageType
): WrongQuestion[] => {
  const allWrongQuestions = getAllWrongQuestions();
  return allWrongQuestions.filter(q => q.language === language);
};

// 根据课程获取错题记录
export const getWrongQuestionsByCourse = (
  courseId: string
): WrongQuestion[] => {
  const allWrongQuestions = getAllWrongQuestions();
  return allWrongQuestions.filter(q => q.courseId === courseId);
};

// 检查特定题目是否为错题
export const isWrongQuestion = (
  courseId: string,
  chapterId: number,
  stepId: number
): boolean => {
  const allWrongQuestions = getAllWrongQuestions();
  const questionId = `${courseId}-${chapterId}-${stepId}`;
  return allWrongQuestions.some(q => q.id === questionId);
};

// 获取错题统计
export const getWrongQuestionStats = (): WrongQuestionStats => {
  const allWrongQuestions = getAllWrongQuestions();

  const byLanguage: Record<string, number> = {};
  allWrongQuestions.forEach(q => {
    byLanguage[q.language] = (byLanguage[q.language] || 0) + 1;
  });

  // 按时间排序，获取最近的错题
  const recentWrong = [...allWrongQuestions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return {
    totalWrong: allWrongQuestions.length,
    byLanguage: byLanguage as Record<LanguageType, number>,
    recentWrong,
  };
};

// 清除所有错题记录
export const clearAllWrongQuestions = (): void => {
  localStorage.removeItem(WRONG_QUESTIONS_KEY);

  // 触发更新事件
  const event = new CustomEvent("wrong-questions-updated", {
    detail: { wrongQuestions: [] },
  });
  window.dispatchEvent(event);
};

// 清除指定语言的错题记录
export const clearWrongQuestionsByLanguage = (language: LanguageType): void => {
  const allWrongQuestions = getAllWrongQuestions();
  const filteredQuestions = allWrongQuestions.filter(
    q => q.language !== language
  );
  saveWrongQuestions(filteredQuestions);
};

// 格式化时间
export const formatQuestionTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const oneDay = 24 * 60 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  const oneMinute = 60 * 1000;

  if (diff < oneMinute) {
    return "刚刚";
  } else if (diff < oneHour) {
    const minutes = Math.floor(diff / oneMinute);
    return `${minutes}分钟前`;
  } else if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    return `${hours}小时前`;
  } else {
    const days = Math.floor(diff / oneDay);
    return `${days}天前`;
  }
};

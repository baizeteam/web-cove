// 课程路径配置 - 简单但可维护的抽象

// 课程路径配置表 - 集中管理所有路径规则
const COURSE_PATH_CONFIGS = {
  Python基础入门: {
    basePath: "/Markdown/Python/Python基础入门",
    chapterMappings: [
      { range: [1, 2], folder: "1-初识Python" },
      { range: [3, 7], folder: "2-第一个Python程序" },
      { range: [8, 10], folder: "3-变量和命名规则" },
    ],
    defaultChapter: "1-初识Python",
  },
  JavaScript基础: {
    basePath: "/Markdown/JavaScript/JavaScript基础",
    chapterMappings: [
      { range: [1, 3], folder: "1-基础语法" },
      { range: [4, 6], folder: "2-数据类型" },
    ],
    defaultChapter: "1-基础语法",
  },
} as const;

// 路径解析函数
export const getCoursePath = (courseId: string, fileName: string): string => {
  const config =
    COURSE_PATH_CONFIGS[courseId as keyof typeof COURSE_PATH_CONFIGS];
  const rawSuffix = fileName.includes("特点") ? "?raw" : "";

  if (config) {
    const fileId = extractFileId(fileName);
    const chapterMapping = config.chapterMappings.find(
      mapping => fileId >= mapping.range[0] && fileId <= mapping.range[1]
    );

    const chapterFolder = chapterMapping?.folder || config.defaultChapter;
    return `${config.basePath}/${chapterFolder}/${fileName}.md${rawSuffix}`;
  }

  // 兜底：扁平结构
  return `/Markdown/${courseId}/${fileName}.md${rawSuffix}`;
};

// 添加新课程配置的函数 - 方便扩展
export const addCourseConfig = (
  courseId: string,
  config: {
    basePath: string;
    chapterMappings: { range: [number, number]; folder: string }[];
    defaultChapter: string;
  }
) => {
  (COURSE_PATH_CONFIGS as any)[courseId] = config;
};

// 从文件名提取ID
function extractFileId(fileName: string): number {
  const match = fileName.match(/^(\d+)-/);
  return match ? parseInt(match[1]) : 0;
}

// 保留接口兼容性
export const switchPathStrategy = (strategyName: string): void => {
  console.log(`路径策略: ${strategyName} (当前使用配置驱动)`);
};

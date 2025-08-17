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
    const finalPath = `${config.basePath}/${chapterFolder}/${fileName}.md${rawSuffix}`;

    // 调试信息
    if (process.env.NODE_ENV === "development") {
      console.log(`路径解析: ${courseId}/${fileName} -> ${finalPath}`);
    }

    return finalPath;
  }

  // 兜底：扁平结构
  const fallbackPath = `/Markdown/${courseId}/${fileName}.md${rawSuffix}`;
  console.warn(`未找到课程配置: ${courseId}，使用兜底路径: ${fallbackPath}`);
  return fallbackPath;
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
  console.log(`已添加课程配置: ${courseId}`);
};

// 验证路径配置的函数
export const validatePathConfig = (courseId: string): boolean => {
  const config =
    COURSE_PATH_CONFIGS[courseId as keyof typeof COURSE_PATH_CONFIGS];
  if (!config) {
    console.error(`课程 ${courseId} 缺少路径配置`);
    return false;
  }

  // 检查是否有重叠的范围
  const ranges = config.chapterMappings.map(m => m.range);
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const [start1, end1] = ranges[i];
      const [start2, end2] = ranges[j];
      if (start1 <= end2 && start2 <= end1) {
        console.error(
          `课程 ${courseId} 的章节范围有重叠: [${start1},${end1}] 和 [${start2},${end2}]`
        );
        return false;
      }
    }
  }

  return true;
};

// 获取所有已配置的课程
export const getConfiguredCourses = (): string[] => {
  return Object.keys(COURSE_PATH_CONFIGS);
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

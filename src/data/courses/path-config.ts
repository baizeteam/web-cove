// 课程路径配置 - 专门用于课程数据，避免循环依赖

// 路径配置接口
export interface CoursePathConfig {
  basePath: string;
  chapterMappings: {
    stepRange: [number, number]; // [开始ID, 结束ID]
    folderName: string;
  }[];
}

// Python课程路径配置
export const PYTHON_BASIC_PATH_CONFIG: CoursePathConfig = {
  basePath: "/Markdown/Python/Python基础入门",
  chapterMappings: [
    { stepRange: [1, 2], folderName: "1-初识Python" },
    { stepRange: [3, 7], folderName: "2-第一个Python程序" },
    { stepRange: [8, 10], folderName: "3-变量和命名规则" },
  ],
};

// JavaScript课程路径配置（如果需要的话）
export const JAVASCRIPT_BASIC_PATH_CONFIG: CoursePathConfig = {
  basePath: "/Markdown/JavaScript/JavaScript基础",
  chapterMappings: [
    { stepRange: [1, 3], folderName: "1-基础语法" },
    { stepRange: [4, 6], folderName: "2-数据类型" },
  ],
};

// 路径解析函数
export function resolveStepPath(
  config: CoursePathConfig,
  title: string
): string {
  const rawSuffix = title.includes("特点") ? "?raw" : "";
  const fileId = extractFileIdFromTitle(title);

  // 查找对应的章节文件夹
  const chapterMapping = config.chapterMappings.find(
    mapping => fileId >= mapping.stepRange[0] && fileId <= mapping.stepRange[1]
  );

  if (chapterMapping) {
    return `${config.basePath}/${chapterMapping.folderName}/${title}.md${rawSuffix}`;
  }

  // 如果找不到对应的章节，使用第一个章节作为默认
  const defaultChapter = config.chapterMappings[0];
  return `${config.basePath}/${defaultChapter.folderName}/${title}.md${rawSuffix}`;
}

// 从title提取文件ID
function extractFileIdFromTitle(title: string): number {
  const match = title.match(/^(\d+)-/);
  return match ? parseInt(match[1]) : 0;
}

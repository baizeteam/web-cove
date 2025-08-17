// 路径配置管理 - 集中化配置
import { switchPathStrategy } from "../utils/course-config";

// 路径配置类型
export type PathConfigType = "development" | "production" | "testing";

// 路径配置映射
export const PATH_CONFIGS: Record<
  PathConfigType,
  { strategy: string; args?: any[] }
> = {
  development: {
    strategy: "dynamic", // 开发环境使用动态检测
  },
  production: {
    strategy: "dynamic", // 生产环境也使用动态检测
  },
  testing: {
    strategy: "flat", // 测试环境使用扁平结构
  },
};

// 初始化路径配置
export const initializePathConfig = (configType?: PathConfigType): void => {
  const type =
    configType || (process.env.NODE_ENV as PathConfigType) || "development";
  const config = PATH_CONFIGS[type];

  if (config) {
    switchPathStrategy(config.strategy, ...(config.args || []));
    console.log(`路径配置已初始化: ${type} -> ${config.strategy}`);
  } else {
    console.warn(`未知的配置类型: ${type}，使用默认配置`);
  }
};

// 动态添加新的路径策略配置
export const addPathConfig = (
  name: PathConfigType,
  strategy: string,
  args?: any[]
): void => {
  PATH_CONFIGS[name] = { strategy, args };
};

// 课程特定路径覆盖
export const COURSE_PATH_OVERRIDES: Record<string, string> = {
  // 如果某个课程需要特殊路径，可以在这里配置
  // 'Python基础入门': '/special/path/Python基础入门',
};

// 检查是否有路径覆盖
export const getPathOverride = (courseId: string): string | undefined => {
  return COURSE_PATH_OVERRIDES[courseId];
};

// 路径解析器 - 单一职责：解析文件路径
export interface IPathResolver {
  resolvePath(courseId: string, fileName: string): string;
}

// 课程路径配置接口
export interface CoursePathConfig {
  courseId: string;
  basePath: string;
  subDirectory?: string;
}

// 默认路径解析器实现
export class DefaultPathResolver implements IPathResolver {
  private pathConfigs: Map<string, CoursePathConfig> = new Map();

  constructor(configs: CoursePathConfig[]) {
    configs.forEach(config => {
      this.pathConfigs.set(config.courseId, config);
    });
  }

  resolvePath(courseId: string, fileName: string): string {
    const config = this.pathConfigs.get(courseId);
    if (!config) {
      throw new Error(`未找到课程 ${courseId} 的路径配置`);
    }

    const basePath = config.basePath;
    const subDir = config.subDirectory ? `/${config.subDirectory}` : "";
    const rawSuffix = fileName.includes("特点") ? "?raw" : "";

    return `${basePath}${subDir}/${fileName}.md${rawSuffix}`;
  }

  // 添加或更新路径配置
  updateConfig(config: CoursePathConfig): void {
    this.pathConfigs.set(config.courseId, config);
  }

  // 获取所有配置
  getAllConfigs(): CoursePathConfig[] {
    return Array.from(this.pathConfigs.values());
  }
}

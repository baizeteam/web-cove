import { dynamicPathResolver } from "./dynamic-path-resolver";

// 路径解析策略接口
export interface IPathStrategy {
  resolvePath(courseId: string, fileName: string): string;
}

// 动态检测策略（推荐使用）
export class DynamicPathStrategy implements IPathStrategy {
  resolvePath(courseId: string, fileName: string): string {
    // 使用同步版本，如果需要异步检测，可以在组件中预加载
    return dynamicPathResolver.resolvePathSync(courseId, fileName);
  }

  // 异步预加载方法
  async preloadPath(courseId: string, fileName: string): Promise<string> {
    return await dynamicPathResolver.resolvePath(courseId, fileName);
  }
}

// 分层目录策略（当前使用的策略）
export class HierarchicalPathStrategy implements IPathStrategy {
  resolvePath(courseId: string, fileName: string): string {
    const rawSuffix = fileName.includes("特点") ? "?raw" : "";
    return `/Markdown/Python/${courseId}/${fileName}.md${rawSuffix}`;
  }
}

// 扁平目录策略（如果将来要改为扁平结构）
export class FlatPathStrategy implements IPathStrategy {
  resolvePath(courseId: string, fileName: string): string {
    const rawSuffix = fileName.includes("特点") ? "?raw" : "";
    return `/Markdown/${courseId}-${fileName}.md${rawSuffix}`;
  }
}

// 语言分组策略（按语言分组）
export class LanguageGroupStrategy implements IPathStrategy {
  private languageMap: Record<string, string> = {
    Python基础入门: "python",
    JavaScript基础: "javascript",
  };

  resolvePath(courseId: string, fileName: string): string {
    const language = this.languageMap[courseId] || "unknown";
    const rawSuffix = fileName.includes("特点") ? "?raw" : "";
    return `/Markdown/${language}/${courseId}/${fileName}.md${rawSuffix}`;
  }
}

// 日期版本策略（如果需要版本管理）
export class VersionedPathStrategy implements IPathStrategy {
  private version: string;

  constructor(version: string = "v1") {
    this.version = version;
  }

  resolvePath(courseId: string, fileName: string): string {
    const rawSuffix = fileName.includes("特点") ? "?raw" : "";
    return `/Markdown/${this.version}/${courseId}/${fileName}.md${rawSuffix}`;
  }
}

// 策略工厂
export class PathStrategyFactory {
  private static strategies: Record<string, () => IPathStrategy> = {
    dynamic: () => new DynamicPathStrategy(), // 动态检测策略
    hierarchical: () => new HierarchicalPathStrategy(),
    flat: () => new FlatPathStrategy(),
    language: () => new LanguageGroupStrategy(),
    versioned: (version?: string) => new VersionedPathStrategy(version),
  };

  static createStrategy(type: string, ...args: any[]): IPathStrategy {
    const strategyCreator = this.strategies[type];
    if (!strategyCreator) {
      throw new Error(`未知的路径策略: ${type}`);
    }
    return strategyCreator(...args);
  }

  static registerStrategy(name: string, creator: () => IPathStrategy): void {
    this.strategies[name] = creator;
  }
}

// 动态路径解析器 - 自动检测和匹配路径
import { chapterMappingService } from "./chapter-mapping";

export class DynamicPathResolver {
  private pathCache = new Map<string, string>();
  private baseUrl = "/Markdown";

  // 可能的路径模式
  private pathPatterns = [
    // 按章节分组模式：/Markdown/Language/CourseName/ChapterName/filename.md
    (courseId: string, fileName: string) => {
      const fileId = this.extractFileId(fileName);
      const chapterFolder = this.getChapterFolder(courseId, fileId);
      if (chapterFolder) {
        return `${this.baseUrl}/Python/${courseId}/${chapterFolder}/${fileName}.md`;
      }
      return null; // 如果找不到章节映射，返回null
    },
    // 分层模式：/Markdown/Language/CourseName/filename.md
    (courseId: string, fileName: string) =>
      `${this.baseUrl}/Python/${courseId}/${fileName}.md`,
    // 扁平模式：/Markdown/filename.md
    (courseId: string, fileName: string) => `${this.baseUrl}/${fileName}.md`,
    // 语言分组模式：/Markdown/python/filename.md
    (courseId: string, fileName: string) =>
      `${this.baseUrl}/python/${fileName}.md`,
    // 直接路径：/Markdown/CourseName/filename.md
    (courseId: string, fileName: string) =>
      `${this.baseUrl}/${courseId}/${fileName}.md`,
  ];

  // 从文件名提取文件ID
  private extractFileId(fileName: string): number {
    const match = fileName.match(/^(\d+)-/);
    return match ? parseInt(match[1]) : 0;
  }

  // 根据文件ID确定章节文件夹
  private getChapterFolder(courseId: string, fileId: number): string | null {
    return chapterMappingService.getChapterFolder(courseId, fileId);
  }

  // 检查文件是否存在的方法
  private async checkFileExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }

  // 解析路径，带缓存和动态检测
  async resolvePath(courseId: string, fileName: string): Promise<string> {
    const cacheKey = `${courseId}:${fileName}`;

    // 检查缓存
    if (this.pathCache.has(cacheKey)) {
      return this.pathCache.get(cacheKey)!;
    }

    // 添加特殊文件后缀
    const rawSuffix = fileName.includes("特点") ? "?raw" : "";

    // 尝试所有路径模式
    for (const pattern of this.pathPatterns) {
      const testPath = pattern(courseId, fileName);

      if (testPath && (await this.checkFileExists(testPath + rawSuffix))) {
        const finalPath = testPath + rawSuffix;
        this.pathCache.set(cacheKey, finalPath);
        console.log(`找到文件路径: ${finalPath}`);
        return finalPath;
      }
    }

    // 如果都没找到，返回默认路径并记录警告
    const defaultPath = `${this.baseUrl}/Python/${courseId}/${fileName}.md${rawSuffix}`;
    console.warn(`未找到文件 ${fileName}，使用默认路径: ${defaultPath}`);

    return defaultPath;
  }

  // 同步版本（用于已知路径）
  resolvePathSync(courseId: string, fileName: string): string {
    const cacheKey = `${courseId}:${fileName}`;

    if (this.pathCache.has(cacheKey)) {
      return this.pathCache.get(cacheKey)!;
    }

    // 返回最可能的路径
    const rawSuffix = fileName.includes("特点") ? "?raw" : "";
    return `${this.baseUrl}/Python/${courseId}/${fileName}.md${rawSuffix}`;
  }

  // 预加载路径缓存
  async preloadPaths(courseId: string, fileNames: string[]): Promise<void> {
    const promises = fileNames.map(fileName =>
      this.resolvePath(courseId, fileName)
    );
    await Promise.all(promises);
    console.log(`已预加载 ${fileNames.length} 个文件路径`);
  }

  // 清除缓存
  clearCache(): void {
    this.pathCache.clear();
  }

  // 添加自定义路径模式
  addPathPattern(
    pattern: (courseId: string, fileName: string) => string
  ): void {
    this.pathPatterns.unshift(pattern); // 添加到前面，优先尝试
  }

  // 设置基础URL
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    this.clearCache(); // 清除缓存，因为基础URL改变了
  }
}

// 全局实例
export const dynamicPathResolver = new DynamicPathResolver();

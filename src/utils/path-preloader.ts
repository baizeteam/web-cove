// 路径预加载器 - 启动时预加载所有路径
import { dynamicPathResolver } from "./dynamic-path-resolver";
import { coursesData } from "../data/courses";

export class PathPreloader {
  private preloadPromise: Promise<void> | null = null;

  // 预加载所有课程的文件路径
  async preloadAllPaths(): Promise<void> {
    if (this.preloadPromise) {
      return this.preloadPromise;
    }

    this.preloadPromise = this.performPreload();
    return this.preloadPromise;
  }

  private async performPreload(): Promise<void> {
    console.log("开始预加载课程文件路径...");
    const startTime = Date.now();

    const preloadPromises: Promise<void>[] = [];

    for (const course of coursesData) {
      for (const chapter of course.chapters) {
        const fileNames = chapter.steps.map(step => step.title);

        const coursePreload = dynamicPathResolver.preloadPaths(
          course.id,
          fileNames
        );
        preloadPromises.push(coursePreload);
      }
    }

    await Promise.all(preloadPromises);

    const endTime = Date.now();
    console.log(`路径预加载完成，耗时: ${endTime - startTime}ms`);
  }

  // 预加载特定课程
  async preloadCourse(courseId: string): Promise<void> {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) {
      console.warn(`未找到课程: ${courseId}`);
      return;
    }

    const allFileNames: string[] = [];
    course.chapters.forEach(chapter => {
      chapter.steps.forEach(step => {
        allFileNames.push(step.title);
      });
    });

    await dynamicPathResolver.preloadPaths(courseId, allFileNames);
    console.log(`已预加载课程 ${courseId} 的所有文件路径`);
  }

  // 重置预加载状态（用于测试）
  reset(): void {
    this.preloadPromise = null;
    dynamicPathResolver.clearCache();
  }
}

// 全局预加载器实例
export const pathPreloader = new PathPreloader();

// 便捷函数
export const preloadCoursePaths = () => pathPreloader.preloadAllPaths();
export const preloadSingleCourse = (courseId: string) =>
  pathPreloader.preloadCourse(courseId);

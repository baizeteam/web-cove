// 章节映射系统 - 动态处理文件到章节的映射
import { coursesData } from "../data/courses";

export interface ChapterMapping {
  courseId: string;
  chapterMappings: {
    chapterName: string;
    stepIds: number[];
  }[];
}

export class ChapterMappingService {
  private mappings = new Map<string, ChapterMapping>();

  constructor() {
    this.initializeMappings();
  }

  // 从课程数据初始化映射
  private initializeMappings(): void {
    coursesData.forEach(course => {
      const chapterMappings = course.chapters.map(chapter => ({
        chapterName: `${chapter.id}-${chapter.title}`,
        stepIds: chapter.steps.map(step => step.id),
      }));

      this.mappings.set(course.id, {
        courseId: course.id,
        chapterMappings,
      });
    });
  }

  // 根据文件ID获取章节文件夹名称
  getChapterFolder(courseId: string, stepId: number): string | null {
    const mapping = this.mappings.get(courseId);
    if (!mapping) return null;

    for (const chapter of mapping.chapterMappings) {
      if (chapter.stepIds.includes(stepId)) {
        return chapter.chapterName;
      }
    }

    return null;
  }

  // 添加自定义映射
  addMapping(courseId: string, mapping: ChapterMapping): void {
    this.mappings.set(courseId, mapping);
  }

  // 获取所有映射
  getAllMappings(): Map<string, ChapterMapping> {
    return new Map(this.mappings);
  }

  // 重新初始化映射（用于数据更新后）
  refresh(): void {
    this.mappings.clear();
    this.initializeMappings();
  }

  // 调试方法：打印所有映射
  debugMappings(): void {
    console.log("Chapter Mappings:");
    this.mappings.forEach((mapping, courseId) => {
      console.log(`Course: ${courseId}`);
      mapping.chapterMappings.forEach(chapter => {
        console.log(
          `  Chapter: ${chapter.chapterName}, Steps: [${chapter.stepIds.join(", ")}]`
        );
      });
    });
  }
}

// 全局实例
export const chapterMappingService = new ChapterMappingService();

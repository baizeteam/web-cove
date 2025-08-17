import { Router } from "vue-router";

/**
 * 导航管理工具类
 * 用于处理学习过程中的路由导航和历史管理
 */
export class NavigationManager {
  private router: Router;
  private chapterRoutes: string[] = []; // 存储章节内的路由
  private catalogRoute: string = ""; // 目录页路由

  constructor(router: Router) {
    this.router = router;
  }

  /**
   * 设置目录页路由
   */
  setCatalogRoute(route: string) {
    this.catalogRoute = route;
  }

  /**
   * 记录进入章节学习的路由
   */
  enterChapterStudy() {
    const currentRoute = this.router.currentRoute.value.fullPath;

    // 如果当前不在章节路由列表中，则添加
    if (!this.chapterRoutes.includes(currentRoute)) {
      this.chapterRoutes.push(currentRoute);
    }

    console.log("记录章节学习路由:", currentRoute);
    console.log("当前章节路由列表:", this.chapterRoutes);
  }

  /**
   * 智能返回上一页
   * 如果上一页是目录页，则清除章节路由历史
   */
  smartGoBack() {
    const history = window.history;
    const currentPath = this.router.currentRoute.value.fullPath;

    // 检查当前路径是否在章节路由中
    const isInChapter = this.isChapterRoute(currentPath);

    if (isInChapter && this.chapterRoutes.length > 1) {
      // 在章节内，正常返回上一步
      history.back();
    } else if (isInChapter && this.chapterRoutes.length <= 1) {
      // 章节内只有一个路由，返回目录并清理
      this.backToCatalogWithCleanup();
    } else {
      // 不在章节内，正常返回
      history.back();
    }
  }

  /**
   * 返回目录页并清理章节路由历史
   */
  backToCatalogWithCleanup() {
    console.log("返回目录并清理章节路由历史");

    // 清理章节路由
    this.clearChapterRoutes();

    // 跳转到目录页
    if (this.catalogRoute) {
      this.router.replace(this.catalogRoute);
    } else {
      // 如果没有设置目录路由，尝试从当前路由推断
      const currentRoute = this.router.currentRoute.value;
      const catalogPath = this.inferCatalogRoute(currentRoute.fullPath);
      this.router.replace(catalogPath);
    }
  }

  /**
   * 完成章节学习，清理路由并返回目录
   */
  completeChapterStudy() {
    console.log("完成章节学习，清理路由历史");

    // 清理章节路由
    this.clearChapterRoutes();

    // 清理浏览器历史中的章节路由
    this.cleanupBrowserHistory();

    // 返回目录
    if (this.catalogRoute) {
      this.router.replace(this.catalogRoute);
    }
  }

  /**
   * 清理章节路由列表
   */
  private clearChapterRoutes() {
    this.chapterRoutes = [];
  }

  /**
   * 判断是否是章节路由
   */
  private isChapterRoute(path: string): boolean {
    return <boolean>(
      (this.chapterRoutes.includes(path) ||
        path.includes("/learn/") ||
        path.match(/\/step\/\w+\/[^/]+\/\d+\/\d+/)) // 支持中文课程ID
    );
  }

  /**
   * 从当前路由推断目录路由
   */
  private inferCatalogRoute(currentPath: string): string {
    // 匹配类似 /step/python/Python基础入门/1/1 的路径（支持中文课程ID）
    const match = currentPath.match(/^\/step\/([^/]+)\/([^/]+)/);
    if (match) {
      const [, language, courseId] = match;
      // 确保课程ID被正确编码
      const encodedCourseId = encodeURIComponent(decodeURIComponent(courseId));
      return `/step/${language}/${encodedCourseId}`;
    }

    // 默认返回根路径
    return "/";
  }

  /**
   * 清理浏览器历史中的章节路由
   * 这个方法会尝试替换历史记录，避免用户通过浏览器后退到章节内容
   */
  private cleanupBrowserHistory() {
    // 注意：由于浏览器安全限制，我们无法直接操作历史记录
    // 这里采用替换当前记录的方式来清理历史
    const catalogPath =
      this.catalogRoute ||
      this.inferCatalogRoute(this.router.currentRoute.value.fullPath);

    // 使用 replace 而不是 push，避免在历史中留下记录
    window.history.replaceState(null, "", catalogPath);
  }

  /**
   * 检查是否应该清理历史记录
   * 当从目录页进入章节，再点击后退时，应该直接返回目录而不是章节内容
   */
  shouldCleanupOnBack(): boolean {
    const currentPath = this.router.currentRoute.value.fullPath;
    return this.isChapterRoute(currentPath) && this.chapterRoutes.length <= 1;
  }

  /**
   * 重置导航管理器
   */
  reset() {
    this.chapterRoutes = [];
    this.catalogRoute = "";
  }

  /**
   * 获取当前章节路由数量
   */
  getChapterRoutesCount(): number {
    return this.chapterRoutes.length;
  }
}

/**
 * 创建导航管理器实例
 */
export function createNavigationManager(router: Router): NavigationManager {
  return new NavigationManager(router);
}

/**
 * 全局导航管理器实例
 */
let globalNavigationManager: NavigationManager | null = null;

/**
 * 初始化全局导航管理器
 */
export function initNavigationManager(router: Router): NavigationManager {
  globalNavigationManager = createNavigationManager(router);
  return globalNavigationManager;
}

/**
 * 获取全局导航管理器实例
 */
export function getNavigationManager(): NavigationManager {
  if (!globalNavigationManager) {
    throw new Error(
      "NavigationManager 未初始化，请先调用 initNavigationManager"
    );
  }
  return globalNavigationManager;
}

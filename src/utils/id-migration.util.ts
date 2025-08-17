// 课程ID迁移工具
// 用于处理从旧的英文ID迁移到新的中文ID

// ID映射表：旧ID -> 新ID
const ID_MIGRATION_MAP: Record<string, string> = {
  "python-basics": "Python基础入门",
  "javascript-basics": "JavaScript基础",
};

// 反向映射表：新ID -> 旧ID
const REVERSE_ID_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ID_MIGRATION_MAP).map(([oldId, newId]) => [newId, oldId])
);

/**
 * 将旧课程ID迁移为新的中文ID
 * @param oldId 旧的英文课程ID
 * @returns 新的中文课程ID，如果没有映射则返回原ID
 */
export function migrateToNewId(oldId: string): string {
  return ID_MIGRATION_MAP[oldId] || oldId;
}

/**
 * 将新的中文ID转换为旧的英文ID（用于兼容）
 * @param newId 新的中文课程ID
 * @returns 旧的英文课程ID，如果没有映射则返回原ID
 */
export function migrateToOldId(newId: string): string {
  return REVERSE_ID_MAP[newId] || newId;
}

/**
 * 迁移localStorage中的学习状态数据
 * 将所有旧的课程ID更新为新的中文ID
 */
export function migrateLearningStatusIds(): void {
  try {
    // 迁移学习状态
    const learningStatusKey = "learning-status";
    const statusData = localStorage.getItem(learningStatusKey);

    if (statusData) {
      const statusList = JSON.parse(statusData);
      let hasChanges = false;

      statusList.forEach((status: any) => {
        if (status.courseId && ID_MIGRATION_MAP[status.courseId]) {
          status.courseId = ID_MIGRATION_MAP[status.courseId];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem(learningStatusKey, JSON.stringify(statusList));
        console.log("学习状态ID已迁移到中文ID");
      }
    }

    // 迁移收藏数据
    const favoritesKey = "favorites";
    const favoritesData = localStorage.getItem(favoritesKey);

    if (favoritesData) {
      const favoritesList = JSON.parse(favoritesData);
      let hasChanges = false;

      favoritesList.forEach((favorite: any) => {
        if (favorite.courseId && ID_MIGRATION_MAP[favorite.courseId]) {
          favorite.courseId = ID_MIGRATION_MAP[favorite.courseId];
          hasChanges = true;
        }

        // 更新收藏项的ID（如果是课程收藏）
        if (
          favorite.type === "course" &&
          favorite.id &&
          favorite.id.startsWith("course-")
        ) {
          const courseId = favorite.id.replace("course-", "");
          if (ID_MIGRATION_MAP[courseId]) {
            favorite.id = `course-${ID_MIGRATION_MAP[courseId]}`;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        localStorage.setItem(favoritesKey, JSON.stringify(favoritesList));
        console.log("收藏数据ID已迁移到中文ID");
      }
    }
  } catch (error) {
    console.error("ID迁移失败:", error);
  }
}

/**
 * 检查是否需要迁移
 * 通过检查localStorage中是否还有旧的课程ID来判断
 */
export function needsMigration(): boolean {
  try {
    const learningStatusKey = "learning-status";
    const statusData = localStorage.getItem(learningStatusKey);

    if (statusData) {
      const statusList = JSON.parse(statusData);
      return statusList.some(
        (status: any) => status.courseId && ID_MIGRATION_MAP[status.courseId]
      );
    }

    return false;
  } catch (error) {
    console.error("检查迁移状态失败:", error);
    return false;
  }
}

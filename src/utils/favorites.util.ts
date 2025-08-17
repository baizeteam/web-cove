import type { LanguageType } from "@/data/courses";

// 收藏项目类型
export type FavoriteType = "course" | "article" | "step";

// 收藏项目接口
export interface FavoriteItem {
  id: string; // 唯一标识
  type: FavoriteType;
  title: string;
  language?: LanguageType;
  courseId?: string;
  chapterId?: number;
  stepId?: number;
  articleId?: string;
  timestamp: number; // 收藏时间
  lastAccessed?: number; // 最后访问时间
}

// 收藏统计接口
export interface FavoriteStats {
  totalFavorites: number;
  byType: Record<FavoriteType, number>;
  recentFavorites: FavoriteItem[];
}

const FAVORITES_KEY = "user_favorites";

// 获取所有收藏记录
export const getAllFavorites = (): FavoriteItem[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("获取收藏记录失败:", error);
    return [];
  }
};

// 保存收藏记录
export const saveFavorites = (favorites: FavoriteItem[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    // 触发自定义事件，通知其他组件数据已更新
    const event = new CustomEvent("favorites-updated", {
      detail: { favorites },
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error("保存收藏记录失败:", error);
  }
};

// 添加收藏
export const addToFavorites = (
  item: Omit<FavoriteItem, "timestamp">
): boolean => {
  const allFavorites = getAllFavorites();

  // 检查是否已经收藏
  const existingIndex = allFavorites.findIndex(fav => fav.id === item.id);
  if (existingIndex >= 0) {
    return false; // 已经收藏过了
  }

  const newFavorite: FavoriteItem = {
    ...item,
    timestamp: Date.now(),
  };

  allFavorites.unshift(newFavorite); // 添加到开头
  saveFavorites(allFavorites);
  return true;
};

// 移除收藏
export const removeFromFavorites = (id: string): boolean => {
  const allFavorites = getAllFavorites();
  const filteredFavorites = allFavorites.filter(fav => fav.id !== id);

  if (filteredFavorites.length === allFavorites.length) {
    return false; // 没有找到要删除的项目
  }

  saveFavorites(filteredFavorites);
  return true;
};

// 检查是否已收藏
export const isFavorited = (id: string): boolean => {
  const allFavorites = getAllFavorites();
  return allFavorites.some(fav => fav.id === id);
};

// 切换收藏状态
export const toggleFavorite = (
  item: Omit<FavoriteItem, "timestamp">
): boolean => {
  if (isFavorited(item.id)) {
    return !removeFromFavorites(item.id); // 返回false表示已取消收藏
  } else {
    return addToFavorites(item); // 返回true表示已添加收藏
  }
};

// 根据类型获取收藏
export const getFavoritesByType = (type: FavoriteType): FavoriteItem[] => {
  const allFavorites = getAllFavorites();
  return allFavorites.filter(fav => fav.type === type);
};

// 根据语言获取收藏的课程
export const getFavoritesByLanguage = (
  language: LanguageType
): FavoriteItem[] => {
  const allFavorites = getAllFavorites();
  return allFavorites.filter(fav => fav.language === language);
};

// 更新最后访问时间
export const updateLastAccessed = (id: string): void => {
  const allFavorites = getAllFavorites();
  const index = allFavorites.findIndex(fav => fav.id === id);

  if (index >= 0) {
    allFavorites[index].lastAccessed = Date.now();
    saveFavorites(allFavorites);
  }
};

// 获取收藏统计
export const getFavoriteStats = (): FavoriteStats => {
  const allFavorites = getAllFavorites();

  const byType: Record<string, number> = {
    course: 0,
    article: 0,
    step: 0,
  };

  allFavorites.forEach(fav => {
    byType[fav.type] = (byType[fav.type] || 0) + 1;
  });

  // 按时间排序，获取最近的收藏
  const recentFavorites = [...allFavorites]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return {
    totalFavorites: allFavorites.length,
    byType: byType as Record<FavoriteType, number>,
    recentFavorites,
  };
};

// 清除所有收藏
export const clearAllFavorites = (): void => {
  localStorage.removeItem(FAVORITES_KEY);

  // 触发更新事件
  const event = new CustomEvent("favorites-updated", {
    detail: { favorites: [] },
  });
  window.dispatchEvent(event);
};

// 清除指定类型的收藏
export const clearFavoritesByType = (type: FavoriteType): void => {
  const allFavorites = getAllFavorites();
  const filteredFavorites = allFavorites.filter(fav => fav.type !== type);
  saveFavorites(filteredFavorites);
};

// 格式化收藏时间
export const formatFavoriteTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const oneDay = 24 * 60 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  const oneMinute = 60 * 1000;

  if (diff < oneMinute) {
    return "刚刚";
  } else if (diff < oneHour) {
    const minutes = Math.floor(diff / oneMinute);
    return `${minutes}分钟前`;
  } else if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    return `${hours}小时前`;
  } else {
    const days = Math.floor(diff / oneDay);
    return `${days}天前`;
  }
};

// 搜索收藏
export const searchFavorites = (query: string): FavoriteItem[] => {
  const allFavorites = getAllFavorites();
  const lowerQuery = query.toLowerCase();

  return allFavorites.filter(fav =>
    fav.title.toLowerCase().includes(lowerQuery)
  );
};

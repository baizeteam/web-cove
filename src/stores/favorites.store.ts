import { defineStore } from "pinia";
import type { LanguageType } from "@/data/courses";

// 收藏项接口
export interface FavoriteItem {
  id: string; // 唯一标识符
  type: "course" | "article" | "step"; // 收藏类型
  title: string; // 标题
  addedAt: number; // 添加时间
  language?: LanguageType; // 编程语言（课程相关）
  courseId?: string; // 课程ID（课程和步骤相关）
  chapterId?: number; // 章节ID（步骤相关）
  stepId?: number; // 步骤ID（步骤相关）
  articleId?: string; // 文章ID（文章相关）
  description?: string; // 描述
  tags?: string[]; // 标签
}

interface FavoritesState {
  favorites: Record<string, FavoriteItem>;
}

export const useFavoritesStore = defineStore("favorites", {
  state: (): FavoritesState => ({
    favorites: {},
  }),

  getters: {
    // 检查是否已收藏
    isFavorited:
      state =>
      (id: string): boolean => {
        return !!state.favorites[id];
      },

    // 获取所有收藏
    getAllFavorites: (state): FavoriteItem[] => {
      return Object.values(state.favorites).sort(
        (a, b) => b.addedAt - a.addedAt
      );
    },

    // 按类型获取收藏
    getFavoritesByType:
      state =>
      (type: FavoriteItem["type"]): FavoriteItem[] => {
        return Object.values(state.favorites)
          .filter(item => item.type === type)
          .sort((a, b) => b.addedAt - a.addedAt);
      },

    // 按语言获取课程收藏
    getFavoritesByLanguage:
      state =>
      (language: LanguageType): FavoriteItem[] => {
        return Object.values(state.favorites)
          .filter(item => item.language === language)
          .sort((a, b) => b.addedAt - a.addedAt);
      },

    // 获取收藏数量
    getFavoritesCount: (state): number => {
      return Object.keys(state.favorites).length;
    },

    // 按类型获取收藏数量
    getFavoritesCountByType:
      state =>
      (type: FavoriteItem["type"]): number => {
        return Object.values(state.favorites).filter(item => item.type === type)
          .length;
      },
  },

  actions: {
    // 添加收藏
    addFavorite(item: Omit<FavoriteItem, "addedAt">) {
      this.favorites[item.id] = {
        ...item,
        addedAt: Date.now(),
      };
      console.log(`已添加收藏: ${item.title}`);
    },

    // 移除收藏
    removeFavorite(id: string) {
      const item = this.favorites[id];
      if (item) {
        delete this.favorites[id];
        console.log(`已移除收藏: ${item.title}`);
      }
    },

    // 切换收藏状态
    toggleFavorite(item: Omit<FavoriteItem, "addedAt">) {
      if (this.isFavorited(item.id)) {
        this.removeFavorite(item.id);
      } else {
        this.addFavorite(item);
      }
    },

    // 清空所有收藏
    clearAllFavorites() {
      this.favorites = {};
      console.log("已清空所有收藏");
    },

    // 清空指定类型的收藏
    clearFavoritesByType(type: FavoriteItem["type"]) {
      const toDelete = Object.keys(this.favorites).filter(
        id => this.favorites[id].type === type
      );

      toDelete.forEach(id => {
        delete this.favorites[id];
      });

      console.log(`已清空 ${type} 类型的收藏`);
    },

    // 从localStorage迁移数据（仅在初始化时调用一次）
    migrateFromLocalStorage() {
      try {
        // 检查是否已经迁移过
        const migrated = localStorage.getItem("favorites-migrated");
        if (migrated) return;

        console.log("开始迁移localStorage收藏数据到Pinia...");

        // 迁移收藏数据
        const favoritesData = localStorage.getItem("favorites");
        if (favoritesData) {
          const oldFavorites = JSON.parse(favoritesData);

          // 如果是数组格式（旧格式），转换为新格式
          if (Array.isArray(oldFavorites)) {
            oldFavorites.forEach((item: any) => {
              this.favorites[item.id] = {
                ...item,
                addedAt: item.addedAt || Date.now(),
              };
            });
          } else if (typeof oldFavorites === "object") {
            // 如果已经是对象格式，直接使用
            this.favorites = oldFavorites;
          }

          console.log("迁移收藏数据完成");
        }

        // 标记迁移完成
        localStorage.setItem("favorites-migrated", "true");
        console.log("收藏数据迁移完成");
      } catch (error) {
        console.error("迁移收藏数据失败:", error);
      }
    },
  },

  persist: {
    key: "favorites-store",
    storage: localStorage,
    paths: ["favorites"],
  },
});

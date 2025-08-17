import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCoursesStore } from "./courses.store";
import type { Course, LanguageType } from "@/data/courses";

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
  resultCount: number;
}

export interface HotSearch {
  id: string;
  query: string;
  count: number;
  trend: "up" | "down" | "stable";
}

export const useSearchStore = defineStore("search", () => {
  const coursesStore = useCoursesStore();

  // 状态
  const currentQuery = ref("");
  const searchHistory = ref<SearchHistory[]>([]);
  const hotSearches = ref<HotSearch[]>([
    { id: "1", query: "Python入门", count: 1234, trend: "up" },
    { id: "2", query: "JavaScript", count: 987, trend: "up" },
    { id: "3", query: "HTML基础", count: 756, trend: "stable" },
    { id: "4", query: "前端开发", count: 645, trend: "down" },
    { id: "5", query: "Vue教程", count: 543, trend: "up" },
    { id: "6", query: "React入门", count: 432, trend: "stable" },
    { id: "7", query: "数据结构", count: 321, trend: "up" },
    { id: "8", query: "算法学习", count: 234, trend: "stable" },
  ]);
  const isSearching = ref(false);
  const searchResults = ref<Course[]>([]);

  // 计算属性
  const recentSearchHistory = computed(() => {
    return searchHistory.value
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  });

  const trendingSearches = computed(() => {
    return hotSearches.value
      .filter(item => item.trend === "up")
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  // Actions
  const setCurrentQuery = (query: string) => {
    currentQuery.value = query;
  };

  const addToSearchHistory = (query: string, resultCount: number) => {
    const existingIndex = searchHistory.value.findIndex(
      item => item.query === query
    );

    if (existingIndex >= 0) {
      // 更新已存在的搜索记录
      searchHistory.value[existingIndex] = {
        ...searchHistory.value[existingIndex],
        timestamp: Date.now(),
        resultCount,
      };
    } else {
      // 添加新的搜索记录
      const newHistory: SearchHistory = {
        id: Date.now().toString(),
        query,
        timestamp: Date.now(),
        resultCount,
      };
      searchHistory.value.unshift(newHistory);
    }

    // 限制历史记录数量
    if (searchHistory.value.length > 50) {
      searchHistory.value = searchHistory.value.slice(0, 50);
    }

    // 保存到本地存储
    saveSearchHistory();
  };

  const removeFromHistory = (historyId: string) => {
    const index = searchHistory.value.findIndex(item => item.id === historyId);
    if (index >= 0) {
      searchHistory.value.splice(index, 1);
      saveSearchHistory();
    }
  };

  const clearSearchHistory = () => {
    searchHistory.value = [];
    saveSearchHistory();
  };

  const performSearch = async (query: string, language?: LanguageType) => {
    if (!query.trim()) return;

    isSearching.value = true;
    setCurrentQuery(query);

    try {
      // 使用 coursesStore 的搜索功能
      searchResults.value = await coursesStore.searchCourses(query, language);

      // 添加到搜索历史
      addToSearchHistory(query, searchResults.value.length);
    } catch (error) {
      console.error("搜索失败:", error);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const searchByHotKeyword = async (
    hotSearch: HotSearch,
    language?: LanguageType
  ) => {
    await performSearch(hotSearch.query, language);

    // 增加热搜点击次数
    const index = hotSearches.value.findIndex(item => item.id === hotSearch.id);
    if (index >= 0) {
      hotSearches.value[index].count += 1;
    }
  };

  // 本地存储相关
  const SEARCH_HISTORY_KEY = "search_history";

  const saveSearchHistory = () => {
    try {
      localStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(searchHistory.value)
      );
    } catch (error) {
      console.error("保存搜索历史失败:", error);
    }
  };

  const loadSearchHistory = () => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        searchHistory.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error("加载搜索历史失败:", error);
      searchHistory.value = [];
    }
  };

  // 搜索建议 - 智能模糊匹配
  const getSearchSuggestions = (query: string): string[] => {
    if (!query.trim()) return [];

    const suggestions: { text: string; score: number }[] = [];
    const lowerQuery = query.toLowerCase();

    // 计算匹配分数
    const calculateScore = (text: string, query: string): number => {
      const lowerText = text.toLowerCase();
      let score = 0;

      // 完全匹配得分最高
      if (lowerText === query) return 100;

      // 开头匹配
      if (lowerText.startsWith(query)) score += 80;

      // 包含完整查询词
      if (lowerText.includes(query)) score += 60;

      // 模糊匹配 - 检查每个字符
      let queryIndex = 0;
      for (let i = 0; i < lowerText.length && queryIndex < query.length; i++) {
        if (lowerText[i] === query[queryIndex]) {
          queryIndex++;
          score += 5;
        }
      }

      // 如果能匹配所有字符，额外加分
      if (queryIndex === query.length) score += 20;

      return score;
    };

    // 从课程标题中获取建议
    coursesStore.courses.forEach(course => {
      const titleScore = calculateScore(course.title, lowerQuery);
      if (titleScore > 20) {
        suggestions.push({ text: course.title, score: titleScore + 10 }); // 标题优先级更高
      }
    });

    // 从课程标签中获取建议
    const addedTags = new Set<string>();
    coursesStore.courses.forEach(course => {
      course.tags.forEach(tag => {
        if (!addedTags.has(tag)) {
          const tagScore = calculateScore(tag, lowerQuery);
          if (tagScore > 15) {
            suggestions.push({ text: tag, score: tagScore });
            addedTags.add(tag);
          }
        }
      });
    });

    // 从搜索历史中获取建议
    searchHistory.value.forEach(history => {
      const historyScore = calculateScore(history.query, lowerQuery);
      if (historyScore > 25) {
        suggestions.push({ text: history.query, score: historyScore + 5 }); // 历史记录有加分
      }
    });

    // 添加一些常用编程术语的智能建议
    const commonTerms = [
      "Python基础",
      "JavaScript入门",
      "HTML教程",
      "CSS样式",
      "Vue框架",
      "React开发",
      "前端开发",
      "后端开发",
      "数据结构",
      "算法学习",
      "Web开发",
      "移动开发",
      "数据库",
      "API接口",
      "项目实战",
    ];

    commonTerms.forEach(term => {
      const termScore = calculateScore(term, lowerQuery);
      if (termScore > 15) {
        suggestions.push({ text: term, score: termScore });
      }
    });

    // 按分数排序并去重
    const uniqueSuggestions = new Map<string, number>();
    suggestions.forEach(({ text, score }) => {
      if (
        !uniqueSuggestions.has(text) ||
        uniqueSuggestions.get(text)! < score
      ) {
        uniqueSuggestions.set(text, score);
      }
    });

    return Array.from(uniqueSuggestions.entries())
      .sort((a, b) => b[1] - a[1]) // 按分数降序排序
      .slice(0, 5) // 返回前5个
      .map(([text]) => text);
  };

  // 清除搜索结果
  const clearSearchResults = () => {
    searchResults.value = [];
    setCurrentQuery("");
  };

  return {
    // 状态
    currentQuery,
    searchHistory,
    hotSearches,
    isSearching,
    searchResults,

    // 计算属性
    recentSearchHistory,
    trendingSearches,

    // 方法
    setCurrentQuery,
    addToSearchHistory,
    removeFromHistory,
    clearSearchHistory,
    performSearch,
    searchByHotKeyword,
    loadSearchHistory,
    getSearchSuggestions,
    clearSearchResults,
  };
});

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { coursesData, type Course, type LanguageType } from "@/data/courses";

export const useCoursesStore = defineStore("courses", () => {
  // 状态 - 只管理原始数据，不做筛选
  const courses = ref<Course[]>(coursesData); // 所有课程数据
  const isLoading = ref(false); // 加载状态

  // 按语言分组的课程统计
  const coursesByLanguage = computed(() => {
    const stats: Record<LanguageType, number> = {
      python: 0,
      javascript: 0,
      html: 0,
      java: 0,
      css: 0,
    };

    courses.value.forEach(course => {
      stats[course.type] = (stats[course.type] || 0) + 1;
    });

    return stats;
  });

  // 获取语言的可读文本
  const getLanguageText = (language: LanguageType): string => {
    const languageMap: Record<LanguageType, string> = {
      python: "Python",
      javascript: "JavaScript",
      html: "HTML & CSS",
      java: "Java",
      css: "CSS",
    };
    return languageMap[language] || language;
  };

  // 获取难度的可读文本
  const getDifficultyText = (difficulty: string): string => {
    const difficultyMap: Record<string, string> = {
      beginner: "初级",
      intermediate: "中级",
      advanced: "高级",
    };
    return difficultyMap[difficulty] || difficulty;
  };

  // 根据ID获取课程
  const getCourseById = (courseId: string): Course | undefined => {
    return courses.value.find(course => course.id === courseId);
  };

  // 根据语言和ID获取课程
  const getCourseByLanguageAndId = (
    language: LanguageType,
    courseId: string
  ): Course | undefined => {
    return courses.value.find(
      course => course.type === language && course.id === courseId
    );
  };

  // 筛选方法 - 提供给组件使用的筛选工具
  const filterCourses = (options: {
    language?: LanguageType;
    searchQuery?: string;
    tags?: string[];
    difficulty?: string;
  }) => {
    let result = courses.value;

    // 按语言筛选
    if (options.language) {
      result = result.filter(course => course.type === options.language);
    }

    // 按搜索关键词筛选
    if (options.searchQuery?.trim()) {
      const query = options.searchQuery.toLowerCase();
      result = result.filter(
        course =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 按标签筛选
    if (options.tags && options.tags.length > 0) {
      result = result.filter(course =>
        options.tags!.some(tag => course.tags.includes(tag))
      );
    }

    // 按难度筛选
    if (options.difficulty) {
      result = result.filter(
        course => course.difficulty === options.difficulty
      );
    }

    return result;
  };

  // 模拟从服务端加载课程数据
  const fetchCourses = async (language?: LanguageType) => {
    isLoading.value = true;
    try {
      // 这里以后可以替换为真实的API调用
      // const response = await api.getCourses({ language })
      // courses.value = response.data

      // 目前使用静态数据
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟网络延迟
      courses.value = coursesData.filter(
        course => !language || course.type === language
      );
    } catch (error) {
      console.error("获取课程数据失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 刷新课程数据
  const refreshCourses = async () => {
    await fetchCourses();
  };

  // 搜索课程 - 返回结果而不修改全局状态
  const searchCourses = async (query: string, language?: LanguageType) => {
    // 这里以后可以调用搜索API
    // const response = await api.searchCourses({ query, language })
    // return response.data

    // 目前使用本地筛选
    return filterCourses({ searchQuery: query, language });
  };

  return {
    // 状态
    courses,
    isLoading,

    // 计算属性
    coursesByLanguage,

    // 方法
    getLanguageText,
    getDifficultyText,
    getCourseById,
    getCourseByLanguageAndId,
    filterCourses,
    fetchCourses,
    refreshCourses,
    searchCourses,
  };
});

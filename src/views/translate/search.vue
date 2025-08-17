<template>
  <ViewLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
      <div class="search-header">
        <van-search
          id="van-search"
          v-model="searchValue"
          placeholder="搜索课程、技术、知识点..."
          autofocus
          :background="layoutStore.header.backgroundColor"
          show-action
          right-icon=""
          @input="onSearchInput"
          @search="onSearch"
          @focus="showSuggestions = true"
        >
          <template #action>
            <div @click="onSearch">搜索</div>
          </template>
        </van-search>
      </div>
    </template>

    <div class="search-content">
      <!-- 搜索建议 -->
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="suggestions-container"
      >
        <div class="suggestions-title">搜索建议</div>
        <div
          v-for="suggestion in suggestions.slice(0, 5)"
          :key="suggestion"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          <van-icon name="search" size="16" color="#999" />
          <span class="suggestion-text">{{ suggestion }}</span>
          <van-icon name="arrow-up" size="14" color="#ccc" />
        </div>
      </div>

      <!-- 搜索历史和热门搜索 -->
      <div
        v-if="!searchValue.trim() && !searchStore.isSearching"
        class="search-home"
      >
        <!-- 搜索历史 -->
        <div
          v-if="searchStore.recentSearchHistory.length > 0"
          class="history-section"
        >
          <div class="section-header">
            <h3 class="section-title">最近搜索</h3>
            <van-button type="default" size="mini" @click="clearHistory">
              清除
            </van-button>
          </div>
          <div class="history-tags">
            <van-tag
              v-for="history in searchStore.recentSearchHistory"
              :key="history.id"
              size="medium"
              class="history-tag"
              @click="selectHistory(history.query)"
            >
              {{ history.query }}
            </van-tag>
          </div>
        </div>

        <!-- 热门搜索 -->
        <div class="hot-search-section">
          <h3 class="section-title">热门搜索</h3>
          <div class="hot-search-list">
            <div
              v-for="(hotSearch, index) in searchStore.hotSearches"
              :key="hotSearch.id"
              class="hot-search-item"
              @click="selectHotSearch(hotSearch)"
            >
              <span
                class="hot-rank"
                :class="{
                  'rank-top': index < 3,
                  'rank-rising': hotSearch.trend === 'up',
                }"
              >
                {{ index + 1 }}
              </span>
              <span class="hot-text">{{ hotSearch.query }}</span>
              <span class="hot-count">{{ formatCount(hotSearch.count) }}</span>
              <van-icon
                v-if="hotSearch.trend === 'up'"
                name="arrow-up"
                size="12"
                color="#f56c6c"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="hasSearched" class="search-results">
        <!-- 搜索结果头部 -->
        <div class="results-header">
          <span class="results-count">
            找到 {{ searchStore.searchResults.length }} 个结果
          </span>
          <div class="results-filters">
            <van-button
              v-for="lang in availableLanguages"
              :key="lang.type"
              :type="selectedLanguage === lang.type ? 'primary' : 'default'"
              size="mini"
              @click="filterByLanguage(lang.type)"
            >
              {{ lang.title }}
            </van-button>
            <van-button
              :type="selectedLanguage === 'all' ? 'primary' : 'default'"
              size="mini"
              @click="filterByLanguage('all')"
            >
              全部
            </van-button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="searchStore.isSearching" class="loading-container">
          <van-loading type="spinner" color="#1989fa">搜索中...</van-loading>
        </div>

        <!-- 课程结果列表 -->
        <div v-else-if="filteredResults.length > 0" class="course-results">
          <div
            v-for="course in filteredResults"
            :key="course.id"
            class="course-result-item"
            @click="goToCourse(course)"
          >
            <div class="course-header">
              <img :src="course.icon" :alt="course.title" class="course-icon" />
              <div class="course-info">
                <h4
                  class="course-title"
                  v-html="highlightKeyword(course.title)"
                ></h4>
                <p
                  class="course-description"
                  v-html="highlightKeyword(course.description)"
                ></p>
                <div class="course-meta">
                  <span class="course-language">{{
                    coursesStore.getLanguageText(course.type)
                  }}</span>
                  <span class="course-difficulty">{{
                    coursesStore.getDifficultyText(course.difficulty)
                  }}</span>
                  <span class="course-steps">{{ course.totalSteps }} 步骤</span>
                </div>
              </div>
              <van-icon
                :name="
                  checkIsFavorited(`course-${course.id}`) ? 'star' : 'star-o'
                "
                :color="
                  checkIsFavorited(`course-${course.id}`) ? '#ffd700' : '#ccc'
                "
                size="20"
                class="favorite-icon"
                @click.stop="toggleCourseFavorite(course)"
              />
            </div>
            <div class="course-footer">
              <van-button
                v-if="!checkIsEnrolled(course.id)"
                type="primary"
                size="small"
                @click.stop="handleEnrollCourse(course.id, course.type)"
              >
                加入学习
              </van-button>
              <div v-else class="enrolled-status">
                <van-icon name="success" color="#07c160" />
                <span>已加入</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果 -->
        <div v-else class="no-results">
          <van-empty description="未找到相关课程">
            <van-button type="primary" size="small" @click="clearSearch">
              换个关键词试试
            </van-button>
          </van-empty>
        </div>
      </div>
    </div>
  </ViewLayout>
</template>
<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import { useRoute, useRouter } from "vue-router";
import { useLayoutStore } from "@/stores/layout.store.ts";
import { useSearchStore } from "@/stores/search.store";
import { useCoursesStore } from "@/stores/courses.store";
import { onMounted, ref, computed } from "vue";
import { isFavorited, toggleFavorite } from "@/utils/favorites.util";
import { isEnrolled, enrollCourse } from "@/utils/learning.util";
import type { Course, LanguageType } from "@/data/courses";

const searchValue = ref("");
const showSuggestions = ref(false);
const suggestions = ref<string[]>([]);
const hasSearched = ref(false);
const selectedLanguage = ref<LanguageType | "all">("all");
const favoritesUpdate = ref(0);

const layoutStore = useLayoutStore();
const searchStore = useSearchStore();
const coursesStore = useCoursesStore();
const router = useRouter();

const {
  meta: { title },
} = useRoute();

// 可用语言列表
const availableLanguages = [
  { type: "python" as LanguageType, title: "Python" },
  { type: "javascript" as LanguageType, title: "JavaScript" },
  { type: "html" as LanguageType, title: "HTML & CSS" },
];

// 筛选后的搜索结果
const filteredResults = computed(() => {
  if (selectedLanguage.value === "all") {
    return searchStore.searchResults;
  }
  return searchStore.searchResults.filter(
    course => course.type === selectedLanguage.value
  );
});

// 搜索输入处理
const onSearchInput = () => {
  if (searchValue.value.trim()) {
    // 获取搜索建议
    suggestions.value = searchStore.getSearchSuggestions(searchValue.value);
    showSuggestions.value = true;
  } else {
    suggestions.value = [];
    showSuggestions.value = false;
  }
};

// 执行搜索
const onSearch = async () => {
  if (!searchValue.value.trim()) return;

  showSuggestions.value = false;
  hasSearched.value = true;

  await searchStore.performSearch(searchValue.value);
};

// 选择搜索建议
const selectSuggestion = (suggestion: string) => {
  searchValue.value = suggestion;
  showSuggestions.value = false;
  onSearch();
};

// 选择搜索历史
const selectHistory = (query: string) => {
  searchValue.value = query;
  onSearch();
};

// 选择热门搜索
const selectHotSearch = async (hotSearch: any) => {
  searchValue.value = hotSearch.query;
  await searchStore.searchByHotKeyword(hotSearch);
  hasSearched.value = true;
};

// 清除搜索历史
const clearHistory = () => {
  searchStore.clearSearchHistory();
};

// 按语言筛选
const filterByLanguage = (language: LanguageType | "all") => {
  selectedLanguage.value = language;
};

// 清除搜索
const clearSearch = () => {
  searchValue.value = "";
  hasSearched.value = false;
  showSuggestions.value = false;
  searchStore.clearSearchResults();
};

// 高亮关键词
const highlightKeyword = (text: string): string => {
  if (!searchValue.value.trim()) return text;

  const keyword = searchValue.value.trim();
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, '<mark class="highlight">$1</mark>');
};

// 格式化数量
const formatCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }
  return count.toString();
};

// 跳转到课程
const goToCourse = (course: Course) => {
  router.push(`/step/${course.type}/${course.id}`);
};

// 检查收藏状态 - 响应式版本
const checkIsFavorited = (id: string): boolean => {
  console.log(favoritesUpdate.value); // 触发响应式更新
  return isFavorited(id);
};

// 切换收藏状态
const toggleCourseFavorite = (course: Course) => {
  toggleFavorite({
    id: `course-${course.id}`,
    type: "course",
    title: course.title,
    description: course.description,
    language: course.type,
    courseId: course.id,
  });
  favoritesUpdate.value++;
};

// 检查是否已加入学习
const checkIsEnrolled = (courseId: string): boolean => {
  return isEnrolled(courseId);
};

// 加入学习处理
const handleEnrollCourse = (courseId: string, language: LanguageType) => {
  enrollCourse(courseId, language);
};

// 监听收藏更新事件
onMounted(() => {
  // 加载搜索历史
  searchStore.loadSearchHistory();

  // 监听收藏更新
  window.addEventListener("favorites-updated", () => {
    favoritesUpdate.value++;
  });

  // 监听点击外部隐藏建议
  document.addEventListener("click", e => {
    const target = e.target as HTMLElement;
    if (
      !target.closest(".search-header") &&
      !target.closest(".suggestions-container")
    ) {
      showSuggestions.value = false;
    }
  });

  // 聚焦搜索框
  setTimeout(() => {
    const searchInput = document.getElementById("van-search");
    if (searchInput) {
      searchInput.focus();
    }
  }, 100);
});
</script>

<style scoped>
.search-content {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: calc(100vh - 140px);
}

/* 搜索建议 */
.suggestions-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

.suggestions-title {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  background: #f8fafc;
  border-bottom: 1px solid #eee;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.suggestion-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-text {
  flex: 1;
  margin-left: 12px;
  font-size: 16px;
  color: #333;
}

/* 搜索首页 */
.search-home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 搜索历史 */
.history-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.history-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 热门搜索 */
.hot-search-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.hot-search-list {
  display: grid;
  gap: 12px;
}

.hot-search-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.hot-search-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.hot-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  background: #f0f0f0;
  color: #666;
}

.hot-rank.rank-top {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
}

.hot-rank.rank-rising {
  border: 2px solid #f56c6c;
  color: #f56c6c;
  background: white;
}

.hot-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.hot-count {
  font-size: 12px;
  color: #999;
  margin-right: 8px;
}

/* 搜索结果 */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.results-count {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.results-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

/* 课程结果列表 */
.course-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-result-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.course-result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

.course-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.course-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.course-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.course-language,
.course-difficulty,
.course-steps {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.course-language {
  background: #e6f7ff;
  color: #1890ff;
}

.course-difficulty {
  background: #f6ffed;
  color: #52c41a;
}

.course-steps {
  background: #f5f5f5;
  color: #666;
}

.favorite-icon {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 12px;
}

.favorite-icon:hover {
  transform: scale(1.2);
}

.course-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.enrolled-status {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #07c160;
  font-size: 14px;
}

/* 无结果 */
.no-results {
  background: white;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
}

/* 关键词高亮 */
:deep(.highlight) {
  background: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-content {
    padding: 12px;
  }

  .results-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .results-filters {
    width: 100%;
    justify-content: space-between;
  }

  .course-header {
    flex-direction: column;
  }

  .course-icon {
    align-self: center;
  }

  .course-meta {
    justify-content: center;
  }

  .hot-search-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .hot-rank {
    margin: 0;
  }
}
</style>

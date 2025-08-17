<template>
  <ViewLayout :footer="false">
    <template #header>
      <ViewHeader :header-config="{ title: '我的收藏' }" />
    </template>

    <div class="favorites-container">
      <div class="header">
        <h2 class="title">我的收藏</h2>
        <div class="stats">总计 {{ favoriteStats.totalFavorites }} 项收藏</div>
      </div>

      <!-- 搜索框 -->
      <div class="search-section">
        <van-search
          v-model="searchQuery"
          placeholder="搜索收藏内容"
          background="#f8fafc"
          @input="handleSearch"
        />
      </div>

      <!-- 类型筛选 -->
      <div class="type-filter">
        <van-button
          :type="selectedType === 'all' ? 'primary' : 'default'"
          size="small"
          @click="selectedType = 'all'"
        >
          全部 ({{ favoriteStats.totalFavorites }})
        </van-button>
        <van-button
          v-for="(count, type) in favoriteStats.byType"
          :key="type"
          :type="selectedType === type ? 'primary' : 'default'"
          size="small"
          @click="selectedType = type as FavoriteType"
        >
          {{ getTypeText(type as FavoriteType) }} ({{ count }})
        </van-button>
      </div>

      <!-- 收藏列表 -->
      <div v-if="filteredFavorites.length === 0" class="empty-state">
        <van-empty description="暂无收藏内容">
          <van-button type="primary" size="small" @click="goToRecommend">
            去发现课程
          </van-button>
        </van-empty>
      </div>

      <div v-else class="favorites-list">
        <div
          v-for="favorite in filteredFavorites"
          :key="favorite.id"
          class="favorite-item"
          @click="goToFavorite(favorite)"
        >
          <div class="favorite-header">
            <div class="type-tag" :class="`type-${favorite.type}`">
              {{ getTypeText(favorite.type) }}
            </div>
            <div class="favorite-time">
              {{ formatFavoriteTime(favorite.timestamp) }}
            </div>
          </div>

          <div class="favorite-content">
            <h4 class="favorite-title">{{ favorite.title }}</h4>

            <!-- 课程相关信息 -->
            <div
              v-if="favorite.type === 'course' && favorite.language"
              class="course-info"
            >
              <span class="language-tag">{{
                getLanguageText(favorite.language)
              }}</span>
            </div>

            <!-- 步骤相关信息 -->
            <div v-if="favorite.type === 'step'" class="step-info">
              <span class="step-location">
                第{{ favorite.chapterId }}章 · 步骤{{ favorite.stepId }}
              </span>
              <span v-if="favorite.language" class="language-tag">
                {{ getLanguageText(favorite.language) }}
              </span>
            </div>
          </div>

          <div class="favorite-actions">
            <van-button
              type="danger"
              size="mini"
              @click.stop="removeFavorite(favorite)"
            >
              取消收藏
            </van-button>
          </div>
        </div>
      </div>

      <!-- 清除按钮 -->
      <div v-if="filteredFavorites.length > 0" class="actions">
        <van-button type="warning" size="large" @click="clearFavorites">
          清除{{
            selectedType === "all" ? "全部" : getTypeText(selectedType)
          }}收藏
        </van-button>
      </div>
    </div>
  </ViewLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import {
  getAllFavorites,
  getFavoriteStats,
  removeFromFavorites,
  clearAllFavorites,
  clearFavoritesByType,
  formatFavoriteTime,
  updateLastAccessed,
} from "@/utils/favorites.util";
import type {
  FavoriteItem,
  FavoriteStats,
  FavoriteType,
} from "@/utils/favorites.util";
import type { LanguageType } from "@/data/courses";

const router = useRouter();

// 响应式数据
const favorites = ref<FavoriteItem[]>([]);
const favoriteStats = ref<FavoriteStats>({
  totalFavorites: 0,
  byType: {} as Record<FavoriteType, number>,
  recentFavorites: [],
});
const selectedType = ref<FavoriteType | "all">("all");
const searchQuery = ref("");

// 计算属性
const filteredFavorites = computed(() => {
  let result = favorites.value;

  // 按类型筛选
  if (selectedType.value !== "all") {
    result = result.filter(fav => fav.type === selectedType.value);
  }

  // 按搜索关键字筛选
  if (searchQuery.value.trim()) {
    const lowerQuery = searchQuery.value.toLowerCase();
    result = result.filter(fav => fav.title.toLowerCase().includes(lowerQuery));
  }

  return result;
});

// 方法
const loadFavorites = () => {
  favorites.value = getAllFavorites();
  favoriteStats.value = getFavoriteStats();
};

const getTypeText = (type: FavoriteType): string => {
  const typeMap = {
    course: "课程",
    article: "文章",
    step: "步骤",
  };
  return typeMap[type] || type;
};

const getLanguageText = (language: LanguageType): string => {
  const languageMap = {
    python: "Python",
    javascript: "JavaScript",
    html: "HTML & CSS",
    css: "CSS",
    java: "Java",
  };
  return languageMap[language] || language;
};

const goToFavorite = (favorite: FavoriteItem) => {
  // 更新最后访问时间
  updateLastAccessed(favorite.id);

  // 根据类型跳转到相应页面
  switch (favorite.type) {
    case "course":
      if (favorite.courseId && favorite.language) {
        router.push(`/step/${favorite.language}/${favorite.courseId}`);
      }
      break;
    case "step":
      if (
        favorite.courseId &&
        favorite.language &&
        favorite.chapterId &&
        favorite.stepId
      ) {
        router.push(
          `/step/${favorite.language}/${favorite.courseId}/${favorite.chapterId}/${favorite.stepId}`
        );
      }
      break;
    case "article":
      if (favorite.articleId) {
        router.push(`/article/detail/${favorite.articleId}`);
      }
      break;
  }
};

const removeFavorite = (favorite: FavoriteItem) => {
  removeFromFavorites(favorite.id);
  loadFavorites(); // 重新加载数据
};

const clearFavorites = () => {
  if (selectedType.value === "all") {
    clearAllFavorites();
  } else {
    clearFavoritesByType(selectedType.value);
  }
  loadFavorites(); // 重新加载数据
};

const handleSearch = () => {
  // 搜索在计算属性中处理，这里不需要额外逻辑
};

const goToRecommend = () => {
  router.push("/recommend");
};

// 生命周期
onMounted(() => {
  loadFavorites();
});

// 监听收藏更新事件
window.addEventListener("favorites-updated", () => {
  loadFavorites();
});
</script>

<style scoped>
.favorites-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: calc(100vh - 120px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.stats {
  font-size: 14px;
  color: #718096;
  background: white;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 16px;
}

.type-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #3182ce;
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.type-course {
  background: #bee3f8;
  color: #2b6cb0;
}

.type-article {
  background: #c6f6d5;
  color: #2f855a;
}

.type-step {
  background: #fed7d7;
  color: #c53030;
}

.favorite-time {
  font-size: 12px;
  color: #a0aec0;
}

.favorite-content {
  margin-bottom: 16px;
}

.favorite-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.course-info,
.step-info {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}

.language-tag {
  background: #e6fffa;
  color: #319795;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.step-location {
  font-size: 12px;
  color: #718096;
  background: #f7fafc;
  padding: 4px 8px;
  border-radius: 8px;
}

.favorite-actions {
  display: flex;
  justify-content: flex-end;
}

.actions {
  margin-top: 32px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .favorites-container {
    padding: 12px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .type-filter {
    gap: 6px;
  }

  .favorite-item {
    padding: 16px;
  }

  .course-info,
  .step-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>

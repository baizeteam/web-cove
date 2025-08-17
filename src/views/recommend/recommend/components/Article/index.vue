<template>
  <div class="column-knowledge course-card" style="margin-bottom: 16px">
    <div class="section-header">
      <h2 class="section-title">专栏知识</h2>
      <div class="more" @click="handleViewMore">
        查看更多 <van-icon name="arrow" />
      </div>
    </div>

    <div class="article-list">
      <div class="list">
        <div
          v-for="article in articleList"
          :key="article.id"
          class="item justify-between"
          :title="article.title"
          :label="article.author + ' · ' + article.date"
          :is-link="true"
          @click="handleArticleClick(article.id)"
        >
          <div class="left flex-column justify-between">
            <div class="top">
              {{ article.title }}
              <van-icon
                :name="
                  checkIsFavorited(`article-${article.id}`) ? 'star' : 'star-o'
                "
                :color="
                  checkIsFavorited(`article-${article.id}`) ? '#ffd700' : '#ccc'
                "
                size="16"
                class="article-favorite-icon"
                @click.stop="toggleArticleFavorite(article)"
              />
            </div>
            <div class="bottom align-center justify-between">
              <div class="tags">
                <span v-for="tag in article.tags" :key="tag.id" class="tag">
                  {{ tag.title }}
                </span>
              </div>
              <div class="date">
                {{ article.date }}
              </div>
            </div>
          </div>
          <div class="right global-image"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits, onMounted } from "vue";
import { isFavorited, toggleFavorite } from "@/utils/favorites.util";

// 定义文章数据类型
interface ArticleItem {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  tags: Tag[];
}

interface Tag {
  id: string;
  title: string;
}

// 定义props和emits类型
const emit = defineEmits<{
  (e: "viewMore"): void;
}>();

const favoritesUpdate = ref(0); // 用于强制更新收藏状态的响应式变量

const articleList = ref<ArticleItem[]>([
  {
    id: 1,
    title: "如何成为全栈工程师",
    author: "技术总监",
    date: "2025-07-10",
    content: "本文详细介绍了从前端到后端的学习路径...",
    tags: [
      { id: "a", title: "全栈" },
      { id: "b", title: "Python" },
    ],
  },
  {
    id: 2,
    title: "AI时代的编程技能",
    author: "AI研究员",
    date: "2025-07-05",
    content: "探讨了大语言模型对编程行业的影响...",
    tags: [{ id: "a", title: "全栈" }],
  },
  {
    id: 3,
    title: "微服务架构实战",
    author: "资深架构师",
    date: "2025-06-28",
    content: "微服务拆分原则与实践案例分析...",
    tags: [{ id: "a", title: "全栈" }],
  },
]);

const handleViewMore = () => {
  emit("viewMore");
};

const handleArticleClick = (id: number) => {
  // 实际项目中可跳转到文章详情页
  console.log(`查看文章: ${id}`);
};

// 检查收藏状态 - 响应式版本
const checkIsFavorited = (id: string): boolean => {
  // 触发响应式更新
  console.log("文章收藏检查:", id, favoritesUpdate.value);
  return isFavorited(id);
};

// 切换文章收藏状态
const toggleArticleFavorite = (article: ArticleItem) => {
  toggleFavorite({
    id: `article-${article.id}`,
    type: "article",
    title: article.title,
    articleId: String(article.id),
  });
  // 强制更新收藏状态
  favoritesUpdate.value++;
  console.log("文章收藏状态更新:", favoritesUpdate.value);
};

// 监听收藏更新事件
onMounted(() => {
  window.addEventListener("favorites-updated", () => {
    favoritesUpdate.value++;
  });
});
</script>

<style scoped>
.list {
  .item {
    margin-bottom: 25px;
    .left {
      .top {
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .article-favorite-icon {
        cursor: pointer;
        transition: all 0.3s ease;
        margin-left: 8px;
      }

      .article-favorite-icon:hover {
        transform: scale(1.2);
      }
      .bottom {
        font-size: 14px;
        color: #999;
        .tags {
          .tag {
            padding: 4px;
            background: #eee;
          }
          .tag + .tag {
            margin-left: 4px;
          }
        }
      }
    }
    .right {
      background-image: url("../HotCourse/img.png");
    }
  }
}
</style>

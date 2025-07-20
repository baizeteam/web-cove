<template>
  <div class="column-knowledge">
    <div class="section-header">
      <h2 class="section-title">专栏知识</h2>
      <div @click="handleViewMore">
        查看更多 <van-icon name="arrow-right" />
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
import { ref, defineEmits } from "vue";

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
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}

.list {
  padding-bottom: 16px;
  .item {
    margin-bottom: 25px;
    .left {
      .top {
        font-weight: 600;
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

.section-title {
  font-size: 18px;
  font-weight: bold;
}
</style>

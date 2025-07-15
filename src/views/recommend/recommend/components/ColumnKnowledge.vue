<template>
  <div class="column-knowledge">
    <div class="section-header">
      <h2 class="section-title">专栏知识</h2>
      <van-button type="text" @click="handleViewMore">
        查看更多 <van-icon name="arrow-right" />
      </van-button>
    </div>

    <div class="article-list">
      <van-cell-group>
        <van-cell
          v-for="article in articleList"
          :key="article.id"
          :title="article.title"
          :label="article.author + ' · ' + article.date"
          :is-link="true"
          @click="handleArticleClick(article.id)"
        />
      </van-cell-group>
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
  },
  {
    id: 2,
    title: "AI时代的编程技能",
    author: "AI研究员",
    date: "2025-07-05",
    content: "探讨了大语言模型对编程行业的影响...",
  },
  {
    id: 3,
    title: "微服务架构实战",
    author: "资深架构师",
    date: "2025-06-28",
    content: "微服务拆分原则与实践案例分析...",
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

.section-title {
  font-size: 18px;
  font-weight: bold;
}
</style>

<template>
  <div class="content-header">
    <div class="step-info">
      <div class="step-title-row">
        <h2 class="step-title">{{ stepTitle }}</h2>
        <van-icon
          :name="checkIsFavorited(stepFavoriteId) ? 'star' : 'star-o'"
          :color="checkIsFavorited(stepFavoriteId) ? '#ffd700' : '#ccc'"
          size="20"
          class="step-favorite-icon"
          @click="toggleStepFavorite"
        />
      </div>
      <div class="step-meta">第{{ chapterId }}章 · 步骤{{ stepId }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { isFavorited, toggleFavorite } from "@/utils/favorites.util";

interface Props {
  stepTitle?: string;
  chapterId: number;
  stepId: number;
}

const props = defineProps<Props>();
const route = useRoute();
const favoritesUpdate = ref(0); // 用于强制更新收藏状态的响应式变量

// 计算收藏ID
const stepFavoriteId = computed(() => {
  const courseId = route.params.id as string;
  return `step-${courseId}-${props.chapterId}-${props.stepId}`;
});

// 检查收藏状态 - 响应式版本
const checkIsFavorited = (id: string): boolean => {
  // 触发响应式更新
  console.log(favoritesUpdate.value);
  return isFavorited(id);
};

// 切换步骤收藏状态
const toggleStepFavorite = () => {
  const courseId = route.params.id as string;
  const language = route.params.language as string;

  toggleFavorite({
    id: stepFavoriteId.value,
    type: "step",
    title: props.stepTitle || `第${props.chapterId}章 步骤${props.stepId}`,
    description: `学习步骤：${props.stepTitle || "步骤内容"}`,
    language: language as any,
    courseId: courseId,
    chapterId: props.chapterId,
    stepId: props.stepId,
  });
  // 强制更新收藏状态
  favoritesUpdate.value++;
};

// 监听收藏更新事件
onMounted(() => {
  window.addEventListener("favorites-updated", () => {
    favoritesUpdate.value++;
  });
});
</script>

<style scoped>
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.step-info {
  flex: 1;
}

.step-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #262626;
  flex: 1;
}

.step-favorite-icon {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 12px;
}

.step-favorite-icon:hover {
  transform: scale(1.2);
}

.step-meta {
  font-size: 14px;
  color: #8c8c8c;
  background: #f7f7f7;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
}
</style>

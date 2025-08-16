<template>
  <div class="content-header">
    <div class="step-info">
      <h2 class="step-title">{{ stepTitle }}</h2>
      <div class="step-meta">第{{ chapterId }}章 · 步骤{{ stepId }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stepTitle?: string;
  chapterId: number;
  stepId: number;
}

defineProps<Props>();
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

.step-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #262626;
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

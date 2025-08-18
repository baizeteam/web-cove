<template>
  <div class="navigation-controls">
    <van-button
      v-if="navigationInfo?.hasPrev"
      type="default"
      size="large"
      class="nav-button"
      @click="handlePrev"
    >
      上一步
    </van-button>

    <van-button
      type="default"
      size="large"
      class="nav-button catalog-button"
      @click="goBackToCatalog"
    >
      返回
    </van-button>

    <van-button
      v-if="navigationInfo?.hasNext"
      type="primary"
      size="large"
      class="nav-button"
      :disabled="isNextButtonDisabled"
      @click="handleNext"
    >
      下一步
    </van-button>

    <van-button
      v-if="canCompleteChapter"
      type="success"
      size="large"
      class="nav-button"
      @click="completeCurrentChapter"
    >
      完成该章
    </van-button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  navigationInfo?: any;
  canCompleteChapter: boolean;
  isNextButtonDisabled: boolean;
}

defineProps<Props>();

// 定义事件
const emit = defineEmits<{
  prev: [];
  next: [];
  backToCatalog: [];
  completeChapter: [];
}>();

// 事件处理
const handlePrev = () => {
  emit("prev");
};

const handleNext = () => {
  emit("next");
};

const goBackToCatalog = () => {
  emit("backToCatalog");
};

const completeCurrentChapter = () => {
  emit("completeChapter");
};
</script>

<style scoped>
.navigation-controls {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  //padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-button:active {
  transform: scale(0.98);
}

.nav-button:hover:not(:disabled) {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 确保主要按钮的hover效果 */
.nav-button[type="primary"]:hover:not(:disabled) {
  background-color: #1976d2 !important;
}

.nav-button[type="success"]:hover:not(:disabled) {
  background-color: #388e3c !important;
}

.catalog-button {
  background-color: #f0f0f0;
  color: #595959;
}

.catalog-button:hover {
  background-color: #e0e0e0;
  color: #1890ff;
}
</style>

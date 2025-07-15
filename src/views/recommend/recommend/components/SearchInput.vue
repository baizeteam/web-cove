<template>
  <van-search
    v-model="searchValue"
    placeholder="python · html · java..."
    @focus="handleFocus"
  />
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";

// 定义props和emits类型
const emit = defineEmits<{
  (e: "focus"): void;
}>();

const searchValue = ref("");

const handleFocus = () => {
  emit("focus");
};
</script>

<style scoped>
.van-search {
  --search-background: #f5f5f5;
}
</style>

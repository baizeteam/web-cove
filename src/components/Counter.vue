<template>
  <div class="counter">
    <h2>计数器: {{ count }}</h2>
    <button @click="increment" class="btn">增加</button>
    <button @click="decrement" class="btn">减少</button>
    <button @click="reset" class="btn">重置</button>
    <p v-if="count > 10" class="message">数字很大了！</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};

const reset = () => {
  count.value = 0;
};

// 计算属性示例
const isPositive = computed(() => count.value > 0);
const isLarge = computed(() => count.value > 10);
</script>

<style scoped>
.counter {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.btn {
  margin: 5px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #3aa876;
}

.message {
  color: #e74c3c;
  font-weight: bold;
}
</style>

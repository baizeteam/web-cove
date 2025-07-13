<template>
  <div id="app">
    <h1>Vue3 + Vite + Vitest + TypeScript 示例</h1>
    <Counter />
    <TodoList />
    <MarkdownViewer src="/_markdown/test.md" />
  </div>
</template>

<script setup lang="ts">
import Counter from "./components/Counter.vue";
import TodoList from "./components/TodoList.vue";
import MarkdownViewer from "./components/MarkdownViewer.vue";
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

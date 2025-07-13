<template>
  <div class="todo-list">
    <h2>待办事项列表</h2>

    <!-- 添加新待办事项 -->
    <div class="add-todo">
      <input
        v-model="newTodo"
        placeholder="输入新的待办事项..."
        class="todo-input"
        @keyup.enter="addTodo"
      />
      <button class="add-btn" @click="addTodo">添加</button>
    </div>

    <!-- 过滤器 -->
    <div class="filters">
      <button
        :class="{ active: filter === 'all' }"
        class="filter-btn"
        @click="filter = 'all'"
      >
        全部
      </button>
      <button
        :class="{ active: filter === 'active' }"
        class="filter-btn"
        @click="filter = 'active'"
      >
        进行中
      </button>
      <button
        :class="{ active: filter === 'completed' }"
        class="filter-btn"
        @click="filter = 'completed'"
      >
        已完成
      </button>
    </div>

    <!-- 待办事项列表 -->
    <ul class="todos">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
        class="todo-item"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          class="todo-checkbox"
          @change="toggleTodo(todo.id)"
        />
        <span class="todo-text">{{ todo.text }}</span>
        <button class="delete-btn" @click="removeTodo(todo.id)">删除</button>
      </li>
    </ul>

    <!-- 统计信息 -->
    <div class="stats">
      <span>总计: {{ todos.length }}</span>
      <span>已完成: {{ completedCount }}</span>
      <span>进行中: {{ activeCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todos = ref<Todo[]>([]);
const newTodo = ref("");
const filter = ref<"all" | "active" | "completed">("all");

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false,
    });
    newTodo.value = "";
  }
};

const toggleTodo = (id: number) => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const removeTodo = (id: number) => {
  todos.value = todos.value.filter((t) => t.id !== id);
};

const filteredTodos = computed(() => {
  switch (filter.value) {
    case "active":
      return todos.value.filter((t) => !t.completed);
    case "completed":
      return todos.value.filter((t) => t.completed);
    default:
      return todos.value;
  }
});

const completedCount = computed(
  () => todos.value.filter((t) => t.completed).length,
);

const activeCount = computed(
  () => todos.value.filter((t) => !t.completed).length,
);
</script>

<style scoped>
.todo-list {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-btn {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.filter-btn.active {
  background-color: #42b983;
  color: white;
}

.todos {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-checkbox {
  margin: 0;
}

.todo-text {
  flex: 1;
}

.delete-btn {
  padding: 4px 8px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.stats {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  color: #666;
}
</style>

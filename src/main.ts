import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 示例路由
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: App, // 你可以替换为首页组件
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

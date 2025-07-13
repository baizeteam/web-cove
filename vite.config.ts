import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        // 这里可以全局引入 less 变量、mixin
        additionalData: `@import "@/styles/index.less";`,
        // 也可以加 less 的其他配置
        // javascriptEnabled: true
      },
    },
  },
});

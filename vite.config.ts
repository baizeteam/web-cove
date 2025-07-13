import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        // 这里可以全局引入 less 变量、mixin
        additionalData: `@import "@/assets/styles/index.less";`,
        // 也可以加 less 的其他配置
        // javascriptEnabled: true
      },
    },
  },
});

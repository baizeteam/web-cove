import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import basicSsl from '@vitejs/plugin-basic-ssl';
import progress from 'vite-plugin-progress'

export default defineConfig({
  plugins: [
      progress(),
      vue(
          {
            babel: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
              ]
            }
          }
      ),
      basicSsl(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "./",
  server: {
    host: '0.0.0.0',
    port: 1000,
    https: {
      key: path.resolve(__dirname, 'localhost-key.pem'),
      cert: path.resolve(__dirname, 'localhost.pem'),
    },
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/assets/styles/index.less";`,
      },
    },
  },
});


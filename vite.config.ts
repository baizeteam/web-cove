import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [vue(), basicSsl()],
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
    proxy: {
      '/res': {
        target: 'https://alidocs.oss-cn-zhangjiakou.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/res/, ''),
        headers: {
          Referer: 'https://web.leaiv.cn',  // 修改为你的前端域名
          Origin: 'https://web.leaiv.cn'     // 保持与Referer一致
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-credentials'] = 'true';
            if (proxyRes.headers['content-type']?.includes('image')) {
              proxyRes.headers['cache-control'] = 'public, max-age=31536000';
            }
          });
        }
      }
    }
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

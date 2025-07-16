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
  server: {
    host: '0.0.0.0',
    port: 1000,
    https: true,
    strictPort: true,
    proxy: {
      '/res': {
        target: 'https://alidocs.oss-cn-zhangjiakou.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/res/, ''), // 修正：替换路径前缀应匹配 '/res'
        headers: {
          // 设置 Referer 和 Origin 头（解决 OSS 防盗链问题）
          Referer: 'https://alidocs.oss-cn-zhangjiakou.aliyuncs.com',
          Origin: 'https://your-domain.com' // 替换为你的实际域名
        },
        // 可选：更精细的控制（如需修改响应头）
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['access-control-allow-origin'] = '*';
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

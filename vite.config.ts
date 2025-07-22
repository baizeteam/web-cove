import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import basicSsl from '@vitejs/plugin-basic-ssl';
import progress from 'vite-plugin-progress'
import * as fs from "node:fs";

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
    // middlewareMode: true,
    // configureServer: (server) => {
    //   server.middlewares.use((req, res, next) => {
    //     if (req.url?.endsWith('.md')) {
    //       const fsPath = path.join(__dirname, req.url)
    //       res.writeHead(200, { 'Content-Type': 'text/plain' })
    //       res.end(fs.readFileSync(fsPath, 'utf-8'))
    //       return
    //     }
    //     next()
    //   })
    // },
    host: '0.0.0.0',
    port: 1000,
    https: {
      key: path.resolve(__dirname, 'localhost-key.pem'),
      cert: path.resolve(__dirname, 'localhost.pem'),
    },
    proxy: {
      '/yuque': {
        target: 'https://cdn.nlark.com/yuque',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yuque/, ''),
        headers: {
          Referer: 'https://www.yuque.com',
          Origin: 'https://www.yuque.com',
        },
      },
      '^/public/_markdown/.*\.md$': {
        target: 'http://localhost:1000',
        rewrite: (path) => path.replace(/^\/public/, ''),
        bypass: (req) => req.url.endsWith('.md') ? req.url : undefined
      }
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


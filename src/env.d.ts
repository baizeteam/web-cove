// src/env.d.ts
interface ImportMetaEnv {
  // 自定义环境变量（根据你的实际需求添加）
  readonly VITE_Md: string;
  readonly VITE_Python: string;

  // 其他已有的环境变量（可选，可省略，TypeScript 会自动合并）
  // 注意：Vite 内置的环境变量（如 MODE、BASE_URL 等）无需重复声明
}

// 扩展 ImportMeta 接口，确保 env 的类型被正确识别
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

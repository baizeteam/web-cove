<template>
  <div class="markdown-preview">
    <div v-if="loading" class="loading">
      <van-loading type="spinner" text-color="#1890ff">加载中...</van-loading>
    </div>
    <div
      v-else
      class="preview-container"
      @click="handleImageClick"
      v-html="previewHtml"
    ></div>
    <div v-if="error" class="error-message">
      <van-icon name="warning-o" />
      {{ error }}
    </div>

    <!-- 全屏预览模态框 -->
    <div
      v-if="showFullscreen"
      class="image-modal"
      @click="showFullscreen = false"
    >
      <img :src="currentImageSrc" class="fullscreen-image" @click.stop />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { marked } from "marked";
import Prism from "prismjs";

// 引入 Prism.js 的核心样式和主题
import "prismjs/themes/prism-tomorrow.css";

// 引入需要的语言支持（只导入核心语言，避免依赖问题）
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";

// 引入插件（先注释掉可能有问题的插件）
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";

import { processImageUrls } from "@/components/Views/Md/View.md.ts";

interface Props {
  src?: string;
  content?: string;
  refreshKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  content: undefined,
  refreshKey: undefined,
});

const previewHtml = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const currentImageSrc = ref("");
const showFullscreen = ref(false);

// 处理图片点击事件
const handleImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === "IMG") {
    currentImageSrc.value = target.getAttribute("src") || "";
    showFullscreen.value = true;
    e.stopPropagation();
  }
};

// 自定义代码高亮函数
const highlightCode = (code: string, lang?: string): string => {
  if (!lang) {
    return Prism.util.encode(code) as string;
  }

  // 语言别名映射
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    yml: "yaml",
    sh: "bash",
    shell: "bash",
  };

  const normalizedLang = languageMap[lang.toLowerCase()] || lang.toLowerCase();

  // 检查语言是否被支持
  if (Prism.languages[normalizedLang]) {
    try {
      return Prism.highlight(
        code,
        Prism.languages[normalizedLang],
        normalizedLang
      );
    } catch (e) {
      console.warn(`Failed to highlight ${normalizedLang} code:`, e);
    }
  }

  return Prism.util.encode(code) as string;
};

// 自定义渲染器
const renderer = new marked.Renderer();

// 增强代码块渲染
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  const language = lang?.split(" ")[0] || "";
  const highlightedCode = highlightCode(text, language);

  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-language">${getLanguageDisplayName(language)}</span>
        <button class="copy-button" onclick="copyToClipboard(this)" data-code="${encodeURIComponent(text)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          复制
        </button>
      </div>
      <pre class="language-${language} line-numbers"><code class="language-${language}">${highlightedCode}</code></pre>
    </div>
  `;
};

// 获取语言显示名称
const getLanguageDisplayName = (lang: string): string => {
  const displayNames: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    css: "CSS",
    json: "JSON",
    bash: "Bash",
    shell: "Shell",
    yaml: "YAML",
    yml: "YAML",
    py: "Python",
    js: "JavaScript",
    ts: "TypeScript",
  };
  return displayNames[lang.toLowerCase()] || lang.toUpperCase() || "Text";
};

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: highlightCode,
} as any);

marked.use({ renderer });

const loadMarkdown = async () => {
  loading.value = true;
  error.value = null;

  try {
    let mdContent = props.content || "";

    if (props.src && !props.content) {
      const response = await fetch(props.src);
      if (!response.ok) throw new Error(`加载失败: ${response.statusText}`);
      mdContent = await response.text();
    }

    // 处理图片链接
    mdContent = processImageUrls(mdContent);

    console.log(mdContent, "处理后的 markdown 内容");

    previewHtml.value = marked.parse(mdContent) as string;

    // 使用 nextTick 确保 DOM 更新后再执行高亮
    await nextTick();

    // 重新高亮所有代码块
    Prism.highlightAll();

    // 添加复制功能的全局函数
    (window as any).copyToClipboard = function (button: HTMLElement) {
      const code = decodeURIComponent(button.dataset.code || "");
      const originalText = button.innerHTML;

      navigator.clipboard
        .writeText(code)
        .then(() => {
          button.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>已复制';
          button.style.color = "#52c41a";
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = "";
          }, 2000);
        })
        .catch(err => {
          console.error("复制失败:", err);
          // 降级到传统复制方法
          const textArea = document.createElement("textarea");
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            button.innerHTML =
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>已复制';
            button.style.color = "#52c41a";
            setTimeout(() => {
              button.innerHTML = originalText;
              button.style.color = "";
            }, 2000);
          } catch (err2) {
            console.error("复制失败:", err2);
          }
          document.body.removeChild(textArea);
        });
    };
  } catch (err: any) {
    error.value = err.message || "加载Markdown内容失败";
    console.error("Error:", err);
  } finally {
    loading.value = false;
  }
};

watch(
  [() => props.src, () => props.content, () => props.refreshKey],
  loadMarkdown,
  { immediate: true }
);
</script>

<style scoped>
.markdown-preview {
  position: relative;
  min-height: 100px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #1890ff;
}

.preview-container {
  line-height: 1.8;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    sans-serif;
  color: #2c3e50;
  font-size: 16px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f56565;
  padding: 12px 16px;
  background-color: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  font-weight: 500;
}

/* 图片模态框样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
  backdrop-filter: blur(4px);
}

.fullscreen-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  cursor: default;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 深度选择器样式 */
.preview-container :deep() {
  /* 标题样式 */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 2em;
    margin-bottom: 1em;
    font-weight: 600;
    line-height: 1.3;
    color: #1a202c;
  }

  h1 {
    font-size: 2.25em;
    border-bottom: 3px solid #3182ce;
    padding-bottom: 0.5em;
    color: #2d3748;
  }

  h2 {
    font-size: 1.875em;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.3em;
    color: #2d3748;
  }

  h3 {
    font-size: 1.5em;
    color: #2d3748;
  }

  h4 {
    font-size: 1.25em;
    color: #4a5568;
  }

  h5 {
    font-size: 1.125em;
    color: #4a5568;
  }

  h6 {
    font-size: 1em;
    color: #718096;
  }

  /* 段落样式 */
  p {
    margin-bottom: 1.25em;
    line-height: 1.8;
  }

  /* 列表样式 */
  ul,
  ol {
    padding-left: 2em;
    margin-bottom: 1.25em;
  }

  li {
    margin-bottom: 0.5em;
    line-height: 1.6;
  }

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  /* 选择题特殊样式 */
  ul li {
    padding: 12px 16px;
    margin: 8px 0;
    background: #f8fafc;
    border-left: 4px solid #e2e8f0;
    border-radius: 0 8px 8px 0;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  ul li:hover {
    background: #edf2f7;
    border-left-color: #3182ce;
    transform: translateX(4px);
  }

  /* 引用样式 */
  blockquote {
    padding: 16px 20px;
    color: #4a5568;
    background: #f7fafc;
    border-left: 4px solid #3182ce;
    margin: 1.5em 0;
    border-radius: 0 6px 6px 0;
    font-style: italic;
  }

  /* 代码块包装器 */
  .code-block-wrapper {
    margin: 1.5em 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: #2d3748;
  }

  .code-block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #1a202c;
    border-bottom: 1px solid #4a5568;
  }

  .code-language {
    font-size: 12px;
    font-weight: 600;
    color: #a0aec0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .copy-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid #4a5568;
    color: #a0aec0;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-button:hover {
    background: #2d3748;
    border-color: #718096;
    color: #ffffff;
  }

  .copy-button svg {
    width: 14px;
    height: 14px;
  }

  /* 重写 Prism.js 样式 */
  pre[class*="language-"] {
    margin: 0;
    padding: 20px;
    background: #2d3748 !important;
    border-radius: 0;
    font-size: 14px;
    line-height: 1.6;
    overflow-x: auto;
  }

  code[class*="language-"] {
    font-family:
      "Fira Code", "JetBrains Mono", "Cascadia Code", "SF Mono", Monaco,
      "Roboto Mono", Menlo, monospace !important;
    font-size: 14px;
    color: #e2e8f0;
  }

  /* 行号样式 */
  .line-numbers .line-numbers-rows {
    border-right: 1px solid #4a5568;
    background: #1a202c;
  }

  .line-numbers-rows > span:before {
    color: #718096;
  }

  /* Token 颜色优化 */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #718096;
    font-style: italic;
  }

  .token.punctuation {
    color: #e2e8f0;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #f56565;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #68d391;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #4fd1c7;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #9f7aea;
  }

  .token.function,
  .token.class-name {
    color: #f6e05e;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #ed8936;
  }

  /* 行内代码样式 */
  code:not([class*="language-"]) {
    font-family:
      "Fira Code", "JetBrains Mono", "Cascadia Code", "SF Mono", Monaco,
      "Roboto Mono", Menlo, monospace;
    font-size: 0.875em;
    background: #edf2f7;
    color: #e53e3e;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
  }

  /* 链接样式 */
  a {
    color: #3182ce;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #2c5aa0;
    text-decoration: underline;
  }

  /* 强调和斜体 */
  strong {
    font-weight: 700;
    color: #2d3748;
  }

  em {
    font-style: italic;
    color: #4a5568;
  }

  /* 图片样式 */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: zoom-in;
    transition: transform 0.2s ease;
  }

  img:hover {
    transform: scale(1.02);
  }

  /* 表格样式 */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5em 0;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    font-weight: 600;
    background: #f8fafc;
    color: #2d3748;
    border-bottom: 2px solid #e2e8f0;
  }

  tr:hover {
    background: #f8fafc;
  }

  /* 分隔线 */
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(to right, #e2e8f0, #cbd5e0, #e2e8f0);
    margin: 2em 0;
    border-radius: 1px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-preview {
    padding: 12px;
  }

  .preview-container {
    font-size: 15px;
  }

  .preview-container :deep() {
    .code-block-header {
      padding: 8px 12px;
    }

    .copy-button {
      padding: 4px 8px;
      font-size: 11px;
    }

    pre[class*="language-"] {
      padding: 16px 12px;
      font-size: 13px;
    }

    h1 {
      font-size: 1.875em;
    }

    h2 {
      font-size: 1.5em;
    }

    ul li {
      padding: 8px 12px;
    }
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .markdown-preview {
    background: #1a202c;
  }

  .preview-container {
    color: #e2e8f0;
  }

  .preview-container :deep() {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #f7fafc;
    }

    code:not([class*="language-"]) {
      background: #2d3748;
      color: #f56565;
    }

    blockquote {
      background: #2d3748;
      color: #cbd5e0;
    }

    ul li {
      background: #2d3748;
      border-left-color: #4a5568;
    }

    ul li:hover {
      background: #374151;
      border-left-color: #3182ce;
    }

    table {
      background: #2d3748;
    }

    th {
      background: #1a202c;
      color: #f7fafc;
    }

    tr:hover {
      background: #374151;
    }
  }
}
</style>

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

// 处理选择题内容
const processQuizContent = (content: string): string => {
  // 移除选择题处理逻辑，直接返回原内容
  return content;
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

    // 处理选择题内容
    mdContent = processQuizContent(mdContent);

    // console.log(mdContent, "处理后的 markdown 内容");

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
@import "./index.css";
</style>

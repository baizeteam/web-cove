<template>
  <div class="markdown-preview">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="preview-container" v-html="previewHtml"></div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import * as marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface Props {
  src?: string;        // Markdown 文件路径
  content?: string;    // 直接传递的 Markdown 内容
  refreshKey?: string; // 刷新键，用于强制重新加载
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  content: undefined,
  refreshKey: undefined,
});

// 组件状态
const previewHtml = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

// 配置 marked 解析器
const renderer = new marked.Renderer();

// 自定义解析器处理特殊格式
renderer.strong = (text: string) => {

  const cleanText = text.text.replaceAll(/^\*\*|\*\*$/g, '');
  return `<strong>${cleanText}</strong>`;
};

renderer.listitem = (text: string) => {
  console.log(text,'ff')
  // 将 tokens 转换为文本
  const textContent = text.tokens.map(token => token.text).join('');

  // 使用更精确的正则表达式匹配 **文本**
  const cleanText = textContent.replace(/\*\*(.*?)\*\*/g, '$1');

  console.log('原始文本:', textContent);
  console.log('处理后:', cleanText);

  return `<li>${cleanText}</li>`;
};

// 配置 marked
marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
  sanitize: false, // 允许 HTML 标签
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});



// 加载 Markdown 内容
const loadMarkdown = async () => {
  loading.value = true;
  error.value = null;
  previewHtml.value = '';

  try {
    let mdContent = '';

    if (props.src) {
      // 从 URL 加载
      const response = await fetch(props.src);
      if (!response.ok) {
        throw new Error(`Failed to load Markdown file: ${response.statusText}`);
      }
      mdContent = await response.text();
    } else if (props.content !== undefined) {
      // 使用直接传递的内容
      mdContent = props.content;
    } else {
      throw new Error('Either "src" or "content" prop must be provided');
    }

    // 渲染 Markdown
    previewHtml.value = marked.parse(mdContent);
  } catch (err: any) {
    console.error('Error loading/rendering Markdown:', err);
    error.value = err.message || 'Failed to load Markdown content';
    previewHtml.value = `<div class="error">${error.value}</div>`;
  } finally {
    loading.value = false;
  }
};

// 监听属性变化并重新加载
watch([() => props.src, () => props.content, () => props.refreshKey], loadMarkdown, {
  immediate: true,
});
</script>

<style scoped>
.markdown-preview {
  position: relative;
  min-height: 400px;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-container {
  padding: 1rem;
  background-color: #fff;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffebee;
  color: #b71c1c;
  border-radius: 4px;
  border: 1px solid #ef9a9a;
}

/* 预览样式 */
.preview-container h1,
.preview-container h2,
.preview-container h3 {
  color: #2c3e50;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.preview-container p {
  margin-bottom: 1rem;
}

.preview-container ul,
.preview-container ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.preview-container code {
  padding: 0.2rem 0.4rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
}

.preview-container pre {
  padding: 1rem;
  background-color: #282c34;
  color: #fff;
  border-radius: 6px;
  overflow-x: auto;
}

.preview-container pre code {
  background-color: transparent;
  padding: 0;
  font-size: 0.9rem;
}

.preview-container strong {
  color: #2c3e50;
}

.preview-container span[style*="color"] {
  font-weight: bold;
}
</style>

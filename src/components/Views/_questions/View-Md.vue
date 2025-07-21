<template>
  <div class="markdown-preview">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="preview-container" v-html="previewHtml"></div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

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

const previewHtml = ref('');
const loading = ref(false);
const error = ref<string | null>(null);


const processImageUrls = (markdownContent: string): string => {
  // 匹配 ![...](https://cdn.nlark.com/...) 格式的图片链接
  try {
    const regex = /!\[(.*?)\]\((https:\/\/cdn\.nlark\.com)(\/[^)]+)\)/g;

    return markdownContent.replace(regex, (match, altText, domain, path) => {
      // 只保留路径部分，去掉域名
      return `![${altText}](${path})`;
    });
  }catch (_) {
    return markdownContent;
  }
};

// 配置 marked 和 highlight.js
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, {
          language: lang,
          ignoreIllegals: true
        }).value;
      } catch (e) {
        console.warn(`Failed to highlight ${lang} code`, e);
      }
    }
    return hljs.highlightAuto(code).value;
  },
});

const loadMarkdown = async () => {
  loading.value = true;
  error.value = null;

  try {
    let mdContent = props.content || '';

    if (props.src && !props.content) {
      const response = await fetch(props.src);
      if (!response.ok) throw new Error(`加载失败: ${response.statusText}`);
      mdContent = await response.text();
    }

    // 处理图片链接：移除特定域名
    mdContent = processImageUrls(mdContent);

    console.log(mdContent, '处理后的 markdown 内容');

    previewHtml.value = marked.parse(mdContent);

    // 延迟执行高亮，确保DOM已更新
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }, 0);

  } catch (err: any) {
    error.value = err.message || '加载Markdown内容失败';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

watch([
  () => props.src,
  () => props.content,
  () => props.refreshKey
], loadMarkdown, { immediate: true });
</script>

<style scoped>
.markdown-preview {
  position: relative;
  min-height: 100px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.preview-container {
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.error-message {
  color: #dc3545;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
}

/* 深度选择器样式 */
.preview-container :deep() {
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.25em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.25;
  }

  h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1em; }
  h5 { font-size: 0.875em; }
  h6 { font-size: 0.85em; color: #6a737d; }

  p { margin-bottom: 1em; }

  ul, ol {
    padding-left: 2em;
    margin-bottom: 1em;
  }

  li {
    margin-bottom: 0.5em;
  }

  ol { list-style-type: decimal; }
  ul { list-style-type: disc; }

  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 0 0 1em 0;
  }

  pre {
    background-color: #282c34;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    line-height: 1.45;
    margin-bottom: 1.5em;
  }

  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    color: inherit;
  }

  a {
    color: #0366d6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  img {
    max-width: 100%;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
    display: block;
    overflow: auto;
  }

  th, td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }

  th {
    font-weight: 600;
    background-color: #f6f8fa;
  }

  tr:nth-child(2n) {
    background-color: #f6f8fa;
  }
}
</style>

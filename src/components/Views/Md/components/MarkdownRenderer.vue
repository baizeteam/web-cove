<template>
  <div class="markdown-renderer">
    <slot v-if="loading" name="loading">
      <div class="loading">
        <van-loading type="spinner" text-color="#1890ff">加载中...</van-loading>
      </div>
    </slot>

    <div
      v-else-if="!error"
      class="preview-container"
      v-html="renderedHtml"
    ></div>

    <slot v-if="error" name="error" :error="error">
      <div class="error-message">
        <van-icon name="warning-o" />
        {{ error }}
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { marked } from "marked";
import { useCodeHighlight } from "../hooks/useCodeHighlight";
import { processImageUrls } from "../View.md.ts";

interface Props {
  src?: string;
  content?: string;
  refreshKey?: string;
  isQuiz?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  content: undefined,
  refreshKey: undefined,
  isQuiz: false,
});

const emit = defineEmits<{
  rendered: [html: string];
  error: [error: string];
}>();

const renderedHtml = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

// 使用代码高亮功能
const { setupRenderer } = useCodeHighlight();

// 配置marked
const setupMarked = () => {
  marked.setOptions({
    gfm: true,
    breaks: true,
  } as any);

  // 设置自定义渲染器
  setupRenderer(marked);

  // 如果是选择题，设置选择题渲染器
  if (props.isQuiz) {
    setupQuizRenderer(marked);
  }

  // 应用外部传入的自定义渲染器
  applyCustomRenderer();
};

// 设置选择题的marked渲染器
const setupQuizRenderer = (marked: any) => {
  const renderer = new marked.Renderer();

  // 增强列表渲染，支持选择题选项
  renderer.list = function (token: any) {
    const body = token.raw;
    const ordered = token.ordered;

    if (props.isQuiz && !ordered) {
      // 从原始文本中提取选项
      const lines = body.split("\n").filter((line: string) => line.trim());
      const optionsHtml = lines
        .map((line: string) => {
          const match = line.match(/^\s*-\s+([A-Z])\.\s*(.+)$/);
          if (match) {
            const [, letter, text] = match;
            return `
              <div class="quiz-option" data-option="${letter}" onclick="selectQuizOption('${letter}')">
                <span class="option-letter">${letter}</span>
                <span class="option-text">${text}</span>
              </div>
            `;
          }
          return "";
        })
        .filter((item: string) => item)
        .join("");

      return `<div class="quiz-options">${optionsHtml}</div>`;
    }

    // 普通列表 - 使用默认渲染
    const listItems = token.items
      .map((item: any) => `<li>${item.text}</li>`)
      .join("");
    const tag = ordered ? "ol" : "ul";
    return `<${tag}>${listItems}</${tag}>`;
  };

  marked.use({ renderer });
};

// 设置选择题交互函数
const setupQuizInteraction = () => {
  (window as any).selectQuizOption = function (selectedAnswer: string) {
    // 这里只是设置一个临时函数，实际的处理会由QuizRenderer组件接管
    console.log("选择了选项:", selectedAnswer);
  };
};

const loadAndRenderMarkdown = async () => {
  loading.value = true;
  error.value = null;

  try {
    let mdContent = props.content || "";

    // 如果有src但没有content，从URL加载
    if (props.src && !props.content) {
      const response = await fetch(props.src);
      if (!response.ok) throw new Error(`加载失败: ${response.statusText}`);
      mdContent = await response.text();
    }

    // 处理图片链接
    mdContent = processImageUrls(mdContent);

    // 渲染markdown
    const html = marked.parse(mdContent) as string;
    renderedHtml.value = html;

    // 如果是选择题，设置交互函数
    if (props.isQuiz) {
      setupQuizInteraction();
    }

    emit("rendered", html);
  } catch (err: any) {
    const errorMessage = err.message || "加载Markdown内容失败";
    error.value = errorMessage;
    emit("error", errorMessage);
  } finally {
    loading.value = false;
  }
};

// 监听props变化
watch(
  [() => props.src, () => props.content, () => props.refreshKey],
  loadAndRenderMarkdown,
  { immediate: true }
);

// 自定义渲染器
let customRenderer: ((marked: any) => void) | null = null;

// 设置自定义渲染器
const setCustomRenderer = (renderer: (marked: any) => void) => {
  customRenderer = renderer;
  // 重新设置marked配置
  setupMarked();
  // 如果有内容，重新渲染
  if (renderedHtml.value) {
    loadAndRenderMarkdown();
  }
};

// 应用自定义渲染器
const applyCustomRenderer = () => {
  if (customRenderer) {
    customRenderer(marked);
  }
};

// 初始化marked配置
setupMarked();

// 暴露方法
defineExpose({
  setCustomRenderer,
});
</script>

<style lang="less" scoped>
.markdown-renderer {
  width: 100%;
  height: 100%;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f56565;
  background: #fed7d7;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.preview-container {
  width: 100%;
  height: 100%;
}
:deep(p img) {
  margin: 10px 0;
  width: 100%;
  height: 100%;
}
</style>

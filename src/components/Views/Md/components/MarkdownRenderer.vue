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
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  content: undefined,
  refreshKey: undefined,
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

// 初始化marked配置
setupMarked();
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

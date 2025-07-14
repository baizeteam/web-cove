<template>
  <div class="markdown-viewer" ref="markdownContainer" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const props = defineProps<{ src: string }>();
const renderedHtml = ref('');
const markdownContainer = ref<HTMLElement>();

const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (e) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

// 处理图片点击预览
const setupImagePreview = () => {
  if (!markdownContainer.value) return;

  const images = markdownContainer.value.querySelectorAll('img');
  images.forEach(img => {
    // 添加预览样式
    img.style.cursor = 'zoom-in';
    img.style.maxWidth = '100%';
    img.style.borderRadius = '4px';
    img.style.transition = 'transform 0.2s';

    // 添加点击事件
    img.onclick = () => {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = '9999';
      overlay.style.cursor = 'zoom-out';

      const previewImg = document.createElement('img');
      previewImg.src = img.src;
      previewImg.style.maxHeight = '90vh';
      previewImg.style.maxWidth = '90vw';
      previewImg.style.objectFit = 'contain';

      overlay.appendChild(previewImg);
      overlay.onclick = () => document.body.removeChild(overlay);

      document.body.appendChild(overlay);
    };
  });
};

onMounted(async () => {
  const res = await fetch(props.src);
  const mdText = await res.text();

  // 可选：提前替换img标签添加自定义属性
  // const processedText = mdText.replace(/<img/g, '<img data-previewable="true"');

  renderedHtml.value = md.render(mdText);

  // 等待DOM更新后处理图片
  await nextTick();
  setupImagePreview();
});
</script>

<style scoped>
.markdown-viewer {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  max-width: 800px;
  margin: 0 auto;
}
.markdown-viewer h1,
.markdown-viewer h2,
.markdown-viewer h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.markdown-viewer pre {
  background: #282c34;
  color: #fff;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 15px;
  line-height: 1.7;
  margin: 16px 0;
}
.markdown-viewer code {
  background: #282c34;
  color: #fff;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.95em;
}
</style>

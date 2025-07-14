<template>
  <div class="markdown-viewer" ref="markdownContainer" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { showImagePreview } from 'vant'; // 注意这里是 showImagePreview 而不是 ImagePreview

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
  const imageList: string[] = [];
  const imageMap = new Map<HTMLImageElement, number>();

  images.forEach((img, index) => {
    img.style.cursor = 'zoom-in';
    img.style.maxWidth = '100%';
    img.style.borderRadius = '4px';
    img.style.transition = 'transform 0.2s';

    if (img.src) {
      imageList.push(img.src);
      imageMap.set(img, index);
    }

    img.onclick = () => {
      const currentIndex = imageMap.get(img) || 0;
      showImagePreview({
        images: imageList,
        startPosition: currentIndex,
        closeable: true,
      });
    };
  });
};

onMounted(async () => {
  const res = await fetch(props.src);
  const mdText = await res.text();
  renderedHtml.value = md.render(mdText);

  await nextTick();
  setupImagePreview();
});
</script>

<style lang="less" scoped>
:deep(.hljs) {
  padding: 20px;
  border-radius: 5px;
  line-height: 20px;
}
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

/* 保留原有样式 */
.markdown-viewer {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  max-width: 800px;
  margin: 0 auto;
}

.markdown-viewer img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  cursor: zoom-in;
  transition: transform 0.2s;
}

.markdown-viewer img:hover {
  transform: scale(1.02);
}
</style>

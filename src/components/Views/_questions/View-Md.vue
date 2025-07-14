<template>
  <div class="markdown-viewer" ref="markdownContainer"></div>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick, createApp, h} from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import ViewVantImage from '../View-VantImage.vue'; // 直接导入组件

const props = defineProps<{ src: string }>();
const markdownContainer = ref<HTMLElement>(); // 容器引用

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
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx];
  const src = token.attrGet('src') || '';
  const alt = token.content || '';

  // 直接返回带特殊属性的图片
  return `
    <img
      src="${src}"
      alt="${alt}"
      class="markdown-image"
      data-image-idx="${idx}"
      style="display:none"
    />
  `;
};

// 修改onMounted中的处理逻辑
onMounted(async () => {
  const res = await fetch(props.src);
  const mdText = await res.text();
  const html = md.render(mdText);

  if (markdownContainer.value) {
    markdownContainer.value.innerHTML = html;

    await nextTick();
    // 选择所有标记的图片元素
    const images = markdownContainer.value.querySelectorAll('img.markdown-image');

    images.forEach((img) => {
      const parent = img.parentElement;
      if (parent) {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';

        // 创建并挂载Vue组件
        const app = createApp({
          render: () => h(ViewVantImage, {
            src,
            alt,
            previewable: true,
            style: 'width:90vw;height:200px;margin:12px auto;border-radius:8px;'
          })
        });

        // 替换原始图片
        img.replaceWith(document.createElement('div')); // 创建临时容器
        app.mount(img.nextSibling as Element);
        img.remove(); // 移除原始图片
      }
    });
  }
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

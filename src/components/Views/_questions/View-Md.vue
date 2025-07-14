<template>
  <div class="markdown-viewer" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const props = defineProps<{ src: string }>();
const renderedHtml = ref('');

const md: MarkdownIt = new MarkdownIt({
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        );
      } catch (__) {
        console.error(__)
      }
    }
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    );
  },
});

onMounted(async () => {
  const res = await fetch(props.src);
  const mdText = await res.text();
  renderedHtml.value = md.render(mdText);
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
.markdown-viewer img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 12px auto;
  border-radius: 4px;
}
</style>

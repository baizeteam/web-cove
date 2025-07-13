<template>
  <!--  eslint 提示 v-html 可能会受到 xss 攻击-->
  <div class="markdown-viewer" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import { marked } from "marked";
// @ts-ignore
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const props = defineProps<{ src: string }>();
const renderedHtml = ref("");
(marked as any).setOptions({
  highlight: function (code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

onMounted(async () => {
  const res = await fetch(props.src);
  const md = await res.text();
  renderedHtml.value = (marked as any).parse(md);
});
</script>

<style scoped>
@import "highlight.js/styles/github.css";
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
  background: #f6f8fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}
.markdown-viewer code {
  background: #f6f8fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.95em;
}
.markdown-viewer img {
  max-width: 100%;
  border-radius: 4px;
}
</style>

<template>
  <div class="markdown-viewer">
    <template v-for="(node, idx) in ast" :key="idx">
      <!-- 图片渲染 -->
      <ViewVantImage
          v-if="node.type === 'image'"
          :src="node.src"
          :alt="node.alt"
          previewable
          style="width:90vw;height:200px;margin:12px auto;border-radius:8px;"
      />

      <!-- 标题渲染 -->
      <component
          v-else-if="node.type === 'heading'"
          :is="node.tag"
          :class="`heading-${node.level}`"
      >
        <template v-for="(child, cidx) in node.children" :key="cidx">
          <Test :node="child" />
        </template>
      </component>

      <!-- 段落渲染 -->
      <p v-else-if="node.type === 'paragraph'">
        <template v-for="(child, cidx) in node.children" :key="cidx">
          <Test :node="child" />
        </template>
      </p>

      <!-- 代码块渲染 -->
      <pre v-else-if="node.type === 'code'" :class="node.attrs?.class">
        <code :class="`language-${node.lang}`">{{ node.content }}</code>
      </pre>

      <!-- 默认文本渲染 -->
      <template v-else>
        {{ node.content }}
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import ViewVantImage from '../View-VantImage.vue';
import Test from "@/components/Views/_questions/Test.vue";

const props = defineProps<{ src: string }>();
const ast = ref<any[]>([]);

const md = new MarkdownIt({
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        );
      } catch (__) {}
    }
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    );
  },
});
function tokensToAst(tokens: any[]): any[] {
  const ast: any[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    // 处理图片
    if (token.type === 'image') {
      ast.push({
        type: 'image',
        tag: ViewVantImage,
        src: token.attrGet('src'),
        alt: token.content,
      });
      i++;
      continue;
    }

    // 处理标题 (h1-h6)
    if (token.type.startsWith('heading_')) {
      const level = parseInt(token.type.replace('heading_', ''));
      const tag = `h${level}`;
      const children = tokens[i+1].children
          ? tokensToAst(tokens[i+1].children)
          : [];

      ast.push({
        type: 'heading',
        tag,
        children,
        level
      });
      i += 3; // skip open + inline + close
      continue;
    }

    // 处理段落
    if (token.type === 'paragraph_open') {
      const children = tokens[i+1].children
          ? tokensToAst(tokens[i+1].children)
          : [];

      ast.push({
        type: 'paragraph',
        tag: 'p',
        children
      });
      i += 3; // skip open + inline + close
      continue;
    }

    // 处理代码块
    if (token.type === 'fence') {
      ast.push({
        type: 'code',
        tag: 'pre',
        content: token.content,
        attrs: { class: 'hljs' },
        lang: token.info
      });
      i++;
      continue;
    }

    // 处理内联文本
    if (token.type === 'inline' && token.children) {
      ast.push(...tokensToAst(token.children));
      i++;
      continue;
    }

    // 处理文本节点
    if (token.type === 'text') {
      ast.push({
        type: 'text',
        content: token.content
      });
      i++;
      continue;
    }

    // 默认情况
    i++;
  }

  return ast;
}

onMounted(async () => {
  const res = await fetch(props.src);
  const mdText = await res.text();
  const tokens = md.parse(mdText, {});
  ast.value = tokensToAst(tokens);
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

<template>
  <div class="markdown-preview">
    <div v-if="loading" class="loading">
      <van-loading type="spinner" text-color="#1890ff">加载中...</van-loading>
    </div>
    <div
      v-else
      class="preview-container"
      @click="handleImageClick"
      v-html="previewHtml"
    ></div>
    <div v-if="error" class="error-message">
      <van-icon name="warning-o" />
      {{ error }}
    </div>

    <!-- 选择题结果显示区域 -->
    <div v-if="isQuiz" class="quiz-result" style="display: none"></div>

    <!-- 全屏预览模态框 -->
    <div
      v-if="showFullscreen"
      class="image-modal"
      @click="showFullscreen = false"
    >
      <img :src="currentImageSrc" class="fullscreen-image" @click.stop />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { marked } from "marked";
import Prism from "prismjs";

// 引入 Prism.js 的核心样式和主题
import "prismjs/themes/prism-tomorrow.css";

// 引入需要的语言支持（只导入核心语言，避免依赖问题）
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";

// 引入插件（先注释掉可能有问题的插件）
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";

import { processImageUrls } from "@/components/Views/Md/View.md.ts";
import type { QuizAnswer } from "@/data/courses";

interface Props {
  src?: string;
  content?: string;
  refreshKey?: string;
  // 选择题相关props
  isQuiz?: boolean;
  quizAnswer?: QuizAnswer;
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  content: undefined,
  refreshKey: undefined,
  isQuiz: false,
  quizAnswer: undefined,
});

// 定义事件
const emit = defineEmits<{
  quizAnswered: [isCorrect: boolean, selectedAnswer: string];
}>();

const previewHtml = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const currentImageSrc = ref("");
const showFullscreen = ref(false);

// 选择题状态
const selectedOption = ref("");
const showResult = ref(false);
const isCorrect = ref(false);

// 处理图片点击事件
const handleImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === "IMG") {
    currentImageSrc.value = target.getAttribute("src") || "";
    showFullscreen.value = true;
    e.stopPropagation();
  }
};

// 自定义代码高亮函数
const highlightCode = (code: string, lang?: string): string => {
  if (!lang) {
    return Prism.util.encode(code) as string;
  }

  // 语言别名映射
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    yml: "yaml",
    sh: "bash",
    shell: "bash",
  };

  const normalizedLang = languageMap[lang.toLowerCase()] || lang.toLowerCase();

  // 检查语言是否被支持
  if (Prism.languages[normalizedLang]) {
    try {
      return Prism.highlight(
        code,
        Prism.languages[normalizedLang],
        normalizedLang
      );
    } catch (e) {
      console.warn(`Failed to highlight ${normalizedLang} code:`, e);
    }
  }

  return Prism.util.encode(code) as string;
};

// 自定义渲染器
const renderer = new marked.Renderer();

// 增强代码块渲染
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  const language = lang?.split(" ")[0] || "";
  const highlightedCode = highlightCode(text, language);

  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-language">${getLanguageDisplayName(language)}</span>
        <button class="copy-button" style="color:black" onclick="copyToClipboard(this)" data-code="${encodeURIComponent(text)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          复制
        </button>
      </div>
      <pre class="language-${language} line-numbers"><code class="language-${language}">${highlightedCode}</code></pre>
    </div>
  `;
};

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
              <span class="option-text" style="color: black">${text}</span>
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

// 获取语言显示名称
const getLanguageDisplayName = (lang: string): string => {
  const displayNames: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    css: "CSS",
    json: "JSON",
    bash: "Bash",
    shell: "Shell",
    yaml: "YAML",
    yml: "YAML",
    py: "Python",
    js: "JavaScript",
    ts: "TypeScript",
  };
  return displayNames[lang.toLowerCase()] || lang.toUpperCase() || "Text";
};

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: highlightCode,
} as any);

marked.use({ renderer });

const loadMarkdown = async () => {
  loading.value = true;
  error.value = null;

  try {
    let mdContent = props.content || "";

    if (props.src && !props.content) {
      const response = await fetch(props.src);
      if (!response.ok) throw new Error(`加载失败: ${response.statusText}`);
      mdContent = await response.text();
    }

    // 处理图片链接
    mdContent = processImageUrls(mdContent);

    console.log(mdContent, "处理后的 markdown 内容");

    previewHtml.value = marked.parse(mdContent) as string;

    // 使用 nextTick 确保 DOM 更新后再执行高亮
    await nextTick();

    // 重新高亮所有代码块
    Prism.highlightAll();

    // 添加复制功能的全局函数
    (window as any).copyToClipboard = function (button: HTMLElement) {
      const code = decodeURIComponent(button.dataset.code || "");
      const originalText = button.innerHTML;

      navigator.clipboard
        .writeText(code)
        .then(() => {
          button.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>已复制';
          button.style.color = "#52c41a";
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = "";
          }, 2000);
        })
        .catch(err => {
          console.error("复制失败:", err);
          // 降级到传统复制方法
          const textArea = document.createElement("textarea");
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            button.innerHTML =
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>已复制';
            button.style.color = "#52c41a";
            setTimeout(() => {
              button.innerHTML = originalText;
              button.style.color = "";
            }, 2000);
          } catch (err2) {
            console.error("复制失败:", err2);
          }
          document.body.removeChild(textArea);
        });
    };

    // 添加选择题交互功能
    if (props.isQuiz) {
      (window as any).selectQuizOption = function (selectedAnswer: string) {
        selectedOption.value = selectedAnswer;
        showResult.value = true;

        if (props.quizAnswer) {
          isCorrect.value = selectedAnswer === props.quizAnswer.correct;

          // 更新选项样式
          const options = document.querySelectorAll(".quiz-option");
          options.forEach(option => {
            const optionEl = option as HTMLElement;
            const optionValue = optionEl.dataset.option;

            optionEl.classList.remove("selected", "correct", "wrong");

            if (optionValue === selectedAnswer) {
              optionEl.classList.add("selected");
              if (isCorrect.value) {
                optionEl.classList.add("correct");
              } else {
                optionEl.classList.add("wrong");
              }
            }

            if (optionValue === props.quizAnswer?.correct) {
              optionEl.classList.add("correct");
            }

            // 禁用点击
            optionEl.style.pointerEvents = "none";
          });

          // 显示结果提示
          const resultEl = document.querySelector(".quiz-result");
          if (resultEl) {
            resultEl.innerHTML = isCorrect.value
              ? `<div class="result-success">✅ 回答正确！${props.quizAnswer.explanation || ""}</div>`
              : `<div class="result-error">❌ 回答错误！正确答案是 ${props.quizAnswer.correct}。${props.quizAnswer.explanation || ""}</div>`;
            (resultEl as HTMLElement).style.display = "block";
          }

          // 通知父组件
          emit("quizAnswered", isCorrect.value, selectedAnswer);
        }
      };
    }
  } catch (err: any) {
    error.value = err.message || "加载Markdown内容失败";
    console.error("Error:", err);
  } finally {
    loading.value = false;
  }
};

watch(
  [() => props.src, () => props.content, () => props.refreshKey],
  loadMarkdown,
  { immediate: true }
);
</script>

<style>
@import "./index.css";

/* 选择题特有样式 */
.quiz-options {
  margin: 24px 0;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin: 12px 0;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
}

.quiz-option:hover {
  border-color: #3182ce;
  background: #f8faff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.1);
}

.quiz-option.selected {
  border-color: #3182ce;
  background: #edf2f7;
}

.quiz-option.correct {
  border-color: #68d391;
  background: #f0fff4;
  color: #22543d;
}

.quiz-option.wrong {
  border-color: #fc8181;
  background: #fef2f2;
  color: #c53030;
}

.option-letter {
  width: 36px;
  height: 36px;
  background: #e2e8f0;
  color: #2d3748;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.quiz-option.selected .option-letter {
  background: #3182ce;
  color: white;
}

.quiz-option.correct .option-letter {
  background: #68d391;
  color: white;
}

.quiz-option.wrong .option-letter {
  background: #fc8181;
  color: white;
}

.option-text {
  flex: 1;
  line-height: 1.5;
}

.quiz-result {
  margin-top: 24px;
  padding: 16px;
  border-radius: 12px;
  font-weight: 500;
}

.result-success {
  color: #22543d;
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  padding: 16px;
  border-radius: 8px;
  line-height: 1.6;
}

.result-error {
  color: #c53030;
  background: #fef2f2;
  border: 1px solid #fc8181;
  padding: 16px;
  border-radius: 8px;
  line-height: 1.6;
}
</style>

<template>
  <div class="question-card">
    <!-- 如果有 markdownSrc，解析并显示内容 -->
    <div v-if="markdownSrc" class="markdown-choice">
      <!-- 题目内容区域 (除了选项的其他内容) -->
      <div class="question-content" v-html="questionContent"></div>

      <!-- 选项区域：用 Vant Radio -->
      <van-radio-group v-model="selectedOption">
        <van-radio
          v-for="(option, index) in extractedOptions"
          :key="index"
          :name="option.value"
          class="radio-item"
        >
          {{ option.label }}
        </van-radio>
      </van-radio-group>
    </div>

    <!-- 传统选择题格式 -->
    <template v-else>
      <!-- 进度与标题区域 -->
      <div class="header">
        <div class="progress-info">
          <span class="progress-text">2/7</span>
        </div>
        <h2 class="question-title">
          {{ data.questions }}
        </h2>
      </div>

      <!-- 代码展示区域 -->
      <div class="code-box">
        <pre>
          <code>
            {{data.code}}
          </code>
        </pre>
      </div>

      <!-- 选项区域：用 Vant Radio，默认圆形 -->
      <van-radio-group v-model="selectedOption">
        <van-radio
          v-for="(option, index) in data.options"
          :key="index"
          :name="option"
          class="radio-item"
        >
          {{ option }}
        </van-radio>
      </van-radio-group>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import type { ChoiceStep } from "@/data/courses";
import { marked } from "marked";

interface IProps {
  data: ChoiceStep<string[]>["data"];
  markdownSrc?: string;
}

const props = defineProps<IProps>();

// 定义事件
const emit = defineEmits<{
  answered: [hasAnswered: boolean, selectedAnswer: string];
}>();

// 双向绑定选中值
const selectedOption = ref("");

// Markdown 内容相关状态
const markdownContent = ref("");
const questionContent = ref("");
const extractedOptions = ref<{ label: string; value: string }[]>([]);

// 解析 Markdown 内容
const parseMarkdownContent = (content: string) => {
  // 分离选项和其他内容
  const lines = content.split("\n");
  const optionLines: string[] = [];
  const contentLines: string[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    // 检测选项格式: - A. xxx 或 - B. xxx 等
    if (trimmed.match(/^-\s+[A-Z]\.\s+.+/)) {
      optionLines.push(trimmed);
    } else {
      contentLines.push(line);
    }
  });

  // 解析选项
  extractedOptions.value = optionLines.map(line => {
    const match = line.match(/^-\s+([A-Z])\.\s+(.+)/);
    if (match) {
      return {
        value: match[1], // A, B, C, D
        label: `${match[1]}. ${match[2]}`, // A. 6, B. 2, 等
      };
    }
    return { value: "", label: line };
  });

  // 处理题目内容（移除选项后的内容）
  const contentMarkdown = contentLines.join("\n").trim();
  if (contentMarkdown) {
    questionContent.value = marked.parse(contentMarkdown) as string;
  }
};

// 加载 Markdown 内容
const loadMarkdownContent = async () => {
  if (!props.markdownSrc) return;

  try {
    const response = await fetch(props.markdownSrc);
    if (!response.ok) throw new Error(`加载失败: ${response.statusText}`);

    markdownContent.value = await response.text();
    parseMarkdownContent(markdownContent.value);
  } catch (error) {
    console.error("加载 Markdown 失败:", error);
  }
};

// 判断是否使用 Markdown 源
const markdownSrc = computed(() => props.markdownSrc);

watch(
  selectedOption,
  value => {
    console.log(value, "选择的答案:", value);
    // 通知父组件答题状态
    emit("answered", !!value, value);
  },
  { deep: true }
);

onMounted(() => {
  if (props.markdownSrc) {
    loadMarkdownContent();
  }
});
</script>

<style scoped>
.question-card {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}

.markdown-choice {
  width: 100%;
}

.question-content {
  margin-bottom: 24px;
  line-height: 1.6;
}

.question-content :deep(h1),
.question-content :deep(h2),
.question-content :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: 600;
  color: #2c3e50;
}

.question-content :deep(p) {
  margin-bottom: 1em;
  color: #555;
}

.question-content :deep(pre) {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
}

.question-content :deep(code) {
  font-family: "Fira Code", "JetBrains Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.progress-info {
  font-size: 14px;
  color: #999;
}

.question-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.code-box {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.code-box pre {
  margin: 0;
  font-size: 14px;
  color: #666;
  white-space: pre-wrap;
}

.radio-item {
  margin-bottom: 12px;
  padding: 12px 16px;
  font-size: 16px;
  color: #333;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.radio-item:hover {
  border-color: #1976d2;
  background: #f8faff;
}

.radio-item.van-radio--checked {
  border-color: #1976d2;
  background: #e3f2fd;
}
</style>

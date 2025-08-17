<template>
  <div class="markdown-preview">
    <!-- Markdown渲染器 -->
    <MarkdownRenderer
      ref="markdownRef"
      :src="src"
      :content="content"
      :refresh-key="refreshKey"
      :is-quiz="isQuiz"
      @rendered="onMarkdownRendered"
      @error="onMarkdownError"
    />

    <!-- 交互题目组件 -->
    <QuizRenderer
      v-if="isQuiz"
      ref="quizRef"
      :quiz-answer="quizAnswer"
      :enabled="isQuiz"
      :is-blank="isBlank"
      @quiz-answered="onQuizAnswered"
    />

    <!-- 图片预览组件 -->
    <ImagePreview
      ref="imagePreviewRef"
      container-selector=".preview-container"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from "vue";
import MarkdownRenderer from "./components/MarkdownRenderer.vue";
import QuizRenderer from "./components/QuizRenderer.vue";
import ImagePreview from "./components/ImagePreview.vue";
import { useCodeHighlight } from "./hooks/useCodeHighlight";
import type { QuizAnswer } from "@/data/courses";

interface Props {
  src?: string;
  content?: string;
  refreshKey?: string;
  // 交互题目相关props
  isQuiz?: boolean;
  quizAnswer?: QuizAnswer;
  isBlank?: boolean; // 是否为填空题
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  content: undefined,
  refreshKey: undefined,
  isQuiz: false,
  quizAnswer: undefined,
  isBlank: false,
});

// 定义事件
const emit = defineEmits<{
  quizAnswered: [isCorrect: boolean, selectedAnswer: string];
}>();

// 组件引用
const markdownRef = ref<InstanceType<typeof MarkdownRenderer>>();
const quizRef = ref<InstanceType<typeof QuizRenderer>>();
const imagePreviewRef = ref<InstanceType<typeof ImagePreview>>();

// 使用代码高亮功能
const { highlightAll } = useCodeHighlight();

// 处理Markdown渲染完成
const onMarkdownRendered = async (html: string) => {
  // 使用 nextTick 确保 DOM 更新后再执行高亮
  if (!html) console.log(html);
  await nextTick();

  // 重新高亮所有代码块
  highlightAll();

  // 重新设置图片点击监听
  if (imagePreviewRef.value) {
    imagePreviewRef.value.setupImageClickListener();
  }
};

// 处理Markdown渲染错误
const onMarkdownError = (error: string) => {
  console.error("Markdown渲染错误:", error);
};

// 处理选择题回答
const onQuizAnswered = (isCorrect: boolean, selectedAnswer: string) => {
  emit("quizAnswered", isCorrect, selectedAnswer);
};

onMounted(() => {
  // 组件初始化完成
  console.log("View-Md组件已挂载");

  // 如果是选择题，确保在组件挂载时就设置交互函数
  if (props.isQuiz && quizRef.value) {
    setTimeout(() => {
      quizRef.value?.setupQuizInteraction();
    }, 100);
  }
});
</script>

<style lang="less">
@import "./index.less";

.markdown-preview {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

<style lang="less">
/* 全局样式确保选择题样式生效 */
.quiz-options {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: #3182ce;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.1);
  }

  &.selected {
    border-color: #3182ce;
    background: #edf2f7;
  }

  &.correct {
    border-color: #68d391;
    background: #f0fff4;
    color: #22543d;
  }

  &.wrong {
    border-color: #fc8181;
    background: #fef5e7;
    color: #c53030;
  }
}

.option-letter {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  color: #2d3748;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
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
  font-size: 16px;
}

.quiz-result {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  font-weight: 500;
}

.result-correct {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #22543d;
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  padding: 12px 16px;
  border-radius: 8px;
}

.result-wrong {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c53030;
  background: #fef2f2;
  border: 1px solid #fc8181;
  padding: 12px 16px;
  border-radius: 8px;
}

/* 填空题样式 */
.blank-question {
  margin: 24px 0;
  font-size: 18px;
  line-height: 1.6;
}

.blank-input {
  display: inline-block;
  min-width: 120px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  margin: 0 4px;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  &.correct {
    border-color: #68d391;
    background: #f0fff4;
    color: #22543d;
  }

  &.wrong {
    border-color: #fc8181;
    background: #fef2f2;
    color: #c53030;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
}
</style>

<template>
  <div class="markdown-preview">
    <!-- Markdown渲染器 -->
    <MarkdownRenderer
      ref="markdownRef"
      :src="src"
      :content="content"
      :refresh-key="refreshKey"
      @rendered="onMarkdownRendered"
      @error="onMarkdownError"
    />

    <!-- 选择题组件 -->
    <QuizRenderer
      v-if="isQuiz"
      ref="quizRef"
      :quiz-answer="quizAnswer"
      :enabled="isQuiz"
      @quiz-answered="onQuizAnswered"
    />

    <!-- 图片预览组件 -->
    <ImagePreview
      ref="imagePreviewRef"
      container-selector=".markdown-content"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from "vue";
import { marked } from "marked";
import MarkdownRenderer from "./components/MarkdownRenderer.vue";
import QuizRenderer from "./components/QuizRenderer.vue";
import ImagePreview from "./components/ImagePreview.vue";
import { useCodeHighlight } from "./hooks/useCodeHighlight";
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

// 组件引用
const markdownRef = ref<InstanceType<typeof MarkdownRenderer>>();
const quizRef = ref<InstanceType<typeof QuizRenderer>>();
const imagePreviewRef = ref<InstanceType<typeof ImagePreview>>();

// 使用代码高亮功能
const { highlightAll } = useCodeHighlight();

// 处理Markdown渲染完成
const onMarkdownRendered = async (html: string) => {
  if (!html) {
    console.log(html);
  }
  // 使用 nextTick 确保 DOM 更新后再执行高亮
  await nextTick();

  // 重新高亮所有代码块
  highlightAll();

  // 如果是选择题，设置渲染器
  if (props.isQuiz && quizRef.value) {
    quizRef.value.setupQuizRenderer(marked);
  }

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
});
</script>

<style>
@import "./index.css";

.markdown-preview {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

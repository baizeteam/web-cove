<template>
  <div class="quiz-renderer">
    <!-- 选择题结果显示区域 -->
    <div ref="resultRef" class="quiz-result" style="display: none"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type { QuizAnswer } from "@/data/courses";

interface Props {
  quizAnswer?: QuizAnswer;
  enabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  quizAnswer: undefined,
  enabled: true,
});

const emit = defineEmits<{
  quizAnswered: [isCorrect: boolean, selectedAnswer: string];
}>();

const resultRef = ref<HTMLElement>();
const selectedOption = ref("");
const showResult = ref(false);
const isCorrect = ref(false);

// 设置选择题的marked渲染器
const setupQuizRenderer = (marked: any) => {
  const renderer = new marked.Renderer();

  // 增强列表渲染，支持选择题选项
  renderer.list = function (token: any) {
    const body = token.raw;
    const ordered = token.ordered;

    if (props.enabled && !ordered) {
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
                <span class="option-text">${text}</span>
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

  marked.use({ renderer });
};

// 选择题交互函数
const setupQuizInteraction = () => {
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
      if (resultRef.value) {
        resultRef.value.innerHTML = isCorrect.value
          ? `<div class="result-correct">✅ 回答正确！${props.quizAnswer.explanation || ""}</div>`
          : `<div class="result-wrong">❌ 回答错误！正确答案是 ${props.quizAnswer.correct}。${props.quizAnswer.explanation || ""}</div>`;
        resultRef.value.style.display = "block";
      }

      // 通知父组件
      emit("quizAnswered", isCorrect.value, selectedAnswer);
    }
  };
};

// 重置选择题状态
const resetQuiz = () => {
  selectedOption.value = "";
  showResult.value = false;
  isCorrect.value = false;

  if (resultRef.value) {
    resultRef.value.style.display = "none";
    resultRef.value.innerHTML = "";
  }

  // 重置选项样式
  const options = document.querySelectorAll(".quiz-option");
  options.forEach(option => {
    const optionEl = option as HTMLElement;
    optionEl.classList.remove("selected", "correct", "wrong");
    optionEl.style.pointerEvents = "auto";
  });
};

// 监听enabled属性变化
watch(
  () => props.enabled,
  newEnabled => {
    if (newEnabled) {
      setupQuizInteraction();
    } else {
      resetQuiz();
    }
  }
);

onMounted(() => {
  if (props.enabled) {
    setupQuizInteraction();
  }
});

// 暴露方法给父组件
defineExpose({
  setupQuizRenderer,
  resetQuiz,
});
</script>

<style scoped>
.quiz-renderer {
  /* 选择题组件容器样式已在 index.css 中通过 :deep() 定义 */
}
</style>

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
          ? `<div class="result-success">✅ 回答正确！${props.quizAnswer.explanation || ""}</div>`
          : `<div class="result-error">❌ 回答错误！正确答案是 ${props.quizAnswer.correct}。${props.quizAnswer.explanation || ""}</div>`;
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

<style>
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

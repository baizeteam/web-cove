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
  isBlank?: boolean; // 是否为填空题
}

const props = withDefaults(defineProps<Props>(), {
  quizAnswer: undefined,
  enabled: true,
  isBlank: false,
});

const emit = defineEmits<{
  quizAnswered: [isCorrect: boolean, selectedAnswer: string];
}>();

const resultRef = ref<HTMLElement>();
const selectedOption = ref("");
const showResult = ref(false);
const isCorrect = ref(false);
const userAnswer = ref(""); // 填空题用户输入的答案

// 设置选择题的marked渲染器
const setupQuizRenderer = (marked: any) => {
  const renderer = new marked.Renderer();

  // 增强列表渲染，支持选择题选项
  renderer.list = function (token: any) {
    const body = token.raw;
    const ordered = token.ordered;

    if (props.enabled && !ordered && !props.isBlank) {
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

// 交互函数设置
const setupQuizInteraction = () => {
  // 选择题交互函数
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

  // 填空题交互函数
  (window as any).updateBlankInput = function (inputValue: string) {
    userAnswer.value = inputValue.trim();
  };

  // 填空题验证函数（供外部调用）
  (window as any).validateBlankAnswer = function () {
    // 如果已经显示结果了，返回之前的正确性
    if (showResult.value) {
      return isCorrect.value;
    }

    // 如果没有答案配置，无法验证
    if (!props.quizAnswer) {
      return false;
    }

    const inputs = document.querySelectorAll(".blank-input");
    const correctAnswers = Array.isArray(props.quizAnswer.correct)
      ? props.quizAnswer.correct
      : [props.quizAnswer.correct];

    // 检查输入框数量是否与答案数量匹配
    if (inputs.length !== correctAnswers.length) {
      console.warn("填空题输入框数量与答案数量不匹配");
      return false;
    }

    // 收集所有用户输入
    const userInputs: string[] = [];
    let hasEmptyInput = false;

    inputs.forEach(input => {
      const inputEl = input as HTMLInputElement;
      const value = inputEl.value.trim();
      userInputs.push(value);
      if (!value) {
        hasEmptyInput = true;
      }
    });

    // 如果有空输入，返回false
    if (hasEmptyInput) {
      return false;
    }

    showResult.value = true;

    // 验证每个输入是否正确
    let allCorrect = true;
    const results: boolean[] = [];

    inputs.forEach((input, index) => {
      const inputEl = input as HTMLInputElement;
      const userInput = userInputs[index].toLowerCase();
      const correctAnswer = correctAnswers[index].toLowerCase();
      const isInputCorrect = userInput === correctAnswer;

      results.push(isInputCorrect);
      if (!isInputCorrect) {
        allCorrect = false;
      }

      // 更新输入框样式
      inputEl.classList.remove("correct", "wrong");
      inputEl.classList.add(isInputCorrect ? "correct" : "wrong");
      inputEl.disabled = true;
    });

    isCorrect.value = allCorrect;

    // 显示结果提示
    if (resultRef.value) {
      const correctAnswersDisplay = correctAnswers.join("、");
      resultRef.value.innerHTML = isCorrect.value
        ? `<div class="result-correct">✅ 回答正确！${props.quizAnswer.explanation || ""}</div>`
        : `<div class="result-wrong">❌ 回答错误！正确答案是：${correctAnswersDisplay}。${props.quizAnswer.explanation || ""}</div>`;
      resultRef.value.style.display = "block";
    }

    // 通知父组件
    const userAnswerString = userInputs.join("、");
    emit("quizAnswered", isCorrect.value, userAnswerString);
    return isCorrect.value;
  };
};

// 重置题目状态
const resetQuiz = () => {
  selectedOption.value = "";
  userAnswer.value = "";
  showResult.value = false;
  isCorrect.value = false;

  if (resultRef.value) {
    resultRef.value.style.display = "none";
    resultRef.value.innerHTML = "";
  }

  // 重置选择题选项样式
  const options = document.querySelectorAll(".quiz-option");
  options.forEach(option => {
    const optionEl = option as HTMLElement;
    optionEl.classList.remove("selected", "correct", "wrong");
    optionEl.style.pointerEvents = "auto";
  });

  // 重置填空题输入框样式
  const inputs = document.querySelectorAll(".blank-input");
  inputs.forEach(input => {
    const inputEl = input as HTMLInputElement;
    inputEl.classList.remove("correct", "wrong");
    inputEl.disabled = false;
    inputEl.value = "";
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
  setupQuizInteraction,
  resetQuiz,
});
</script>

<style scoped>
.quiz-renderer {
  /* 选择题组件容器样式已在 index.css 中通过 :deep() 定义 */
}
</style>

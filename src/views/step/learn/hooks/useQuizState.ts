import { ref, computed, watch } from "vue";

export function useQuizState(
  courseId: any,
  chapterId: any,
  stepId: any,
  stepInfo: any
) {
  // 答题状态管理
  const hasAnswered = ref(false);
  const currentAnswer = ref("");

  // 计算下一步按钮是否应该禁用
  const isNextButtonDisabled = computed(() => {
    const isChoiceStep = stepInfo.value?.title?.endsWith("-选择题") || false;
    const isBlankStep = stepInfo.value?.title?.endsWith("-填空题") || false;

    // 选择题需要先答题才能继续
    // 填空题不需要禁用按钮，点击时验证
    const result = isChoiceStep && !hasAnswered.value;

    console.log("下一步按钮状态:", {
      isChoiceStep,
      isBlankStep,
      hasAnswered: hasAnswered.value,
      disabled: result,
    });
    return result;
  });

  // 重置答题状态
  const resetAnswerState = () => {
    hasAnswered.value = false;
    currentAnswer.value = "";
  };

  // 处理传统选择题答题事件
  const handleAnswered = (answered: boolean, answer: string) => {
    hasAnswered.value = answered;
    currentAnswer.value = answer;
    console.log("答题状态:", answered, "答案:", answer);
  };

  // 处理Markdown选择题答题事件
  const handleQuizAnswered = (isCorrect: boolean, selectedAnswer: string) => {
    hasAnswered.value = true;
    currentAnswer.value = selectedAnswer;
    console.log(
      "选择题答题:",
      isCorrect ? "正确" : "错误",
      "答案:",
      selectedAnswer,
      "hasAnswered:",
      hasAnswered.value
    );
  };

  // 验证填空题（在点击下一步时调用）
  const validateBlankQuestion = (): boolean => {
    const currentTitle = stepInfo.value?.title || "";
    const isBlankStep = currentTitle.endsWith("-填空题");

    console.log("验证填空题:", {
      currentTitle,
      isBlankStep,
      hasAnswered: hasAnswered.value,
      validateFunctionExists:
        typeof (window as any).validateBlankAnswer === "function",
    });

    if (!isBlankStep) {
      console.log("不是填空题，直接通过");
      return true; // 不是填空题，直接通过
    }

    // 如果已经答过了，直接通过
    if (hasAnswered.value) {
      console.log("填空题已答过，直接通过");
      return true;
    }

    // 调用全局验证函数
    if (typeof (window as any).validateBlankAnswer === "function") {
      console.log("调用全局填空题验证函数");
      const validated = (window as any).validateBlankAnswer();
      console.log("填空题验证结果:", validated);
      return validated;
    }

    console.log("填空题验证函数不存在");
    return false;
  };

  // 验证当前步骤（选择题或填空题）
  const validateCurrentStep = (): boolean => {
    const currentTitle = stepInfo.value?.title || "";
    const isChoiceStep = currentTitle.endsWith("-选择题");
    const isBlankStep = currentTitle.endsWith("-填空题");

    console.log("验证当前步骤:", {
      currentTitle,
      isChoiceStep,
      isBlankStep,
      hasAnswered: hasAnswered.value,
    });

    // 如果既不是选择题也不是填空题，直接通过
    if (!isChoiceStep && !isBlankStep) {
      console.log("普通步骤，直接通过");
      return true;
    }

    // 如果是选择题，检查是否已经答题
    if (isChoiceStep) {
      if (!hasAnswered.value) {
        console.log("选择题尚未答题，无法继续");
        alert("请先完成选择题再继续！");
        return false;
      }
      console.log("选择题已答题，验证通过");
      return true;
    }

    // 如果是填空题，调用填空题验证
    if (isBlankStep) {
      // console.log("填空题，调用验证函数");
      const result = validateBlankQuestion();
      if (!result) {
        // alert("请先正确完成填空题再继续！");
      }
      return result;
    }

    return true;
  };

  // 监听步骤变化，重置答题状态
  watch(
    [courseId, chapterId, stepId],
    () => {
      resetAnswerState();
    },
    { immediate: false }
  );

  return {
    hasAnswered,
    currentAnswer,
    isNextButtonDisabled,
    resetAnswerState,
    handleAnswered,
    handleQuizAnswered,
    validateBlankQuestion,
    validateCurrentStep,
  };
}

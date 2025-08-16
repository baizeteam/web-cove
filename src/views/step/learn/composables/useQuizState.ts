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
    const isChoiceStep = stepInfo.value?.type === "choice";
    const result = isChoiceStep && !hasAnswered.value;
    console.log("下一步按钮状态:", {
      isChoiceStep,
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
  };
}

import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  updateLearningProgress,
  markChapterCompleted,
} from "@/utils/learning.util";
import { getNavigationManager } from "@/utils/navigation.util";

export function useNavigation(
  language: any,
  courseId: any,
  chapterId: any,
  stepId: any,
  navigationInfo: any,
  resetAnswerState: () => void,
  validateCurrentStep?: () => boolean
) {
  const router = useRouter();
  const navManager = getNavigationManager();
  const showCompleteDialog = ref(false);

  // 设置目录路由
  navManager.setCatalogRoute(`/step/${language.value}/${courseId.value}`);

  // 记录当前章节学习路由
  navManager.enterChapterStudy(chapterId.value, stepId.value);

  // 是否可以完成章节 - 修改逻辑：在章节最后一步时显示
  const canCompleteChapter = computed(() => {
    if (!navigationInfo.value) return false;

    // 检查是否是当前章节的最后一步
    const currentChapter = navigationInfo.value.currentChapter;
    const currentStep = navigationInfo.value.currentStep;

    if (!currentChapter || !currentStep) return false;

    // 找到当前步骤在章节中的索引
    const currentStepIndex = currentChapter.steps.findIndex(
      step => step.id === currentStep.id
    );

    // 如果是章节的最后一步，则显示完成按钮
    return currentStepIndex === currentChapter.steps.length - 1;
  });

  // 返回目录
  const goBackToCatalog = () => {
    navManager.backToCatalogWithCleanup();
  };

  // 智能返回上一页
  const smartGoBack = () => {
    navManager.smartGoBack();
  };

  // 导航到下一步
  const handleNext = () => {
    if (!navigationInfo.value || !navigationInfo.value.hasNext) return;

    // 如果是交互题目（选择题或填空题），先验证答案
    if (validateCurrentStep && !validateCurrentStep()) {
      console.log("当前步骤验证失败，无法继续");
      return;
    }

    // 标记当前步骤完成
    updateLearningProgress(courseId.value, chapterId.value, stepId.value, true);

    // 触发存储事件，让其他组件知道学习状态变化
    window.dispatchEvent(new Event("storage"));

    // 重置答题状态
    resetAnswerState();

    // 跳转到下一步
    router.push(
      `/step/${language.value}/${courseId.value}/${navigationInfo.value.nextChapter}/${navigationInfo.value.nextStep}`
    );
  };

  // 导航到上一步
  const handlePrev = () => {
    if (!navigationInfo.value || !navigationInfo.value.hasPrev) return;

    // 重置答题状态
    resetAnswerState();

    // 跳转到上一步
    router.push(
      `/step/${language.value}/${courseId.value}/${navigationInfo.value.prevChapter}/${navigationInfo.value.prevStep}`
    );
  };

  // 完成当前章节
  const completeCurrentChapter = () => {
    if (!navigationInfo.value) return;

    // 如果是交互题目（选择题或填空题），先验证答案
    if (validateCurrentStep && !validateCurrentStep()) {
      console.log("当前步骤验证失败，无法完成章节");
      return;
    }

    // 先标记当前步骤完成
    updateLearningProgress(courseId.value, chapterId.value, stepId.value, true);

    // 标记章节完成
    if (markChapterCompleted(courseId.value, chapterId.value)) {
      console.log(`第${chapterId.value}章已完成`);

      // 触发存储事件，让其他组件知道学习状态变化
      window.dispatchEvent(new Event("storage"));

      // 显示完成弹窗
      showCompleteDialog.value = true;
    } else {
      console.error("章节完成标记失败");
    }
  };

  // 处理完成弹窗的回调
  const handleDialogBackToCatalog = () => {
    navManager.completeChapterStudy();
  };

  const handleDialogContinueNext = () => {
    // 这里可以添加跳转到下一章的逻辑
    navManager.completeChapterStudy();
  };

  return {
    canCompleteChapter,
    goBackToCatalog,
    smartGoBack,
    handleNext,
    handlePrev,
    completeCurrentChapter,
    showCompleteDialog,
    handleDialogBackToCatalog,
    handleDialogContinueNext,
  };
}

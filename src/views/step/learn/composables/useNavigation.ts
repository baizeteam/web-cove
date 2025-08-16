import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  updateLearningProgress,
  markChapterCompleted,
} from "@/utils/learning.util";

export function useNavigation(
  language: any,
  courseId: any,
  chapterId: any,
  stepId: any,
  navigationInfo: any,
  resetAnswerState: () => void
) {
  const router = useRouter();

  // 是否可以完成章节
  const canCompleteChapter = computed(() => {
    if (!navigationInfo.value) return false;
    return !navigationInfo.value.hasNext;
  });

  // 返回目录
  const goBackToCatalog = () => {
    router.push(`/step/${language.value}/${courseId.value}`);
  };

  // 导航到下一步
  const handleNext = () => {
    if (!navigationInfo.value || !navigationInfo.value.hasNext) return;

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

    // 先标记当前步骤完成
    updateLearningProgress(courseId.value, chapterId.value, stepId.value, true);

    // 标记章节完成
    if (markChapterCompleted(courseId.value, chapterId.value)) {
      console.log(`第${chapterId.value}章已完成`);

      // 触发存储事件，让其他组件知道学习状态变化
      window.dispatchEvent(new Event("storage"));

      // 返回目录页面
      goBackToCatalog();
    } else {
      console.error("章节完成标记失败");
    }
  };

  return {
    canCompleteChapter,
    goBackToCatalog,
    handleNext,
    handlePrev,
    completeCurrentChapter,
  };
}

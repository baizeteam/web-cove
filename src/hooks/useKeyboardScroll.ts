import { type Ref, onUnmounted, ref } from "vue";

type DOMTarget = string | HTMLElement | Ref<HTMLElement | null>;

interface KeyboardScrollOptions {
  contentTarget?: DOMTarget;
  // bottomButtonTarget?: DOMTarget
  scrollBehavior?: ScrollIntoViewOptions;
}

export function useKeyboardScroll(options: KeyboardScrollOptions = {}) {
  const defaultOptions = {
    contentTarget: ".page-content", // 要清理滚动条的页面容器, 通常是最外层容器
    // bottomButtonTarget: '.page-fixed-bottom-button', // 页面底部按钮容器, 通常是提交按钮，会挡住输入框正在输入的最后一行
    scrollBehavior: {
      behavior: "smooth",
      block: "center",
    } as ScrollIntoViewOptions, // 输入框滚动行为
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const pageContentDOM = ref<HTMLElement | null>(null);
  // const pageFixedBottomDOM = ref<HTMLElement | null>(null)
  const isKeyboardVisible = ref(false);
  const timer = ref<ReturnType<typeof setTimeout> | null>(null); // 使用 ref 存储

  const resolveDOMRef = (target: DOMTarget): HTMLElement | null => {
    if (typeof target === "string") return document.querySelector(target);
    if (target instanceof HTMLElement) return target;
    if (target?.value) return target.value;
    return null;
  };

  const initDOMRefs = () => {
    pageContentDOM.value = resolveDOMRef(mergedOptions.contentTarget);
    // pageFixedBottomDOM.value = resolveDOMRef(mergedOptions.bottomButtonTarget)
  };

  // focus 时
  const handleFocus = () => {
    isKeyboardVisible.value = true;
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null; // 这时候可以置空为 null
    }

    setTimeout(() => {
      const inputElement = document.activeElement as HTMLElement;
      inputElement?.scrollIntoView(mergedOptions.scrollBehavior);

      if (pageContentDOM.value) pageContentDOM.value.style.overflowY = "hidden";

      // if (pageFixedBottomDOM.value) {
      //   // 保存下原始display值, 有可能别人是 display: flex 或 block
      //   pageFixedBottomDOM.value.dataset.originalDisplay
      //       = window.getComputedStyle(pageFixedBottomDOM.value).display
      //   pageFixedBottomDOM.value.style.display = 'none'
      // }
    }, 300);
  };

  // blur 时
  const handleBlur = () => {
    isKeyboardVisible.value = false;

    // if (pageFixedBottomDOM.value) {
    //   // 恢复原始display值
    //   pageFixedBottomDOM.value.style.display
    //       = pageFixedBottomDOM.value.dataset.originalDisplay || 'block'
    // }

    timer.value = setTimeout(() => {
      if (pageContentDOM.value) pageContentDOM.value.style.overflowY = "auto";
    }, 300);
  };
  // 卸载时清除定时器
  onUnmounted(() => {
    if (timer.value) clearTimeout(timer.value); // 这时候无需置空为 null ,timer.value 会被vue产生的局部作用域回收
  });

  return {
    initDOMRefs,
    handleFocus,
    handleBlur,
    isKeyboardVisible,
  };
}

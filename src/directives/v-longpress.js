let start = null;
let cancel = null;
let move = null;
let startX;
let startY;
export default {
  mounted(el, binding) {
    // 从指令参数中获取长按时间，默认 500 毫秒
    const pressTime = Number(binding.arg || 500);
    let timer = null;

    // 鼠标按下或触摸开始时触发
    start = (e) => {
      if (!e.touches) return;
      startX = e.touches[0].screenX;
      startY = e.touches[0].screenY;
      if (e.type === "click" && e.button !== 0) return;

      if (timer === null) {
        // 设置定时器，达到长按时间后触发绑定的函数
        timer = setTimeout(() => {
          console.log("长按结束", e);
          binding.value(e);
        }, pressTime);
      }
    };

    // 鼠标松开、触摸结束或离开元素时触发
    cancel = () => {
      console.log("cancel");
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    // 鼠标移动或触摸移动时触发
    move = (e) => {
      if (
        !e.touches ||
        Math.abs(e.touches[0].screenX - startX) < 50 ||
        Math.abs(e.touches[0].screenY - startY) < 50
      )
        return;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    // 添加事件监听器
    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    el.addEventListener("mousemove", move);
    el.addEventListener("touchmove", move);
    el.addEventListener("mouseup", cancel);
    el.addEventListener("mouseleave", cancel);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);
  },
  unmounted(el) {
    // 移除事件监听器，避免内存泄漏
    el.removeEventListener("mousedown", start);
    el.removeEventListener("touchstart", start);
    el.removeEventListener("mousemove", move);
    el.removeEventListener("touchmove", move);
    el.removeEventListener("mouseup", cancel);
    el.removeEventListener("mouseleave", cancel);
    el.removeEventListener("touchend", cancel);
    el.removeEventListener("touchcancel", cancel);
  },
};

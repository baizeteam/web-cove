export function stopDoubleScale() {
  // js 阻止 双击放大
  document.addEventListener(
    "touchstart",
    function (event) {
      // 检测是否为双击
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      // 检测双击时间间隔（300ms 内）
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false },
  );
}

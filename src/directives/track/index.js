import sensors from "sa-sdk-javascript";

const clickValeMap = new Map();
const exposureValMap = new Map();
/**
 * 埋点
 */
const Track = {
  mounted(el, binding) {
    const { click, exposure } = binding.modifiers;
    if (click) {
      clickValeMap.set(el, binding.value);
      el.addEventListener("click", () => {
        sensors.track("WebClick", clickValeMap.get(el));
      });
    } else if (exposure) {
      exposureValMap.set(el, binding.value);
      const _observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              sensors.track("WebExposure", exposureValMap.get(el));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );

      _observer.observe(el);
    }
  },
  updated(el, binding) {
    const { click, exposure } = binding.modifiers;
    if (click) clickValeMap.set(el, binding.value);
    else if (exposure) exposureValMap.set(el, binding.value);
  },
  unmounted(el) {
    exposureValMap.delete(el);
    clickValeMap.delete(el);
  },
};

export default Track;

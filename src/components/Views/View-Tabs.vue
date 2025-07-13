<script lang="ts" setup>
// special 写这个组件是因为 vant-tabs 初始化动态设置值，值变了，但是 active 样式没变。
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { ITab } from "@/types/views/tabs.type";

defineOptions({
  name: "ViewTabs",
});

const props = defineProps<{
  tabs: ITab[];
  active?: ITab["name"];
  activeColor?: string;
  inactiveColor?: string;
  lineWidth?: number; // 底部条宽度，单位px（优先级最高）
  lineHeight?: number; // 底部条高度，单位px
  duration?: number; // 动画时长，单位ms
  indicatorRatio?: number; // 指示器宽度占tab宽度的比例（0-1），默认0.6
}>();

const emit = defineEmits<{
  (e: "click", tab: { title: string; name: string }): void;
}>();

const route = useRoute();
const currentName = ref(
  props.active || route.query?.activeTab || props.tabs[0]?.name || "",
);
const indicatorStyle = ref({
  width: "0px",
  left: "0px",
  transition: "all 0.3s ease",
});

const tabRefs = ref<HTMLElement[]>([]);
const tabsWrapperRef = ref<HTMLElement>();

// 计算指示器宽度
function getIndicatorWidth(tabWidth: number) {
  if (props.lineWidth) return props.lineWidth; // 优先级最高
  const ratio = props.indicatorRatio || 0.2; // 默认占tab宽度的60%
  const calculatedWidth = tabWidth * ratio;
  return Math.max(calculatedWidth, 20); // 确保最小20px
}

// 更新指示器位置
function updateIndicator() {
  const activeIndex = props.tabs.findIndex(
    (tab) => tab.name === currentName.value,
  );
  if (activeIndex === -1) return;

  nextTick(() => {
    const activeTabEl = tabRefs.value[activeIndex];
    if (!activeTabEl) return;

    const { offsetLeft, offsetWidth } = activeTabEl;
    const indicatorWidth = getIndicatorWidth(offsetWidth);

    indicatorStyle.value = {
      width: `${indicatorWidth}px`,
      left: `${offsetLeft + (offsetWidth - indicatorWidth) / 2}px`, // 居中计算
      transition: `all ${props.duration || 300}ms ease`, // 始终保持过渡效果
    };
  });
}

// 处理tab点击
function handleTabClick(tab: { title: string; name: string }) {
  if (currentName.value === tab.name) return;

  currentName.value = tab.name;
  // emit('update:modelValue', tab.name)
  emit("click", tab);
}

// 监听active变化
watch(currentName, () => {
  updateIndicator();
});

// 监听tabs变化
watch(
  () => props.tabs,
  () => {
    if (!props.tabs.some((tab) => tab.name === currentName.value))
      currentName.value = props.tabs[0]?.name || "";

    nextTick(updateIndicator);
  },
  { deep: true },
);

// 监听modelValue变化
watch(
  () => props.active,
  (newVal) => {
    if (newVal && newVal !== currentName.value) currentName.value = newVal;
  },
);

onMounted(() => {
  updateIndicator();
});

defineExpose({
  active: currentName,
});
</script>

<template>
  <div class="div-tabs">
    <div ref="tabsWrapperRef" class="tabs-wrapper">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.name"
        ref="tabRefs"
        class="tab-item"
        :class="{ 'active-class': currentName === tab.name }"
        @click="handleTabClick(tab, index)"
      >
        <span
          class="tab-title"
          :style="{
            fontWeight: currentName === tab.name ? '600' : 'normal',
          }"
        >
          {{ tab.title }}
        </span>
      </div>
      <div class="tab-indicator" :style="indicatorStyle" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.div-tabs {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
  border-bottom: 1px solid rgba(31, 34, 38, 0.1);

  .tabs-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    height: 44px;
    background-color: #fff;
  }

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 12px;
    font-size: 16px;
    color: v-bind('props.inactiveColor || "rgba(31,34,38,0.5)"');
    cursor: pointer;
    transition: color 0.3s ease;
    position: relative;
    white-space: nowrap;

    &.active-class {
      color: v-bind('props.activeColor || "#4F80FF"');
      font-weight: 500;
    }
    .tab-title {
      font-size: 14px;
    }
  }

  .tab-indicator {
    position: absolute;
    bottom: 0;
    height: v-bind("`${props.lineHeight || 3}px`");
    background-color: v-bind('props.activeColor || "#1989fa"');
    border-radius: v-bind("`${props.lineHeight || 3}px`");
    will-change: width, left; /* 优化动画性能 */
    transition: all 0.3s ease; /* 默认过渡效果 */
  }
}
</style>

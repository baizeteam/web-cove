<script lang="ts" setup>
import { ref, watch, withDefaults } from "vue";
import { Button as VanButton } from "vant";

interface Props {
  /** 外部手动控制的 loading 状态 */
  loading?: boolean;
  /** 点击防抖时间（毫秒） */
  debounce?: number;
  /** 是否启用点击防抖 */
  debounceEnable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  debounce: 4000,
  debounceEnable: true,
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const innerLoading = ref(false);
const isDebouncing = ref(false);

function handleClick(event: MouseEvent) {
  if (isDebouncing.value) return;

  innerLoading.value = true;
  isDebouncing.value = true;

  emit("click", event);

  setTimeout(() => {
    innerLoading.value = false;
    isDebouncing.value = false;
  }, props.debounce);
}

// 监听外部 loading 变化（避免内外状态冲突）
watch(
  () => props.loading,
  val => {
    if (!val) innerLoading.value = false;
  }
);
</script>

<template>
  <VanButton
    :loading="innerLoading || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </VanButton>
</template>

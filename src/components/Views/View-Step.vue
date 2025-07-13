<!-- ViewStep.vue -->
<script lang="ts" setup>
import StepIcon from "@/assets/images/icon/step.png";

defineOptions({
  name: "ViewStep",
});
defineProps({
  isLast: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div class="view-step" :class="{ 'is-last': isLast }">
    <div class="view-step__circle">
      <slot name="icon">
        <ViewVantImage :src="StepIcon" :previewable="false" />
      </slot>
    </div>
    <div class="view-step__content">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.view-step {
  position: relative;
  padding-bottom: 16px;

  &:not(.is-last)::after {
    content: "";
    position: absolute;
    left: 6px;
    top: 14px;
    width: 1px;
    height: calc(100% - 14px);
    background-color: #eeeeee;
  }

  &__circle {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #eeeeee;
    left: 0;
    top: 3px;
  }

  &__content {
    margin-left: 24px;
  }
}

// 使用层推荐 h3 和 p
:deep(h3),
:deep(p) {
  font-size: 14px;
  color: #1f2226;
  line-height: 20px;
}
:deep(p) {
  margin-top: 8px;
}
:deep(h3) {
  span {
    margin-left: 16px;
  }
}
</style>

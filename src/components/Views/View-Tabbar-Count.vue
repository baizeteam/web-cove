<script lang="ts" setup>
defineOptions({
  name: "ViewTabbarCount",
});

defineProps<IProps>();

function isCountSingleDigit(count: number): boolean {
  return count && String(count).length > 1;
}

const maxCount = 99;

interface IProps {
  count: number;
}
</script>

<template>
  <div
    class="count"
    :class="[
      isCountSingleDigit(count)
        ? 'max-count round-radius'
        : 'min-count circle-radius',
    ]"
  >
    {{ count > maxCount ? `${maxCount}+` : count }}
  </div>
</template>

<style lang="less" scoped>
@height: 18px;
.count {
  background: #ff4444;
  position: absolute;
  top: -5px;
  color: #ffffff;
  font-size: 12px;
  line-height: @height;
  text-align: center;
  border: 1px solid #ffffff;
}
.round-radius {
  border-radius: 9px;
}
.min-count {
  right: -5px;
  width: 18px;
  height: @height;
}
.max-count {
  right: -8px;
  width: 24px;
  height: @height;
}
</style>

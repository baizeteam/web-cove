<!-- ViewSteps.vue -->
<script lang="ts" setup>
defineOptions({
  name: "ViewSteps",
});
</script>

<template>
  <div class="view-steps">
    <slot />
  </div>
</template>

<style lang="less" scoped>
.view-steps {
  position: relative;
  padding-top: 8px;
  //padding-left: 24px;
}
</style>

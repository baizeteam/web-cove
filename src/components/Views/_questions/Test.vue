<!-- 递归组件 -->
<script setup lang="ts">
const props = defineProps<{ node: any }>();
</script>
<template>
  <component
    :is="props.node.tag"
    v-if="props.node.type === 'image'"
    :src="props.node.src"
    :alt="props.node.alt"
    previewable
    style="width: 90vw; height: 200px; margin: 12px auto; border-radius: 8px"
  />
  <template v-else>
    {{ props.node.content }}
  </template>
</template>

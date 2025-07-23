<script setup lang="ts">
interface IProps {
  src: string;
  tip: string;
}
defineProps<IProps>();
</script>

<template>
  <div class="flex-center">
    <div>
      <ViewVantImage :src="src" />
      <div v-if="tip">
        {{ tip }}
      </div>
    </div>
  </div>
</template>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { stopDoubleScale } from "@/utils/dom.util.ts";
onMounted(() => {
  stopDoubleScale();
});
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
body {
  user-select: none;
  touch-action: manipulation;
}
</style>

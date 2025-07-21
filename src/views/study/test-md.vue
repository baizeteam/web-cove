<template>
  <ViewPageLayout>
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    <ViewMd :content="md1" />
  </ViewPageLayout>
</template>

<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import ViewMd from "@/components/Views/_questions/View-MD.vue";
import md1 from "@/assets/_markdown/yuque.md?raw";

const {
  meta: { title },
} = useRoute();
</script>

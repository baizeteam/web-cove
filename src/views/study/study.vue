<template>
  <ViewPageLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    <ViewMd src="_markdown/test.md" />
    <template #footer />
  </ViewPageLayout>
</template>
<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import ViewMd from "@/components/Views/_questions/View-Md.vue";

const {
  query: { title },
} = useRoute();
</script>

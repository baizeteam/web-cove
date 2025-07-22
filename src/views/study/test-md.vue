<template>
  <ViewPageLayout>
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    <ViewMd src="/public/_markdown/yuque/transform_typora.md" />
  </ViewPageLayout>
</template>

<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import ViewMd from "@/components/Views/_questions/View-Md.vue";

console.log(import.meta.env, "env");
const { VITE_MD_URL, VITE_PYTHON, VITE_YUQUE } = import.meta.env;
console.log(VITE_YUQUE, VITE_MD_URL, VITE_PYTHON);
const {
  meta: { title },
} = useRoute();
</script>

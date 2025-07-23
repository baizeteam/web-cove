<template>
  <ViewPageLayout>
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>

    <ViewMd :src="mdSrc" />
  </ViewPageLayout>
</template>

<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import ViewMd from "@/components/Views/_questions/View-Md.vue";
import { urlMd } from "@/utils/url.util.ts";

const mdSrc = urlMd().Python.typora + "/test.md";
console.log(mdSrc, "src");
const {
  meta: { title },
} = useRoute();
</script>

<template>
  <ViewLayout>
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>

    <ViewMd :src="mdSrc" />
  </ViewLayout>
</template>

<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import { useRoute } from "vue-router";
import ViewMd from "@/components/Views/Md/View-Md.vue";
import { urlMd } from "@/utils/url.util.ts";

const mdSrc = urlMd().Python.typora + "/test.md";
console.log(mdSrc, "src");
const {
  meta: { title },
} = useRoute();
</script>

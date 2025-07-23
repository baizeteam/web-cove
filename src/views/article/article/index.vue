<template>
  <ViewLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    全部文章
  </ViewLayout>
</template>
<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import { useRoute } from "vue-router";

const {
  meta: { title },
} = useRoute();
</script>

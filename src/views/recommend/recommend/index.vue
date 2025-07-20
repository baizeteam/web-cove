<template>
  <ViewPageLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    <div>
      <SearchInput />
      <HotCourse />
      <Article />
    </div>
    <template #footer />
  </ViewPageLayout>
</template>
<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import Article from "@/views/recommend/recommend/components/Article/index.vue";
import SearchInput from "@/views/recommend/recommend/components/SearchInput.vue";
import HotCourse from "@/views/recommend/recommend/components/HotCourse/index.vue";

const {
  meta: { title },
} = useRoute();
</script>

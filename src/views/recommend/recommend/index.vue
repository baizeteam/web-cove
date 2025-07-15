<template>
  <ViewPageLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    <div>
      <SearchInput />
      <ColumnKnowledge />
      <HotCourse />
    </div>
    <template #footer />
  </ViewPageLayout>
</template>
<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import ColumnKnowledge from "@/views/recommend/recommend/components/ColumnKnowledge.vue";
import SearchInput from "@/views/recommend/recommend/components/SearchInput.vue";
import HotCourse from "@/views/recommend/recommend/components/HotCourse.vue";

const {
  meta: { title },
} = useRoute();
</script>

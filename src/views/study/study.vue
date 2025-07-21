<template>
  <ViewPageLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    <Icon />
    <History />
  </ViewPageLayout>
</template>

<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import Icon from "@/views/study/components/Icon.vue";
import History from "@/views/study/components/History.vue";

const {
  meta: { title },
} = useRoute();
</script>

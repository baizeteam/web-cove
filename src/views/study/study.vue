<template>
  <ViewLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
      <Icon />
    </template>
    <History />
  </ViewLayout>
</template>

<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import { useRoute } from "vue-router";
import Icon from "@/views/study/components/Icon.vue";
import History from "@/views/study/components/History.vue";

const {
  meta: { title },
} = useRoute();
</script>

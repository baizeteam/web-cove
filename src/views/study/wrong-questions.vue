<template>
  <ViewLayout :footer="false">
    <template #header>
      <ViewHeader :header-config="{ title: '错题记录' }" />
    </template>

    <div class="wrong-questions-page">
      <WrongQuestions />
    </div>
  </ViewLayout>
</template>

<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import WrongQuestions from "@/components/Business/WrongQuestions/index.vue";
</script>

<style scoped>
.wrong-questions-page {
  min-height: calc(100vh - 120px);
  background: #f8fafc;
}
</style>

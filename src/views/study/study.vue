<template>
  <ViewPageLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>
    <ViewMd src="_markdown/test.md" />
    <!--     <ViewPDF src="_pdf/test.pdf" />-->
    <template #footer />
  </ViewPageLayout>
</template>
<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import ViewMd from "@/components/Views/_questions/View-MD.vue";
import { ref, onMounted } from "vue";
import { getExampleDataBrowser } from "@/request/example.request.ts";

const {
  meta: { title },
} = useRoute();

const exampleData = ref<any>(null);

onMounted(async () => {
  try {
    exampleData.value = await getExampleDataBrowser();
  } catch (e) {
    exampleData.value = "请求失败";
  }
});
</script>

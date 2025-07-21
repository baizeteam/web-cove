<template>
  <ViewPageLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
      <van-search
        v-model="searchValue"
        placeholder="python · html · java..."
        action-text="搜索"
        :background="layoutStore.header.backgroundColor"
        @focus="router.push('/search')"
      />
    </template>
    <div>
      <HotCourse />
      <Article />
    </div>
  </ViewPageLayout>
</template>
<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute, useRouter } from "vue-router";
import Article from "@/views/recommend/recommend/components/Article/index.vue";
import HotCourse from "@/views/recommend/recommend/components/HotCourse/index.vue";
import { ref } from "vue";
import { useLayoutStore } from "@/stores/layout.store.ts";

const {
  meta: { title },
} = useRoute();
const router = useRouter();

const searchValue = ref("");
const layoutStore = useLayoutStore();
</script>

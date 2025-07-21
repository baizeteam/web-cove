<template>
  <ViewPageLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
      <van-search
        v-model="searchValue"
        placeholder="python · html · java..."
        autofocus
        :background="layoutStore.header.backgroundColor"
        show-action
        right-icon=""
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </template>
  </ViewPageLayout>
</template>
<script setup lang="ts">
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import { useRoute } from "vue-router";
import { useLayoutStore } from "@/stores/layout.store.ts";
import { ref } from "vue";

const searchValue = ref("");
const layoutStore = useLayoutStore();
const {
  meta: { title },
} = useRoute();

function onSearch() {
  console.log(searchValue.value, "fff");
}
</script>

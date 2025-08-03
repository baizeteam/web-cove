<template>
  <ViewLayout :footer="true">
    <template #header>
      <ViewHeader :header-config="{ title }" />
      <van-search
        id="van-search"
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
  </ViewLayout>
</template>
<script setup lang="ts">
import ViewLayout from "@/components/Views/Layout/View-Layout.vue";
import ViewHeader from "@/components/Views/Layout/View-Header.vue";
import { useRoute } from "vue-router";
import { useLayoutStore } from "@/stores/layout.store.ts";
import { onMounted, ref } from "vue";

const searchValue = ref("");
const layoutStore = useLayoutStore();
const {
  meta: { title },
} = useRoute();

function onSearch() {
  console.log(searchValue.value, "fff");
}

onMounted(() => {
  document.getElementById("van-search").focus();
});
</script>

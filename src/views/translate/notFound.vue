<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import ViewPageLayout from "@/components/Views/View-PageLayout.vue";
import ViewHeader from "@/components/Views/View-Header.vue";
import ViewVantImage from "@/components/Views/View-VantImage.vue";
import NotFoundIcon from "@/assets/images/translate/notFound.webp";

const router = useRouter();
const {
  meta: { title },
} = useRoute();
function backHome() {
  router.replace({ path: "/" });
}
</script>

<template>
  <ViewPageLayout>
    <template #header>
      <ViewHeader :header-config="{ title }" />
    </template>

    <div class="flex-center" style="height: 60%">
      <div>
        <ViewVantImage :src="NotFoundIcon" />
        <p class="flex-center" @click="backHome">
          页面找不到了
          <span>回首页</span>
        </p>
      </div>
    </div>
  </ViewPageLayout>
</template>

<style lang="less" scoped>
p {
  font-weight: 400;
  font-size: 16px;
  color: #1f2226;
  line-height: 22px;
  height: 50px;
}
span {
  color: blue;
  padding-left: 8px;
  text-decoration: underline;
}
</style>

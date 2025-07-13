<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import ViewPageLayout from "@/components/views/View-PageLayout.vue";
import ViewHeader from "@/components/views/View-Header.vue";
// import NotFoundIcon from "@/assets/images/notFound/notFound.png";

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
      <div @click="backHome">
        <!--        <ViewVantImage :src="NotFoundIcon" />-->
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
  margin-top: -120px;
}
span {
  color: blue;
  padding-left: 8px;
  text-decoration: underline;
}
</style>

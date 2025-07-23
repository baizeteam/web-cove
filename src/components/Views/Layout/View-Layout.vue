<script lang="ts" setup>
import ViewTabBar from "@/components/Views/TabBar/View-TabBar.vue";
import { useLayoutStore } from "@/stores/layout.store.ts";
import { ref } from "vue";

interface IProps {
  footer?: boolean;
  loading?: boolean;
  overlay?: boolean;
}
defineProps<IProps>();

const layoutStore = useLayoutStore();
const footerHeight = ref(layoutStore.footer.height);
</script>

<template>
  <div class="page-layout">
    <div class="page-header">
      <slot name="header" />
    </div>
    <div
      class="page-body"
      :style="{ paddingBottom: footer ? footerHeight : 0 }"
    >
      <div
        class="page-content"
        :style="{ background: layoutStore.header.backgroundColor }"
      >
        <template v-if="!loading">
          <slot />
        </template>
        <template v-else>
          <div class="flex-center loading-container">
            <van-loading size="24px">加载中...</van-loading>
          </div>
        </template>
      </div>
      <!-- 蒙层的好处是：比如页面两个按钮是调用互斥的接口，点了一个普通的按钮loading，无法禁锢另一个按钮的点击，这时候需要蒙层 -->
      <van-overlay
        v-if="overlay"
        :custom-style="{
          background: 'transparent',
        }"
        :z-index="99999"
        :show="overlay"
      >
        <div class="overlay flex-center">
          <van-loading size="24px">正在获取数据，请稍候...</van-loading>
        </div>
      </van-overlay>
    </div>
    <div v-if="footer" class="page-footer">
      <slot name="footer">
        <ViewTabBar />
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url("@/assets/styles/modules/safe-area.less");

.page-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .page-body {
    flex: 1;
    overflow: hidden;

    .page-content {
      height: 100%;
      width: 100vw;
      padding: 0 16px;
      overflow-x: hidden;
      overflow-y: auto;
      .safe-bottom-area();
      .loading-container {
        height: 30%;
      }
    }
  }
}

.overlay {
  height: 100%;
  width: 100%;
}
</style>

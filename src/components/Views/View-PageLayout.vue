<script setup>
import ViewTabBar from "@/components/views/View-TabBar.vue";

defineProps({
  footer: {
    type: Boolean,
    default: () => false,
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
  overlay: {
    type: Boolean,
    default: () => false,
  },
});
</script>

<template>
  <div class="page-layout">
    <div class="page-header">
      <slot name="header" />
    </div>
    <div class="page-body">
      <div class="page-content">
        <template v-if="!loading">
          <slot />
        </template>
        <template v-else>
          <div class="flex-center loading-container">
            <van-loading size="24px"> 加载中... </van-loading>
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
          <van-loading size="24px"> 正在获取数据，请稍候... </van-loading>
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
  height: 100%;

  .page-body {
    flex: 1;
    overflow: hidden;

    .page-content {
      height: 100%;
      width: 100vw;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #ffffff; // 最新的 ui 稿 95%页面都 是白底
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

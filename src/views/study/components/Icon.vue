<template>
  <div class="grid">
    <div
      v-for="item in list"
      :key="item.icon"
      class="item"
      @click="item.path && router.push(item.path)"
    >
      <div class="bg align-center">
        <van-icon :name="item.icon" />
      </div>
      <div class="title">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

interface Icon {
  icon: string;
  title: string;
  path?: string;
}

const router = useRouter();
const list = ref<Icon[]>([
  { title: "错题记录", icon: "clear", path: "/test-md" },
  { title: "我的收藏", icon: "like" },
  { title: "我的课程", icon: "send-gift" },
]);
</script>

<style lang="less" scoped>
@import "@/assets/styles/modules/grid";

.grid {
  padding: 16px;
  .grid-columns-columns(3);
  .item {
    .bg {
      background: #ccc;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      margin: 0 auto;
      :deep(.van-icon) {
        margin: 0 auto;
        font-size: 22px;
      }
    }
    .title {
      padding-top: 16px;
      text-align: center;
    }
  }
}
</style>

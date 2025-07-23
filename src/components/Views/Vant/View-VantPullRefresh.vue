<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import ViewEmpty from "@/components/Views/Translate/View-Empty.vue";

interface IProps {
  loading: boolean;
  finished: boolean;
  refreshing: boolean;
  list: any[];
  noDataImg: string;
  finishedText: string;
}
const props = defineProps<IProps>();

const emit = defineEmits([
  "refresh",
  "load",
  "update:loading",
  "update:refreshing",
]);

// 下拉刷新
function onRefresh() {
  emit("refresh");
}

// 上拉加载更多
function onLoad() {
  if (!props.finished) emit("load");
}

const refreshingComputed = computed({
  get: () => props.refreshing,
  set: (value) => {
    emit("update:refreshing", value);
  },
});
// 使用 ref 作为中间状态
const loadingState = ref(props.loading);

// 监听 props.loading 变化，同步到内部状态
watch(
  () => props.loading,
  (newVal) => {
    loadingState.value = newVal;
  },
);

// 监听内部状态变化，通知父组件
watch(loadingState, (newVal) => {
  emit("update:loading", newVal);
});
</script>

<template>
  <van-pull-refresh
    v-model="refreshingComputed"
    class="tabbar-padding-bottom"
    :class="[list.length ? '' : 'no-data']"
    @refresh="onRefresh"
  >
    <template #success>
      <div>刷新成功</div>
    </template>
    <van-list
      v-model:loading="loadingState"
      :finished="props.finished"
      :finished-text="finishedText || '没有更多了'"
      @load="onLoad"
    >
      <div v-if="list.length">
        <div class="list">
          <slot :list="props.list" />
        </div>
      </div>
      <div v-else class="error justify-center">
        <ViewEmpty class="img" :src="noDataImg" tip="" />
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<style lang="less" scoped>
.list {
  padding: 0 12px;
}

.no-data {
  :deep(.van-list__finished-text) {
    margin-top: -45px;
    font-weight: 400;
    font-size: 16px;
    color: #1f2226;
    line-height: 22px;
  }
}
.error {
  margin-top: 166px;
  .img {
    width: 164px;
    height: 164px;
  }
}
</style>

<!-- tab.vue -->
<script lang="ts" setup>
import { ref } from "vue";
import type { ITab } from "@/types/views/tabs.type";

const props = defineProps<{
  tabs: ITab[];
  activeColor?: string;
  inactiveColor?: string;
}>();

const emit = defineEmits<{
  (e: "click", tab: ITab): void;
}>();

const active = ref<ITab["name"]>(props.tabs[0].name); // 内部自己管理 active

const activeColor = props.activeColor || "#4F80FF";
const inactiveColor = props.inactiveColor || "#000000";

interface IExpose {
  active: typeof active;
}
defineExpose<IExpose>({
  active,
});

function onclick(item: ITab) {
  // console.log(item, 'item')
  active.value = item.name;
  emit("click", item);
}
</script>

<template>
  <!--  {{ active }} -->
  <van-tabs v-model="active" @click-tab="onclick">
    <van-tab
      v-for="item in tabs"
      :key="item.name"
      :name="item.name"
      :title="item.title"
    >
      <template #title>
        <span
          :style="{ color: active === item.name ? activeColor : inactiveColor }"
        >
          {{ item.title }}
        </span>
      </template>
    </van-tab>
  </van-tabs>
</template>

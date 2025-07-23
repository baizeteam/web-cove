<script lang="ts" setup>
import { ref, watch } from "vue";
import { showImagePreview } from "vant";

import LogoImage from "@/assets/images/icon/logo.png";

interface Props {
  src?: string | null;
  defaultSrc?: string;
  previewable?: boolean;
  width?: string | number;
  height?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  defaultSrc: LogoImage,
  previewable: false,
  width: "90vw",
  height: "200px",
});

const displayImage = ref(props.src || props.defaultSrc);

function handlePreview() {
  if (!props.previewable) return;
  showImagePreview({
    images: [displayImage.value],
    closeable: true,
  });
}
watch(
  () => props.src,
  (newSrc) => {
    displayImage.value = newSrc || props.defaultSrc;
  },
  { immediate: true },
);
</script>

<template>
  <div class="image-container" @click="handlePreview">
    <img
      :src="displayImage"
      :alt="''"
      :width="width"
      :height="height"
      class="native-img"
      style="
        object-fit: contain;
        display: block;
        margin: 12px auto;
        border-radius: 8px;
        cursor: pointer;
        max-width: 100%;
        max-height: 100%;
      "
    />
    <slot name="badge" />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 100%;
  max-width: 100vw;
}
.native-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  background: #f6f8fa;
}
</style>

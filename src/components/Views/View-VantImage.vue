<script lang="ts" setup>
import { ref, watch } from "vue";
import { showImagePreview } from "vant";

// import LogoImage from "@/assets/images/icon/logo.png";

interface Props {
  src?: string | null;
  defaultSrc?: string;
  previewable?: boolean;
}

defineOptions({
  name: "ViewVantImage",
});

const props = withDefaults(defineProps<Props>(), {
  src: "",
  defaultSrc: "",
  previewable: false,
});

const displayImage = ref("");

function handlePreview() {
  if (!props.previewable) return;

  showImagePreview({
    images: [displayImage.value],
    closeable: true,
    // onClose: () => console.log('Preview closed'),
  });
}
watch(
  () => props.src,
  (newSrc) => {
    displayImage.value = newSrc || props.defaultSrc;
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="image-container" @click="handlePreview">
    <van-image :src="displayImage" fit="cover" :error-icon="defaultSrc" />
    <slot name="badge" />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
:deep(.van-image) {
  width: 100%;
  height: 100%;
}
</style>

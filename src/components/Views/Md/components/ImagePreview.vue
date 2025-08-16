<template>
  <!-- 全屏预览模态框 -->
  <div v-if="showFullscreen" class="image-modal" @click="closePreview">
    <img
      :src="currentImageSrc"
      class="fullscreen-image"
      @click.stop
      @load="onImageLoad"
      @error="onImageError"
    />
    <div class="image-controls">
      <button class="close-button" @click="closePreview">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  containerSelector?: string;
}

const props = withDefaults(defineProps<Props>(), {
  containerSelector: ".markdown-content",
});

const showFullscreen = ref(false);
const currentImageSrc = ref("");

// 处理图片点击事件
const handleImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === "IMG") {
    currentImageSrc.value = target.getAttribute("src") || "";
    showFullscreen.value = true;
    e.stopPropagation();
  }
};

// 关闭预览
const closePreview = () => {
  showFullscreen.value = false;
  currentImageSrc.value = "";
};

// 图片加载完成
const onImageLoad = () => {
  console.log("图片预览加载完成");
};

// 图片加载失败
const onImageError = () => {
  console.error("图片预览加载失败");
};

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && showFullscreen.value) {
    closePreview();
  }
};

// 设置图片点击监听
const setupImageClickListener = () => {
  const container = document.querySelector(props.containerSelector);
  if (container) {
    container.addEventListener("click", handleImageClick);
  }
};

// 移除图片点击监听
const removeImageClickListener = () => {
  const container = document.querySelector(props.containerSelector);
  if (container) {
    container.removeEventListener("click", handleImageClick);
  }
};

onMounted(() => {
  setupImageClickListener();
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  removeImageClickListener();
  document.removeEventListener("keydown", handleKeyDown);
});

// 暴露方法给父组件
defineExpose({
  setupImageClickListener,
  removeImageClickListener,
  closePreview,
});
</script>

<style scoped>
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.fullscreen-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  cursor: default;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.image-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10000;
}

.close-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.close-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fullscreen-image {
    max-width: 95%;
    max-height: 95%;
  }

  .image-controls {
    top: 10px;
    right: 10px;
  }

  .close-button {
    width: 40px;
    height: 40px;
  }

  .close-button svg {
    width: 16px;
    height: 16px;
  }
}
</style>

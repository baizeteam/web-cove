<script lang="ts" setup>
import { nextTick, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useLayoutStore } from "@/stores/layout.store.ts";

defineProps({
  headerConfig: {
    type: Object,
    default: () => {
      return {
        showBackBtn: false,
        showReplaceBtn: false,
        showFileBtn: false,
        showEditBtn: false,
        showUploadBtn: false,
        showHomeBtn: false,
        title: "",
      };
    },
  },
});
const emit = defineEmits(["back", "file", "edit", "upload", "home"]);
const layoutStore = useLayoutStore();
const { header } = toRefs(layoutStore);

const router = useRouter();
const isCanEmit = ref(true);
function emitEvent(type: any, data = {}) {
  if (!isCanEmit.value) return;
  emit(type, data);
  isCanEmit.value = false;
  setTimeout(() => {
    isCanEmit.value = true;
  }, 500);
}
const showHeader = ref(true); // 如果app之外内嵌关闭即可

function onBack() {
  nextTick(() => {
    router.back();
  });
}
</script>

<template>
  <div
    v-if="showHeader"
    :style="{ height: header.height, background: header.backgroundColor }"
    class="header-container"
  >
    <div class="left-btn">
      <div v-if="headerConfig.showBackBtn" class="back-btn" @click="onBack" />
      <div
        v-if="headerConfig.showReplaceBtn"
        class="back-btn"
        @click="emitEvent('replace')"
      />
      <div
        v-if="headerConfig.showFileBtn"
        class="file-btn"
        @click="emitEvent('file')"
      />
    </div>
    <div class="title flex-center">
      {{ headerConfig.title }}
    </div>
    <div class="right-btn">
      <div
        v-if="headerConfig.showEditBtn"
        class="edit-btn"
        @click="emitEvent('edit')"
      />
      <div
        v-if="headerConfig.showUploadBtn"
        class="upload-btn"
        @click="emitEvent('upload')"
      />
      <div
        v-if="headerConfig.showHomeBtn"
        class="home-btn"
        @click="emitEvent('home')"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.header-container {
  display: flex;
  backdrop-filter: blur(10px);
  align-items: center;

  .left-btn {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    .back-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/images/header/back-btn.png");
      background-size: 9px 17px;
      background-position: center center;
      background-repeat: no-repeat;
      margin-left: 4px;
    }

    .file-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/images/header/file-btn.png");
      background-size: 100% 100%;
      margin-left: 16px;
    }
  }

  .right-btn {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .edit-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/images/header/edit-btn.png");
      background-size: 100% 100%;
      margin-right: 16px;
    }

    .upload-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/images/header/upload-btn.png");
      background-size: 100% 100%;
      margin-right: 16px;
    }

    .home-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/images/header/home-btn.png");
      background-size: 100% 100%;
      margin-right: 16px;
    }
  }

  .title {
    width: 182px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 100%;
    font-weight: 400;
    font-size: 17px;
    color: #000000;
    text-align: center;
    font-style: normal;
  }
}
</style>

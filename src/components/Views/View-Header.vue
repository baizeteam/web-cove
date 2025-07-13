<script lang="ts" setup>
import { nextTick, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useLayoutStore } from "@/stores/layout.store";

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
// 测试用例

// (() => {
//   layoutStore.setLayout('header', {
//     height: '45px',
//   })
//   layoutStore.setLayout('a', {
//     height: '1',
//   })
//   layoutStore.setLayout('header', {
//     a: '1',
//   })
//   console.log(header.value)
// })()

const router = useRouter();
const isCanEmit = ref(true);
function emitEvent(type, data = {}) {
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
  <div v-if="showHeader" :style="{ height: header.height }" class="page-header">
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
    <div class="title">
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
.page-header {
  display: flex;
  //height: 44px;
  background: #ffffff;
  backdrop-filter: blur(10px);
  align-items: center;

  .left-btn {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    .back-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/header/back-btn.png");
      background-size: 9px 17px;
      background-position: center center;
      background-repeat: no-repeat;
      margin-left: 4px;
    }

    .file-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/header/file-btn.png");
      background-size: 100% 100%;
      margin-left: 16px;
    }
  }

  .right-btn {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .edit-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/header/edit-btn.png");
      background-size: 100% 100%;
      margin-right: 16px;
    }

    .upload-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/header/upload-btn.png");
      background-size: 100% 100%;
      margin-right: 16px;
    }

    .home-btn {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/header/home-btn.png");
      background-size: 100% 100%;
      margin-right: 16px;
    }
  }

  .title {
    width: 182px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 17px;
    color: #000000;
    //line-height: 44px;
    text-align: center;
    font-style: normal;
  }
}
</style>

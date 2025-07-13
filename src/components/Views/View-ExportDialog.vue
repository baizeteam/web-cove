<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: true },
  hideTxt: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "exportFormType"]);
const wordIcon = new URL("@/assets/images/icon/word-icon.png", import.meta.url)
  .href;
const pdfIcon = new URL("@/assets/images/icon/pdf-icon.png", import.meta.url)
  .href;
const txtIcon = new URL("@/assets/images/icon/txt-icon.png", import.meta.url)
  .href;
const activeType = ref("word");
function changeType(type) {
  activeType.value = type;
}
function submitEvent() {
  if (activeType.value) {
    emit("update:modelValue", false);
    emit("exportFormType", activeType.value);
  }
}
function cancelEvent() {
  console.log("🚀 ~ props:", props);

  emit("update:modelValue", false);
}
</script>

<template>
  <!--  eslint-disable-next-line vue/no-mutating-props  -->
  <van-popup v-model:show="props.modelValue" class="v-popup" position="bottom">
    <div class="flex flex-align-center flex-justify-between">
      <span class="text">请选择要导出的文档类型</span>
      <span class="close-btn" @click="cancelEvent" />
    </div>
    <div
      class="type flex flex-align-center flex-justify-between"
      :class="!props.hideTxt ? 'show-txt-cont' : ''"
    >
      <div
        :class="activeType === 'word' ? 'checked' : ''"
        class="type-item flex flex-column flex-align-center flex-justify-center"
        @click="changeType('word')"
      >
        <van-image :src="wordIcon" />
        <span>Word文件</span>
      </div>
      <div
        v-if="!props.hideTxt"
        :class="activeType === 'txt' ? 'checked' : ''"
        class="type-item flex flex-column flex-align-center flex-justify-center"
        @click="changeType('txt')"
      >
        <van-image :src="txtIcon" />
        <span>TXT文件</span>
      </div>
      <div
        :class="activeType === 'pdf' ? 'checked' : ''"
        class="type-item flex flex-column flex-align-center flex-justify-center"
        @click="changeType('pdf')"
      >
        <van-image :src="pdfIcon" />
        <span>PDF文件</span>
      </div>
    </div>
    <div class="btn-wrap flex flex-justify-between">
      <div class="cancel-btn" @click="cancelEvent">取消</div>
      <div class="submit-btn" @click="submitEvent">确定</div>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.van-overlay {
  background: rgb(0 0 0 / 50%);
}

.v-popup {
  width: 375px;
  height: 280px;
  padding: 24px 16px;
  background: #fff;
  border-radius: 14px 14px 0 0;

  .text {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    color: #1f2226;
  }

  .close-btn {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-image: url("@/assets/images/icon/close.png");
    background-size: 100% 100%;
  }

  .type {
    margin-top: 16px;

    &-item {
      box-sizing: border-box;
      gap: 6px;
      width: 108px;
      height: 110px;
      background: #fff;
      border: 1px solid #ececec;
      border-radius: 12px;
      flex: 1;

      &:nth-child(1),
      &:nth-child(2) {
        margin-right: 10px;
      }

      .van-image {
        width: 56px;
        height: 56px;
      }

      span {
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        color: #1f2226;
      }
    }

    .checked {
      position: relative;
      border: 2px solid #4f80ff;

      span {
        font-weight: 500;
      }

      &::after {
        position: absolute;
        right: -1px;
        bottom: -1px;
        display: inline-block;
        width: 20px;
        height: 20px;
        content: "";
        background: url("@/assets/images/icon/checked.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .btn-wrap {
    margin-top: 22px;

    .cancel-btn {
      width: 166px;
      height: 46px;
      font-size: 16px;
      font-weight: 400;
      line-height: 46px;
      color: rgb(31 34 38 / 80%);
      text-align: center;
      border: 1px solid #eaeaeb;
      border-radius: 23px;
    }

    .submit-btn {
      width: 166px;
      height: 46px;
      font-size: 16px;
      font-weight: 500;
      line-height: 46px;
      color: #fff;
      text-align: center;
      background: #4f80ff;
      border-radius: 23px;
    }
  }
}
</style>

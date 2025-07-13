<script setup>
import { tipMessage, tipType } from "@/utils/tip";
</script>

<template>
  <div class="page-tip">
    <div class="tip-cont">
      <div class="left-icon" :class="tipType" />
      <div class="message">
        {{ tipMessage }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-tip {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  top: 0;
  // background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;

  .tip-cont {
    display: flex;
    height: 46px;
    padding: 0 12px;
    background: rgba(31, 34, 38, 0.8);
    border-radius: 8px;
    align-items: center;
    // justify-content: center;
    min-width: 114px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;

    .left-icon {
      width: 20px;
      height: 20px;
      background-size: 100% 100%;
      margin-right: 6px;

      &.success {
        background-image: url("@/assets/images/tips/success.png");
      }

      &.error {
        background-image: url("@/assets/images/tips/error.png");
      }

      &.warning {
        display: none;
      }
    }

    .message {
      flex: 1;
      text-align: center;
    }
  }
}
</style>

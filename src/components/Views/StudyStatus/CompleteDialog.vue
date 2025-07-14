<template>
  <van-popup v-model:show="showDialog" position="center" round>
    <div class="dialog-container">
      <div class="dialog-content">
        <p class="title">恭喜你已完成本小节所有内容~！</p>
        <div class="stars">
          <van-icon name="star" color="#ffd100" size="20" />
          <van-icon name="star" color="#ffd100" size="20" />
          <van-icon name="star" color="#ffd100" size="20" />
        </div>
        <div class="btn-group">
          <van-button size="small" type="info" @click="onBackCatalog"
            >返回目录</van-button
          >
          <van-button size="small" type="primary" @click="onContinueNext"
            >继续下一节</van-button
          >
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref } from "vue";
import { VanPopup, VanIcon, VanButton } from "vant";

const showDialog = ref(false); // 控制弹窗显示隐藏，可从父组件传入或在内部管理

const onBackCatalog = () => {
  // 返回目录逻辑，比如路由跳转等，可根据实际需求完善
  console.log("返回目录");
  showDialog.value = false;
};

const onContinueNext = () => {
  // 继续下一节逻辑，比如路由跳转等，可根据实际需求完善
  console.log("继续下一节");
  showDialog.value = false;
};

// 对外暴露控制弹窗显示的方法，方便父组件调用
const openDialog = () => {
  showDialog.value = true;
};

defineExpose({
  openDialog,
});
</script>

<style scoped>
.dialog-container {
  width: 80%;
  max-width: 320px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.btn-group {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
</style>

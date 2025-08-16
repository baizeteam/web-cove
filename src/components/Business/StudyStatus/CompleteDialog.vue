<template>
  <van-popup
    v-model:show="showDialog"
    style="width: 80vw"
    position="center"
    round
  >
    <div class="dialog-container">
      <div class="dialog-content">
        <p class="title">恭喜你已完成本节所有内容！</p>
        <div class="stars">
          <van-icon name="star" color="#ffd100" size="20" />
          <van-icon name="star" color="#ffd100" size="20" />
          <van-icon name="star" color="#ffd100" size="20" />
        </div>
        <!-- 使用div实现的按钮组 -->
        <div class="btn-group">
          <div class="custom-btn left-btn" @click="onBackCatalog">返回</div>
          <div class="custom-btn right-btn" @click="onContinueNext">
            继续下一节
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const showDialog = ref(false);

const onBackCatalog = () => {
  console.log("返回目录");
  showDialog.value = false;
};

const onContinueNext = () => {
  console.log("继续下一节");
  showDialog.value = false;
};

const openDialog = () => {
  showDialog.value = true;
};

defineExpose({
  openDialog,
});
</script>

<style scoped>
.dialog-container {
  width: 100%;
  box-sizing: border-box;
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
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

/* 自定义按钮组样式 */
.btn-group {
  display: flex;
  width: 100%;
  position: relative;
  margin-top: 10px;
  border-top: 1px solid #ddd;
}

/* 自定义按钮基础样式 */
.custom-btn {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

/* 左侧按钮样式 */
.left-btn {
  color: #666;
}

/* 右侧按钮样式 */
.right-btn {
  color: #409eff; /* 浅蓝色 */
}

/* 鼠标悬停效果 */
.custom-btn:hover {
  background-color: #f5f7fa;
}

/* 中间分割线 */
.btn-group::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 10%;
  height: 80%;
  width: 1px;
  background-color: #ddd;
  transform: translateX(-50%);
}
</style>

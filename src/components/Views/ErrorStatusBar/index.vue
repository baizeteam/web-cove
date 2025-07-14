<template>
  <div class="error-status-bar">
    <div class="left-section">
      <van-icon name="chat-o" class="icon-comment" />
      <span class="error-text">可以使用 raise 语句引发异常</span>
      <van-button
        type="danger"
        size="small"
        class="error-library-btn"
        @click="openErrorLibrary"
      >
        错题库
      </van-button>
    </div>
    <div class="right-section">
      <van-button
        type="danger"
        size="small"
        class="reload-btn"
        @click="handleReload"
      >
        <van-icon name="refresh" />
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const openErrorLibrary = () => {
  console.log("打开错题库");
  // 实际项目中可使用路由跳转或弹出层
};

const handleReload = () => {
  console.log("执行刷新操作");
  // 实际项目中可添加数据重置逻辑
};
</script>

<style scoped>
.error-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8d7da;
  color: #721c24;
  padding: 8px 16px;
  border-top: 1px solid #f5c6cb;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.left-section {
  display: flex;
  align-items: center;
}

.icon-comment {
  margin-right: 8px;
}

.error-text {
  margin-right: 12px;
  font-size: 14px;
}

.error-library-btn {
  margin-right: 10px;
}

.reload-btn {
  width: 32px;
}
</style>

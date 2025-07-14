<template>
  <div class="bottom-icon-bar">
    <van-icon name="chat-o" size="20" color="#999" />
    <div class="white-placeholder"></div>
    <van-icon name="play-circle-o" size="28" color="#6464e5" />
  </div>
</template>

<style scoped>
.bottom-icon-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #fff;
  border-top: 1px solid #f5f5f5;
}
.white-placeholder {
  flex: 1;
  height: 24px;
}
</style>

<template>
  <div>
    <TopProgress />
    <!-- 页面其他内容，比如题目展示区域 -->
    <div class="question-area">
      <p>填空，创建一个循环，将x的值递增2并打印偶数值。</p>
      <pre><code>x = 0
while x &lt;= 20 :
  print(x)
  x += 2</code></pre>
      <van-button type="primary" @click="openBottomPopup">查看结果</van-button>
    </div>
    <BottomPopup ref="bottomPopupRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import TopProgress from "./TopProgress.vue";
import BottomPopup from "./BottomPopup.vue";

const bottomPopupRef = ref(null);

const openBottomPopup = () => {
  bottomPopupRef.value.openPopup();
};
</script>

<style scoped>
.question-area {
  padding: 16px;
}
</style>

<template>
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    :style="{ background: '#d3fbe3' }"
    round
  >
    <div class="bottom-popup">
      <div class="popup-header">
        <van-icon name="success-circle" color="#07c160" size="20" />
        <span class="status-text">正确</span>
      </div>
      <div class="reward">
        <p>奖励一下：</p>
        <span class="exp-tag">
          <van-icon
            name="fire-o"
            color="#fff"
            size="14"
            style="margin-right: 2px"
          />
          +5经验
        </span>
        <span class="coin-tag">
          <van-icon
            name="gold-coin"
            color="#fff"
            size="14"
            style="margin-right: 2px"
          />
          +1积分
        </span>
      </div>
      <div class="code-example">
        <pre><code>{{ codeContent }}</code></pre>
      </div>
      <div class="explain">
        {{ explainText }}
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref } from "vue";
import { VanPopup, VanIcon } from "vant";

const showPopup = ref(false);
const codeContent = ref(`x = 0
while x <= 20:
  print(x)
  x += 2`);
const explainText = ref("考察while的语法");

// 对外暴露打开弹窗的方法
const openPopup = () => {
  showPopup.value = true;
};

defineExpose({
  openPopup,
});
</script>

<style scoped>
.bottom-popup {
  padding: 16px;
}
.popup-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.status-text {
  margin-left: 8px;
  font-size: 14px;
  color: #07c160;
}
.reward {
  margin-bottom: 12px;
  font-size: 14px;
}
.exp-tag {
  background-color: #07c160;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
}
.coin-tag {
  background-color: #ffc83d;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}
.code-example {
  background-color: #f8f8f8;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #333;
}
.explain {
  font-size: 12px;
  color: #666;
}
</style>

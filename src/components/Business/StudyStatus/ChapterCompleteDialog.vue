<template>
  <van-popup
    v-model:show="visible"
    :style="{ width: '90vw', maxWidth: '400px' }"
    position="center"
    round
    :close-on-click-overlay="false"
    :lock-scroll="true"
    class="chapter-complete-popup"
  >
    <div class="dialog-container">
      <!-- 成功动画图标 -->
      <div class="success-animation">
        <div class="success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="#4CAF50"
              stroke-width="4"
              fill="#E8F5E9"
            />
            <path
              d="M20 32L28 40L44 24"
              stroke="#4CAF50"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="content">
        <h2 class="title">🎉 恭喜完成！</h2>
        <p class="subtitle">{{ chapterTitle || "本章节" }}学习完成</p>

        <!-- 成就展示 -->
        <div class="achievement">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-number">{{ completedSteps }}</span>
              <span class="stat-label">步骤完成</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">{{ totalTime }}</span>
              <span class="stat-label">学习时长</span>
            </div>
          </div>

          <!-- 星级评价 -->
          <div class="rating">
            <div class="stars">
              <van-icon
                v-for="i in 5"
                :key="i"
                name="star"
                :color="i <= rating ? '#FFD700' : '#E0E0E0'"
                size="20"
                class="star-icon"
              />
            </div>
            <span class="rating-text">优秀表现！</span>
          </div>
        </div>

        <!-- 下一步提示 -->
        <div v-if="hasNextChapter" class="next-hint">
          <p class="hint-text">
            <van-icon name="arrow-right" size="14" color="#666" />
            下一章节：{{ nextChapterTitle }}
          </p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button class="action-btn secondary" @click="handleBackToCatalog">
          <van-icon name="arrow-left" size="16" />
          返回目录
        </button>
        <button
          class="action-btn primary"
          :disabled="!hasNextChapter"
          @click="handleContinueNext"
        >
          <van-icon name="arrow" size="16" />
          {{ hasNextChapter ? "继续下一章" : "已完成全部" }}
        </button>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Props {
  chapterTitle?: string;
  completedSteps?: number;
  totalTime?: string;
  rating?: number;
  hasNextChapter?: boolean;
  nextChapterTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  chapterTitle: "",
  completedSteps: 0,
  totalTime: "0分钟",
  rating: 5,
  hasNextChapter: false,
  nextChapterTitle: "",
});

const emit = defineEmits(["backToCatalog", "continueNext", "close"]);
const visible = ref(false);

// 显示弹窗
const show = () => {
  visible.value = true;
};

// 隐藏弹窗
const hide = () => {
  visible.value = false;
  emit("close");
};

// 返回目录
const handleBackToCatalog = () => {
  hide();
  emit("backToCatalog");
};

// 继续下一章
const handleContinueNext = () => {
  if (props.hasNextChapter) {
    hide();
    emit("continueNext");
  }
};

// 暴露方法给父组件
defineExpose({
  show,
  hide,
});
</script>

<style lang="less" scoped>
.chapter-complete-popup {
  :deep(.van-popup) {
    overflow: visible;
  }
}

.dialog-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
}

.success-animation {
  position: relative;
  z-index: 1;
  padding: 32px 32px 16px;
  display: flex;
  justify-content: center;

  .success-icon {
    animation: successPulse 0.6s ease-out;

    svg {
      filter: drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3));
    }
  }
}

.content {
  position: relative;
  z-index: 1;
  padding: 0 32px 24px;
  text-align: center;

  .title {
    font-size: 24px;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 8px;
    line-height: 1.3;
  }

  .subtitle {
    font-size: 16px;
    color: #666;
    margin: 0 0 24px;
  }
}

.achievement {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  .stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 16px;

    .stat-item {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: #4c51bf;
        line-height: 1;
      }

      .stat-label {
        display: block;
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .rating {
    text-align: center;

    .stars {
      display: flex;
      justify-content: center;
      gap: 4px;
      margin-bottom: 8px;

      .star-icon {
        animation: starFadeIn 0.3s ease-out;
        animation-fill-mode: both;

        //@for @i from 1 through 5 {
        //  &:nth-child(@{i}) {
        //    //animation-delay: @{i * 0.1}s;
        //  }
        //}
      }
    }

    .rating-text {
      font-size: 14px;
      color: #4c51bf;
      font-weight: 600;
    }
  }
}

.next-hint {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;

  .hint-text {
    font-size: 14px;
    color: #4c51bf;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
}

.actions {
  position: relative;
  z-index: 1;
  padding: 0 32px 32px;
  display: flex;
  gap: 12px;

  .action-btn {
    flex: 1;
    height: 48px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &.secondary {
      background: rgba(255, 255, 255, 0.8);
      color: #666;
      border: 1px solid rgba(0, 0, 0, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
      }

      &:disabled {
        background: #ccc;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 动画定义
@keyframes successPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes starFadeIn {
  0% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .dialog-container {
    margin: 20px;
  }

  .success-animation,
  .content,
  .actions {
    padding-left: 20px;
    padding-right: 20px;
  }

  .content .title {
    font-size: 20px;
  }

  .achievement .stats {
    gap: 16px;

    .stat-item .stat-number {
      font-size: 20px;
    }
  }

  .actions .action-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>

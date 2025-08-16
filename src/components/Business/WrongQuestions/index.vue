<template>
  <div class="wrong-questions-container">
    <div class="header">
      <h2 class="title">错题本</h2>
      <div class="stats">总计 {{ wrongQuestionStats.totalWrong }} 道错题</div>
    </div>

    <!-- 语言筛选 -->
    <div class="language-filter">
      <van-button
        :type="selectedLanguage === 'all' ? 'primary' : 'default'"
        size="small"
        @click="selectedLanguage = 'all'"
      >
        全部 ({{ wrongQuestionStats.totalWrong }})
      </van-button>
      <van-button
        v-for="(count, language) in wrongQuestionStats.byLanguage"
        :key="language"
        :type="selectedLanguage === language ? 'primary' : 'default'"
        size="small"
        @click="selectedLanguage = language as LanguageType"
      >
        {{ getLanguageText(language as LanguageType) }} ({{ count }})
      </van-button>
    </div>

    <!-- 错题列表 -->
    <div v-if="filteredWrongQuestions.length === 0" class="empty-state">
      <van-empty description="暂无错题记录">
        <van-button type="primary" size="small" @click="goToRecommend">
          去做题
        </van-button>
      </van-empty>
    </div>

    <div v-else class="wrong-questions-list">
      <div
        v-for="wrongQuestion in filteredWrongQuestions"
        :key="wrongQuestion.id"
        class="wrong-question-item"
        @click="goToQuestion(wrongQuestion)"
      >
        <div class="question-header">
          <div class="language-tag">
            {{ getLanguageText(wrongQuestion.language) }}
          </div>
          <div class="question-time">
            {{ formatQuestionTime(wrongQuestion.timestamp) }}
          </div>
        </div>

        <div class="question-content">
          <h4 class="question-title">{{ wrongQuestion.question }}</h4>
          <div class="question-location">
            第{{ wrongQuestion.chapterId }}章 · 步骤{{ wrongQuestion.stepId }}
          </div>
        </div>

        <div class="answer-comparison">
          <div class="user-answer wrong">
            <span class="label">你的答案:</span>
            <span class="value">{{ wrongQuestion.userAnswer }}</span>
          </div>
          <div class="correct-answer correct">
            <span class="label">正确答案:</span>
            <span class="value">{{ wrongQuestion.correctAnswer }}</span>
          </div>
        </div>

        <div class="question-meta">
          <span class="attempts">错误 {{ wrongQuestion.attempts }} 次</span>
          <van-button
            type="danger"
            size="mini"
            @click.stop="removeQuestion(wrongQuestion)"
          >
            删除
          </van-button>
        </div>
      </div>
    </div>

    <!-- 清除按钮 -->
    <div v-if="filteredWrongQuestions.length > 0" class="actions">
      <van-button type="warning" size="large" @click="clearWrongQuestions">
        清除{{
          selectedLanguage === "all"
            ? "全部"
            : getLanguageText(selectedLanguage)
        }}错题
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAllWrongQuestions,
  getWrongQuestionStats,
  clearAllWrongQuestions,
  clearWrongQuestionsByLanguage,
  removeWrongQuestion,
  formatQuestionTime,
} from "@/utils/wrong-questions.util";
import type {
  WrongQuestion,
  WrongQuestionStats,
} from "@/utils/wrong-questions.util";
import type { LanguageType } from "@/data/courses";

const router = useRouter();

// 响应式数据
const wrongQuestions = ref<WrongQuestion[]>([]);
const wrongQuestionStats = ref<WrongQuestionStats>({
  totalWrong: 0,
  byLanguage: {},
  recentWrong: [],
});
const selectedLanguage = ref<LanguageType | "all">("all");

// 计算属性
const filteredWrongQuestions = computed(() => {
  if (selectedLanguage.value === "all") {
    return wrongQuestions.value;
  }
  return wrongQuestions.value.filter(
    q => q.language === selectedLanguage.value
  );
});

// 方法
const loadWrongQuestions = () => {
  wrongQuestions.value = getAllWrongQuestions();
  wrongQuestionStats.value = getWrongQuestionStats();
};

const getLanguageText = (language: LanguageType): string => {
  const languageMap = {
    python: "Python",
    javascript: "JavaScript",
    html: "HTML & CSS",
    css: "CSS",
  };
  return languageMap[language] || language;
};

const goToQuestion = (wrongQuestion: WrongQuestion) => {
  // 跳转到错题所在的学习页面
  router.push(
    `/step/${wrongQuestion.language}/${wrongQuestion.courseId}/${wrongQuestion.chapterId}/${wrongQuestion.stepId}`
  );
};

const removeQuestion = (wrongQuestion: WrongQuestion) => {
  removeWrongQuestion(
    wrongQuestion.courseId,
    wrongQuestion.chapterId,
    wrongQuestion.stepId
  );
  loadWrongQuestions(); // 重新加载数据
};

const clearWrongQuestions = () => {
  if (selectedLanguage.value === "all") {
    clearAllWrongQuestions();
  } else {
    clearWrongQuestionsByLanguage(selectedLanguage.value);
  }
  loadWrongQuestions(); // 重新加载数据
};

const goToRecommend = () => {
  router.push("/recommend");
};

// 生命周期
onMounted(() => {
  loadWrongQuestions();
});

// 监听错题更新事件
window.addEventListener("wrong-questions-updated", () => {
  loadWrongQuestions();
});
</script>

<style scoped>
.wrong-questions-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.stats {
  font-size: 14px;
  color: #718096;
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 12px;
}

.language-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.wrong-questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wrong-question-item {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wrong-question-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #f56565;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.language-tag {
  background: #fed7d7;
  color: #c53030;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.question-time {
  font-size: 12px;
  color: #a0aec0;
}

.question-content {
  margin-bottom: 16px;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.question-location {
  font-size: 14px;
  color: #718096;
  background: #f7fafc;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
}

.answer-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.user-answer,
.correct-answer {
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-answer.wrong {
  background: #fef2f2;
  border: 1px solid #fc8181;
}

.correct-answer.correct {
  background: #f0fff4;
  border: 1px solid #9ae6b4;
}

.label {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.wrong .label {
  color: #c53030;
}

.correct .label {
  color: #22543d;
}

.value {
  font-size: 16px;
  font-weight: 700;
}

.wrong .value {
  color: #e53e3e;
}

.correct .value {
  color: #38a169;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attempts {
  font-size: 12px;
  color: #a0aec0;
  background: #edf2f7;
  padding: 4px 8px;
  border-radius: 8px;
}

.actions {
  margin-top: 32px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .wrong-questions-container {
    padding: 12px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .language-filter {
    gap: 6px;
  }

  .wrong-question-item {
    padding: 16px;
  }

  .answer-comparison {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .question-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .wrong-questions-container {
    background: #1a202c;
  }

  .title {
    color: #f7fafc;
  }

  .wrong-question-item {
    background: #2d3748;
    border-color: #4a5568;
  }

  .wrong-question-item:hover {
    border-color: #f56565;
  }

  .question-title {
    color: #f7fafc;
  }

  .question-location {
    background: #1a202c;
    color: #cbd5e0;
  }

  .stats {
    background: #2d3748;
    color: #cbd5e0;
  }
}
</style>

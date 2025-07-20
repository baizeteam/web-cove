<template>
  <div class="course-container">
    <h2 class="course-title">热门课程TOP</h2>
    <div
      v-for="(course, index) in courses"
      :key="index"
      class="course-item align-center"
    >
      <div class="left global-image">
        <div :class="['course-badge', `course-badge--${course.badgeType}`]">
          <span class="badge-text">{{ course.badgeText }}</span>
        </div>
      </div>
      <div class="right">
        <h3 class="course-name">{{ course.title }}</h3>
        <p class="course-info">{{ course.learnInfo }}</p>
        <p class="course-desc">{{ course.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const courses = [
  {
    badgeType: "new",
    badgeText: "2025新升级",
    title: "Python3 入门课程",
    learnInfo: "467745人学习 · 学练课",
    desc: "爬虫?机器学习? Python...",
  },
  {
    badgeType: "series",
    badgeText: "零基础入门系列",
    title: "零基础入门学Python",
    learnInfo: "39192人学习 · 视频课",
    desc: "涵盖python的入门到实战",
  },
  {
    badgeType: "basic",
    badgeText: "0基础",
    title: "Python3零基础入门先导...",
    learnInfo: "4793人学习 · 学练课",
    desc: "0基础的python入门先导课",
  },
];
</script>

<style lang="less" scoped>
.course-container {
  width: 100%;
  padding: 10px 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.course-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.course-item {
  margin-bottom: 24px;
  overflow: hidden;
  .left {
    background-image: url("./img.png");
    margin-right: 10px;
  }
  .right {
    width: calc(100% - 100px);
  }
}

.course-badge {
  display: inline-block;
  padding: 2px 4px;
  border-radius: 4px;
  color: #fff;
  font-size: 8px;
}

/* 不同 badge 类型样式 */
.course-badge--new {
  background-color: #28a745; /* 新升级标识颜色，可自定义 */
}

.course-badge--series {
  background-color: #17a2b8; /* 系列课程标识颜色，可自定义 */
}

.course-badge--basic {
  background-color: #ffc107; /* 0基础标识颜色，可自定义 */
}

.badge-text {
  vertical-align: middle;
}

.course-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.course-info {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.course-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}
</style>

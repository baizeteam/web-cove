<template>
  <div class="section-header">
    <h2 class="section-title">最近学习</h2>
    <div class="more" @click="handleViewMore">
      查看更多 <van-icon name="arrow" />
    </div>
  </div>

  <div>
    <div
      v-for="(course, index) in courses"
      :key="index"
      class="course-item align-center"
    >
      <div class="left global-image"></div>
      <div class="right">
        <h3 class="course-name">{{ course.title }}</h3>
        <p class="course-total">
          共{{ course.total }}节 | 已学{{ course.learned }}节
        </p>
        <p>
          <van-progress
            :percentage="(course.learned / course.total) * 100"
            stroke-width="8"
          />
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

interface Course {
  title: string;
  total: number;
  learned: number;
  icon?: string;
}
const courses = ref<Course[]>([
  {
    title: "Python3 入门课程",
    total: 80,
    learned: 0,
  },
  {
    title: "Java 入门课程",
    total: 20,
    learned: 1,
  },
]);
function handleViewMore() {}
</script>

<style lang="less" scoped>
.course-item {
  margin-bottom: 24px;
  overflow: hidden;
  .left {
    background-image: url("../../recommend/recommend/components/HotCourse/img.png");
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

<template>
  <div class="hot-course">
    <h2 class="section-title">大家都在学</h2>
    <van-swipe :loop="false" :width="300" :auto-play="false">
      <van-swipe-item
        v-for="course in courseList"
        :key="course.id"
        class="course-item"
      >
        <van-card
          :title="course.title"
          :desc="course.desc"
          :thumb="course.thumb"
          class="course-card"
        />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

// 定义课程数据类型
interface CourseItem {
  id: number;
  title: string;
  desc: string;
  thumb: string;
  duration: string;
  teacher: string;
}

const courseList = ref<CourseItem[]>([]);

// 模拟API请求获取课程数据
const fetchCourseList = async () => {
  // 实际项目中替换为真实API调用
  return [
    {
      id: 1,
      title: "Web前端开发实战",
      desc: "从HTML到React全栈开发",
      thumb: "https://picsum.photos/seed/course1/300/200",
      duration: "40小时",
      teacher: "张教授",
    },
    {
      id: 2,
      title: "Python数据分析",
      desc: "Pandas/Numpy实战教程",
      thumb: "https://picsum.photos/seed/course2/300/200",
      duration: "35小时",
      teacher: "李博士",
    },
    {
      id: 3,
      title: "Java架构师",
      desc: "微服务与Spring Cloud",
      thumb: "https://picsum.photos/seed/course3/300/200",
      duration: "50小时",
      teacher: "王工程师",
    },
  ];
};

onMounted(async () => {
  courseList.value = await fetchCourseList();
});
</script>

<style scoped>
.course-list {
  overflow-x: auto;
  white-space: nowrap;
}

.course-item {
  display: inline-block;
  width: 280px;
  margin-right: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0;
}
</style>

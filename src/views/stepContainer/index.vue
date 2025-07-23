<template>
  <div class="step-container">
    <!-- 动态渲染组件 -->
    <component
      :is="currentComponent"
      v-bind="componentProps"
      @next="handleNext"
      @prev="handlePrev"
    />

    <!-- 导航按钮（可选，根据需求控制显隐） -->
    <div class="nav">
      <button v-if="canPrev" @click="handlePrev">上一步</button>
      <button v-if="canNext" @click="handleNext">下一步</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import ViewMd from "@/components/Views/Md/View-Md.vue";
import ChoiceQuestion from "@/components/Business/ChoiceQuestion/index.vue";
import { vantConfirm } from "@/utils/vant.util.ts";

defineOptions({
  name: "StepContainer",
});
const props = defineProps({
  stepId: {
    type: String,
    required: true,
    // default: 1,
  },
  stepConfig: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

// 动态判断当前该渲染什么组件
const currentComponent = computed(() => {
  const config = props.stepConfig[props.stepId];
  return config.type === "md" ? ViewMd : ChoiceQuestion;
});

// 动态传递组件参数
const componentProps = computed(() => {
  const config = props.stepConfig[props.stepId];
  console.log(config, "config");
  return config.type === "md" ? { src: config.src } : { data: config.data };
});

// 导航逻辑（可结合业务调整，比如做题需提交后才允许下一步）
const handleNext = () => {
  const nextId = +props.stepId + 1;
  if (props.stepConfig[nextId]) {
    router.replace(`/step/${nextId}`);
  }
};

const handlePrev = () => {
  const prevId = +props.stepId - 1;
  if (props.stepConfig[prevId]) {
    router.replace(`/step/${prevId}`);
  }
};

onMounted(() => {
  // 禁用浏览器后退
  history.pushState(null, "", document.location.href);

  window.addEventListener("popstate", () => {
    // 立即回到当前页面
    router.replace(router.currentRoute.value.fullPath);
    history.pushState(null, "", document.location.href); // 继续推一个新的
    // 显示自定义提示
    vantConfirm({
      title: "请使用应用内的导航按钮",
      showCancelButton: false,
    });
  });
});

onUnmounted(() => {
  window.removeEventListener("popstate", () => {
    console.log("<UNK>");
  });
});

// 控制按钮显隐（可选）
const canPrev = computed(() => !!props.stepConfig[+props.stepId - 1]);
const canNext = computed(() => !!props.stepConfig[+props.stepId + 1]);
</script>

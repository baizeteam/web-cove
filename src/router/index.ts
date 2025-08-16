import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/step/:language/:id",
    component: () => import("@/views/step/step/index.vue"),
    props: route => ({
      language: route.params.language,
      stepId: route.params.id,
    }),
    meta: {
      keepAlive: true,
      clearHistory: true, // 跳转至此页时清除历史栈
    },
  },
  {
    path: "/step/:language/:id/:chapter/:step",
    component: () => import("@/views/step/learn/index.vue"),
    meta: {
      keepAlive: false,
      title: "学习内容",
    },
  },
  {
    path: "/recommend",
    meta: {
      title: "发现",
      keepAlive: false,
    },
    component: () => import("@/views/recommend/recommend/index.vue"),
  },
  {
    path: "/article",
    meta: {
      title: "全部文章",
      keepAlive: false,
    },
    component: () => import("@/views/article/article/index.vue"),
  },
  {
    path: "/article/detail/:id",
    meta: {
      title: "文章详情",
      keepAlive: false,
    },
    component: () => import("@/views/article/detail/index.vue"),
  },
  {
    path: "/search",
    meta: {
      title: "搜索页",
      keepAlive: false,
    },
    component: () => import("@/views/translate/search.vue"),
  },
  {
    path: "/study",
    meta: {
      title: "学习",
      keepAlive: false,
    },
    component: () => import("@/views/study/study.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("@/views/login/login/index.vue"),
  },
  // 添加404页面路由（必须放在最后）
  {
    path: "/:pathMatch(.*)*", // 匹配所有未定义的路径
    name: "NotFound",
    meta: {
      title: "页面不存在",
    },
    component: () => import("@/views/translate/notFound.vue"), // 你需要创建这个组件
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes],
});

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || "";
  console.log(from);
  // 如果需要清除历史记录
  // if (to.meta.clearHistory) {
  //   // 更安全的replace方式
  //   return next({
  //     path: to.path,
  //     query: to.query,
  //     hash: to.hash,
  //     replace: true  // 关键：使用replace而不是push
  //   });
  // }

  // 默认情况正常放行
  next();
});

export default router;

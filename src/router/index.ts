import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/friends",
  },
  {
    path: "/friends",
    meta: {
      title: "发现",
      keepAlive: false,
    },
    component: () => import("@/views/friends/friends/index.vue"),
  },
  {
    path: "/friends/detail",
    meta: {
      title: "发现详情",
      keepAlive: false,
    },
    component: () => import("@/views/friends/detail/index.vue"),
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
    component: () => import("@/views/error/notFound.vue"), // 你需要创建这个组件
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || "";
  console.log(from, "form");
  if (to.path === "/login" || to.meta.notLogin || 1) {
    next();
  }
});

export default router;

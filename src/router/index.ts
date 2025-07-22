import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import StepContainer from "@/views/stepContainer/index.vue";
import stepConfigRouter from "@/router/stepConfig.router.ts";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: '/step/:id',
    component: StepContainer,
    props: route => ({
      stepId: route.params.id,
      // 配置步骤映射：1 → MD，2 → 做题，3 → MD
      stepConfig: stepConfigRouter,
    })
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
    path: "/test-md",
    meta: {
      title: "文档",
      keepAlive: false,
    },
    component: () => import("@/views/study/test-md.vue"),
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
  routes: [
      ...routes,
    {
      path: '/public/_markdown/:path*',
      beforeEnter: (to) => {
        if (to.path.endsWith('.md')) {
          window.location.href = to.fullPath
          return false
        }
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || "";
  console.log(from, "form");
  if (to.path === "/login" || to.meta.notLogin || 1) {
    next();
  }
});

export default router;

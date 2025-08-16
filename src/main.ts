import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import plugins from "@/plugins";
import { initEruda } from "@/utils/logger.util.ts";
import { initNavigationManager } from "@/utils/navigation.util.ts";
import "@/utils/reset.util.ts";

initEruda(); // 初始化 Eruda
initNavigationManager(router); // 初始化导航管理器

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(plugins);
app.mount("#app");

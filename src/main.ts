import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
// import '@/assets/styles/index.less'
import plugins from "@/plugins";
import { initEruda } from "@/utils/logger.util.ts";

initEruda(); // 初始化 Eruda
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(plugins);
app.mount("#app");

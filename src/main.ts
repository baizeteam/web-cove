import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import plugins from "@/plugins";
import { initEruda } from "@/utils/logger.util.ts";
import { initNavigationManager } from "@/utils/navigation.util.ts";
import {
  needsMigration,
  migrateLearningStatusIds,
} from "@/utils/id-migration.util";
import { useLearningStore } from "@/stores/learning.store";
import { useFavoritesStore } from "@/stores/favorites.store";
import "@/utils/reset.util.ts";

initEruda(); // 初始化 Eruda
initNavigationManager(router); // 初始化导航管理器

// 检查并执行课程ID迁移
if (needsMigration()) {
  migrateLearningStatusIds();
}

const app = createApp(App);

// 创建并配置Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(plugins);

// 在应用挂载前执行数据迁移
app.mount("#app");

// 在应用启动后立即执行数据迁移
// 需要等待应用挂载完成，这样store才能正常使用
setTimeout(() => {
  try {
    const learningStore = useLearningStore();
    const favoritesStore = useFavoritesStore();

    // 执行数据迁移
    learningStore.migrateFromLocalStorage();
    favoritesStore.migrateFromLocalStorage();

    console.log("Pinia stores 数据迁移完成");
  } catch (error) {
    console.error("Pinia stores 数据迁移失败:", error);
  }
}, 100);

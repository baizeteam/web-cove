import longpress from "@/directives/v-longpress.js";
import vant, { Icon } from "vant";
// 2. 引入组件样式
import "vant/lib/index.css";

export default {
  install(app: any) {
    // 注册长按指令
    app.directive("longpress", longpress);
    app.use(vant);
    app.use(Icon);
  },
};

import longpress from "@/directives/v-longpress.js";
import vant from "./vant";
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";

export default {
  install(app) {
    // 注册长按指令
    app.directive("longpress", longpress);
    app.use(vant);
  },
};

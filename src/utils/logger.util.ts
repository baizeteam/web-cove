import { isObjectLike, safeStringify } from "@/utils/helper.util.ts";
import eruda from "eruda";

// 普通的带颜色 加粗console.log函数
export function colorLog(...args: any[]) {
  args.forEach((arg) => {
    // 安全处理对象转字符串（避免循环引用报错）
    const content = isObjectLike(arg) ? safeStringify(arg) : String(arg);

    console.log(
      "%c" + content,
      "color: #009a61; font-weight: bold; font-size: 16px;",
    );
  });
}

// 移动端集成调试工具
export const initEruda = () => {
  if (import.meta.env.DEV) {
    // 仅在开发环境启用
    const el = document.createElement("div");
    el.classList.add("__eruda_console");
    document.body.appendChild(el);
    eruda.init({
      container: el,
      tool: ["console", "elements", "network", "resources", "sources"], // 按需选择功能
    });
  }
};

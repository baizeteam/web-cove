import { isObjectLike, safeStringify } from "@/utils/helper.util.ts";

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

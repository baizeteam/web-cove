/**
 * 安全地将数据转换为 JSON 字符串（带格式化）
 * @param data 要转换的数据
 * @param indent 缩进空格数（默认 2）
 * @param defaultValue 转换失败时的默认返回值（默认空字符串）
 */
export function safeJsonStringify(
  data: unknown,
  indent: number = 2,
  defaultValue: string = "",
): string {
  try {
    // 处理 undefined、函数等 JSON.stringify 不支持的类型
    const replacer = (_: string, value: unknown) =>
      typeof value === "undefined" || typeof value === "function"
        ? null
        : value;

    return JSON.stringify(data, replacer, indent);
  } catch (error) {
    console.error("JSON stringify error:", error);
    return defaultValue;
  }
}

/**
 * 安全地解析 JSON 字符串
 * @param jsonStr JSON 字符串
 * @param defaultValue 解析失败时的默认返回值
 */
export function safeJsonParse<T = unknown>(
  jsonStr: string,
  defaultValue: T = null as unknown as T,
): T {
  try {
    // 处理 undefined 和空字符串
    if (!jsonStr || jsonStr.trim() === "") return defaultValue;

    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    return defaultValue;
  }
}

export function isObjectLike(obj: any): boolean {
  const prototypeString = Object.prototype.toString.call(obj);
  if (prototypeString === "[object Object]") return true;
  if (Array.isArray(obj)) return true;
  if (obj instanceof Set) return true;
  if (obj instanceof Map) return true;
  if (obj instanceof WeakMap) return true;
  if (obj instanceof WeakSet) return true;
  return false;
}

// 处理循环引用的安全序列化
export function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj); // 失败时回退到默认toString
  }
}

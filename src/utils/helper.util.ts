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

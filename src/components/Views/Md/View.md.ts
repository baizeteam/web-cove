// 除了语雀 文档零宽字符串加密问题
// 首先移除不可见字符 （但是这个又要处理编排布局）
export function removeInvisibleChars(markdownContent: string): string {
  // 1. 移除所有零宽字符
  let cleaned = markdownContent.replace(
    /[\u200B-\u200D\uFEFF\u2060-\u2064\u180E]/g,
    ""
  );
  // 2. 可选：移除其他控制字符（但保留换行符 \n 和制表符 \t）
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  // 3. 可选：修复转义字符（如 \* → *）
  cleaned = cleaned.replace(/\\([\\`*_{}\[\]()#+\-.!])/g, "$1");
  return cleaned;
}

// 去掉语雀头部域名部分，配合 nginx 改掉自己域名的请求头。实现代理访问
export function processImageUrls(markdownContent: string): string {
  // 匹配 ![...](https://cdn.nlark.com/...) 格式的图片链接
  try {
    const regex = /!\[(.*?)\]\((https:\/\/cdn\.nlark\.com)(\/[^)]+)\)/g;

    return markdownContent.replace(
      regex,
      (match: string, altText: string, domain: string, path: string) => {
        !match && !domain && console.log();
        // 只保留路径部分，去掉域名
        return `![${altText}](${path})`;
      }
    );
  } catch (_) {
    return markdownContent;
  }
}

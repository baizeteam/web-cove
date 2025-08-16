import Prism from "prismjs";

// 引入 Prism.js 的核心样式和主题
import "prismjs/themes/prism-tomorrow.css";

// 引入需要的语言支持
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";

// 引入插件
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";

export function useCodeHighlight() {
  // 语言别名映射
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    yml: "yaml",
    sh: "bash",
    shell: "bash",
  };

  // 语言显示名称映射
  const displayNames: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    css: "CSS",
    json: "JSON",
    bash: "Bash",
    shell: "Shell",
    yaml: "YAML",
    yml: "YAML",
    py: "Python",
    js: "JavaScript",
    ts: "TypeScript",
  };

  // 代码高亮函数
  const highlightCode = (code: string, lang?: string): string => {
    if (!lang) {
      return Prism.util.encode(code) as string;
    }

    const normalizedLang =
      languageMap[lang.toLowerCase()] || lang.toLowerCase();

    // 检查语言是否被支持
    if (Prism.languages[normalizedLang]) {
      try {
        return Prism.highlight(
          code,
          Prism.languages[normalizedLang],
          normalizedLang
        );
      } catch (e) {
        console.warn(`Failed to highlight ${normalizedLang} code:`, e);
      }
    }

    return Prism.util.encode(code) as string;
  };

  // 获取语言显示名称
  const getLanguageDisplayName = (lang: string): string => {
    return displayNames[lang.toLowerCase()] || lang.toUpperCase() || "Text";
  };

  // 设置复制功能
  const setupCopyFunction = () => {
    (window as any).copyToClipboard = function (button: HTMLElement) {
      const code = decodeURIComponent(button.dataset.code || "");
      const originalText = button.innerHTML;

      navigator.clipboard
        .writeText(code)
        .then(() => {
          button.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>已复制';
          button.style.color = "#52c41a";
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = "";
          }, 2000);
        })
        .catch(err => {
          console.error("复制失败:", err);
          // 降级到传统复制方法
          const textArea = document.createElement("textarea");
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            button.innerHTML =
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>已复制';
            button.style.color = "#52c41a";
            setTimeout(() => {
              button.innerHTML = originalText;
              button.style.color = "";
            }, 2000);
          } catch (err2) {
            console.error("复制失败:", err2);
          }
          document.body.removeChild(textArea);
        });
    };
  };

  // 设置marked渲染器
  const setupRenderer = (marked: any) => {
    const renderer = new marked.Renderer();

    // 增强代码块渲染
    renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
      const language = lang?.split(" ")[0] || "";
      const highlightedCode = highlightCode(text, language);

      return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-language">${getLanguageDisplayName(language)}</span>
            <button class="copy-button" style="color:black" onclick="copyToClipboard(this)" data-code="${encodeURIComponent(text)}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              复制
            </button>
          </div>
          <pre class="language-${language} line-numbers"><code class="language-${language}">${highlightedCode}</code></pre>
        </div>
      `;
    };

    marked.use({ renderer });

    // 设置复制功能
    setupCopyFunction();
  };

  // 高亮所有代码块
  const highlightAll = () => {
    Prism.highlightAll();
  };

  return {
    highlightCode,
    getLanguageDisplayName,
    setupRenderer,
    highlightAll,
    setupCopyFunction,
  };
}

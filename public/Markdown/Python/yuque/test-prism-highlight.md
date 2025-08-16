# Prism.js 代码高亮测试

这是一个测试文件，用于验证新的 Prism.js 代码高亮效果。

## Python 代码示例

以下代码运行什么？

```python
def print_double(x):
    print(2 * x)
print_double(3)
```

- A. 6
- B. 2
- C. 3
- D. 0

## JavaScript 代码示例

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
```

## TypeScript 代码示例

```typescript
interface User {
  name: string;
  age: number;
  email?: string;
}

const user: User = {
  name: "张三",
  age: 25,
};

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}
```

## CSS 代码示例

```css
.code-block-wrapper {
  margin: 1.5em 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #2d3748;
}

.copy-button:hover {
  background: #374151;
  border-color: #6b7280;
  color: #ffffff;
}
```

## JSON 数据示例

```json
{
  "name": "web-cove",
  "version": "1.0.0",
  "dependencies": {
    "vue": "^3.3.0",
    "prismjs": "^1.29.0",
    "marked": "^5.0.0"
  },
  "devDependencies": {
    "@types/prismjs": "^1.26.0"
  }
}
```

## Bash 脚本示例

```bash
#!/bin/bash

# 安装依赖
npm install prismjs @types/prismjs

# 构建项目
npm run build

# 启动服务
npm run dev
```

## 纯文本示例

```
这是一个没有语法高亮的纯文本代码块
用于测试默认样式
```

## 效果对比

新的 Prism.js 代码高亮相比 highlight.js 有以下优势：

1. **更好的语法识别** - 对 Python、JavaScript 等语言的语法高亮更准确
2. **美观的主题** - 使用 `prism-tomorrow` 主题，颜色搭配更协调
3. **行号显示** - 自动显示代码行号，便于阅读
4. **复制功能** - 每个代码块都有复制按钮
5. **语言标识** - 清晰显示代码块的编程语言
6. **响应式设计** - 在移动设备上也有良好的显示效果

现在选择题中的 Python 代码应该能够完美高亮显示，包括：

- 关键字 `def`、`print` 的紫色高亮
- 函数名 `print_double` 的黄色高亮
- 数字 `2`、`3` 的红色高亮
- 参数 `x` 的橙色高亮

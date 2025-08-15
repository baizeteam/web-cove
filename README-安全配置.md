# 项目安全配置说明

## 概述

项目已配置了完整的安全防护体系，包括 Git Hooks、ESLint 安全规则、代码格式化等，确保代码质量和安全性。

## 安全配置清单

### 1. Git Hooks 系统

#### 已配置的 Hooks

- **pre-commit**: 自动运行 ESLint 检查和代码格式化
- **commit-msg**: 验证提交信息格式

#### 配置文件

- `lint-staged.config.mjs`: 暂存文件检查配置
- `.husky/`: Husky 配置目录

### 2. ESLint 安全规则

#### Vue 安全规则

```json
{
  "vue/no-v-html": "error", // 禁止直接使用 v-html
  "vue/no-innerhtml": "error", // 禁止直接操作 innerHTML
  "vue/no-unsafe-html": "error", // 禁止不安全的 HTML 操作
  "vue/no-unsafe-component-option": "error", // 禁止不安全的组件选项
  "vue/no-unsafe-attribute": "error" // 禁止不安全的属性
}
```

#### 配置文件

- `.eslintrc.json`: ESLint 主配置
- `.eslintignore`: ESLint 忽略文件配置

### 3. 代码格式化

#### Prettier 配置

- `.prettierrc`: 代码格式化规则
- `.prettierignore`: 格式化忽略文件

#### 格式化规则

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 4. 安全依赖

#### 已安装的安全库

- `dompurify`: HTML 清理库，防止 XSS 攻击
- `@types/dompurify`: TypeScript 类型定义

## 安全最佳实践

### 1. 代码提交流程

```bash
# 1. 添加文件到暂存区
git add .

# 2. 提交代码（自动触发安全检查）
git commit -m "feat: 添加新功能"

# 3. 系统自动执行：
#    - ESLint 检查
#    - 代码格式化
#    - 安全规则验证
```

### 2. 开发时检查

```bash
# 检查代码问题
pnpm lint:check

# 自动修复问题
pnpm lint:fix

# 格式化代码
pnpm format
```

### 3. 安全例外处理

如果确实需要使用 `v-html`，必须：

1. **添加安全处理**

```vue
<!-- eslint-disable-next-line vue/no-v-html -->
<div v-html="sanitizedContent"></div>

<script>
import DOMPurify from "dompurify";

export default {
  computed: {
    sanitizedContent() {
      return DOMPurify.sanitize(this.userContent, {
        ALLOWED_TAGS: ["b", "i", "em", "strong"],
        ALLOWED_ATTR: ["class"],
      });
    },
  },
};
</script>
```

2. **添加 ESLint 禁用注释**

```vue
<!-- eslint-disable-next-line vue/no-v-html -->
<div v-html="safeContent"></div>
```

## 安全规则说明

### 1. 为什么禁止 v-html？

- **XSS 风险**: 直接渲染 HTML 字符串可能导致脚本注入
- **数据污染**: 用户输入可能包含恶意代码
- **安全漏洞**: 攻击者可能通过输入执行 JavaScript

### 2. 安全替代方案

```vue
<!-- ❌ 危险 -->
<div v-html="userInput"></div>

<!-- ✅ 安全 -->
<div v-text="userInput"></div>
<div>{{ userInput }}</div>

<!-- ✅ 安全（经过清理） -->
<!-- eslint-disable-next-line vue/no-v-html -->
<div v-html="sanitizedContent"></div>
```

### 3. 富文本内容处理

对于需要渲染富文本的场景：

```vue
<template>
  <div v-html="safeRichText"></div>
</template>

<script>
import DOMPurify from "dompurify";

export default {
  computed: {
    safeRichText() {
      return DOMPurify.sanitize(this.richTextContent, {
        ALLOWED_TAGS: ["p", "br", "strong", "em", "a"],
        ALLOWED_ATTR: ["href", "target", "class"],
        ALLOW_DATA_ATTR: false,
      });
    },
  },
};
</script>
```

## 配置验证

### 1. 检查配置是否生效

```bash
# 检查 ESLint 配置
npx eslint --print-config .eslintrc.json

# 检查 Prettier 配置
npx prettier --config .prettierrc --check src/
```

### 2. 测试安全规则

创建一个测试文件，故意使用 `v-html`：

```vue
<template>
  <div v-html="dangerousContent"></div>
</template>

<script>
export default {
  data() {
    return {
      dangerousContent: '<script>alert("XSS")</script>'
    }
  }
}
</script>
```

运行检查：

```bash
npx eslint test.vue
# 应该报错：vue/no-v-html
```

## 团队协作

### 1. 新成员配置

```bash
# 1. 克隆项目
git clone <repository>

# 2. 安装依赖
pnpm install

# 3. 安装 Git Hooks
pnpm run prepare

# 4. 验证配置
pnpm lint:check
```

### 2. 代码审查要点

- 检查是否使用了 `v-html`
- 验证 HTML 内容是否经过安全处理
- 确认提交信息格式正确
- 检查代码是否通过所有 lint 规则

### 3. 常见问题解决

#### Hook 不生效

```bash
# 重新安装 husky
pnpm run prepare

# 检查 .git/hooks 目录
ls -la .git/hooks/
```

#### ESLint 规则冲突

```bash
# 查看规则详情
npx eslint --print-config .eslintrc.json

# 临时禁用规则（不推荐）
<!-- eslint-disable vue/no-v-html -->
```

## 监控和维护

### 1. 定期检查

- 每周运行 `pnpm lint:check`
- 检查依赖包的安全更新
- 审查新添加的代码

### 2. 安全更新

```bash
# 检查依赖安全漏洞
pnpm audit

# 更新依赖
pnpm update

# 更新安全相关的包
pnpm update dompurify
```

### 3. 规则调整

如果需要调整安全规则：

1. 修改 `.eslintrc.json`
2. 更新团队文档
3. 通知所有成员
4. 测试新配置

## 总结

项目安全配置的目标是：

1. **自动化**: 通过 Git Hooks 自动执行安全检查
2. **标准化**: 统一的代码风格和安全规范
3. **预防性**: 在代码提交前发现问题
4. **教育性**: 帮助开发者了解安全最佳实践

记住：安全不是一次性的工作，而是持续的过程。定期检查和更新安全配置，确保项目始终处于安全状态。

# Vue 安全规则配置说明

## 概述

为了防止 XSS（跨站脚本攻击）和其他安全漏洞，项目配置了严格的 Vue 安全规则。

## 已配置的安全规则

### 1. v-html 相关规则

#### `vue/no-v-html: "error"`

- **作用**: 禁止使用 `v-html` 指令
- **原因**: `v-html` 会直接渲染 HTML 字符串，容易导致 XSS 攻击
- **替代方案**: 使用 `v-text` 或插值表达式 `{{ }}`

```vue
<!-- ❌ 危险 - 可能导致 XSS 攻击 -->
<div v-html="userInput"></div>

<!-- ✅ 安全 - 使用 v-text 或插值 -->
<div v-text="userInput"></div>
<div>{{ userInput }}</div>
```

#### `vue/no-innerhtml: "error"`

- **作用**: 禁止直接操作 `innerHTML` 属性
- **原因**: 直接操作 DOM 的 innerHTML 同样存在 XSS 风险

```vue
<!-- ❌ 危险 -->
<script>
mounted() {
  this.$refs.container.innerHTML = this.userInput;
}
</script>

<!-- ✅ 安全 - 使用 Vue 的响应式系统 -->
<template>
  <div ref="container">{{ userInput }}</div>
</template>
```

#### `vue/no-unsafe-html: "error"`

- **作用**: 禁止使用不安全的 HTML 相关操作
- **覆盖范围**: 包括所有可能导致 XSS 的 HTML 操作

### 2. 组件安全规则

#### `vue/no-unsafe-component-option: "error"`

- **作用**: 禁止使用不安全的组件选项
- **防止**: 通过组件选项注入恶意代码

#### `vue/no-unsafe-attribute: "error"`

- **作用**: 禁止使用不安全的属性
- **防止**: 通过属性注入恶意脚本

## 安全最佳实践

### 1. 数据渲染

```vue
<!-- ❌ 不安全 -->
<template>
  <div v-html="userContent"></div>
</template>

<script>
export default {
  data() {
    return {
      userContent: '<script>alert("XSS")</script>'
    }
  }
}
</script>

<!-- ✅ 安全 -->
<template>
  <div>{{ userContent }}</div>
</template>

<script>
export default {
  data() {
    return {
      userContent: '<script>alert("XSS")</script>'
    }
  }
}
</script>
```

### 2. 富文本内容处理

如果需要渲染富文本内容，应该：

1. **使用安全的 HTML 解析库**

```bash
pnpm add dompurify
```

2. **在渲染前清理 HTML**

```vue
<template>
  <div v-html="sanitizedContent"></div>
</template>

<script>
import DOMPurify from "dompurify";

export default {
  computed: {
    sanitizedContent() {
      return DOMPurify.sanitize(this.userContent);
    },
  },
};
</script>
```

3. **配置 DOMPurify 白名单**

```javascript
const clean = DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "a"],
  ALLOWED_ATTR: ["href", "target"],
});
```

### 3. 动态组件

```vue
<!-- ❌ 不安全 -->
<component :is="userInput"></component>

<!-- ✅ 安全 -->
<component :is="validatedComponent"></component>

<script>
export default {
  computed: {
    validatedComponent() {
      const allowedComponents = ["Button", "Input", "Card"];
      return allowedComponents.includes(this.userInput)
        ? this.userInput
        : "div";
    },
  },
};
</script>
```

### 4. 事件处理

```vue
<!-- ❌ 不安全 -->
<button @click="eval(userInput)">Click</button>

<!-- ✅ 安全 -->
<button @click="handleClick">Click</button>

<script>
export default {
  methods: {
    handleClick() {
      // 安全的处理逻辑
      console.log("Button clicked");
    },
  },
};
</script>
```

## 配置说明

### ESLint 规则级别

- **"error"**: 违反规则时阻止提交
- **"warn"**: 违反规则时显示警告
- **"off"**: 关闭规则

### 当前配置

```json
{
  "rules": {
    "vue/no-v-html": "error", // 禁止 v-html
    "vue/no-innerhtml": "error", // 禁止 innerHTML
    "vue/no-unsafe-html": "error", // 禁止不安全 HTML
    "vue/no-unsafe-component-option": "error", // 禁止不安全组件选项
    "vue/no-unsafe-attribute": "error" // 禁止不安全属性
  }
}
```

## 例外情况处理

如果确实需要使用 `v-html`（比如渲染 Markdown 内容），可以：

### 1. 在特定行禁用规则

```vue
<!-- eslint-disable-next-line vue/no-v-html -->
<div v-html="sanitizedMarkdown"></div>
```

### 2. 在文件顶部禁用规则

```vue
<!-- eslint-disable vue/no-v-html -->
<template>
  <div v-html="content"></div>
</template>
```

### 3. 使用计算属性确保安全

```vue
<template>
  <div v-html="safeContent"></div>
</template>

<script>
export default {
  computed: {
    safeContent() {
      // 确保内容经过安全处理
      return this.sanitizeHtml(this.userContent);
    },
  },
  methods: {
    sanitizeHtml(html) {
      // 实现 HTML 清理逻辑
      return html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    },
  },
};
</script>
```

## 测试安全规则

### 1. 运行 ESLint 检查

```bash
pnpm lint:check
```

### 2. 检查特定文件

```bash
npx eslint src/components/YourComponent.vue
```

### 3. 自动修复

```bash
pnpm lint:fix
```

## 总结

通过配置这些安全规则，项目能够：

1. **防止 XSS 攻击**: 禁止直接渲染不安全的 HTML
2. **提高代码质量**: 强制使用安全的 Vue 模式
3. **团队协作**: 确保所有开发者遵循安全规范
4. **自动化检查**: 在提交前自动检查安全问题

记住：安全不是可选的，而是必须的。始终优先考虑安全性，即使这意味着需要额外的开发工作。

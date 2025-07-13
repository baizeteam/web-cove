# Vue3 + Vite + Vitest + TypeScript 示例项目

这是一个使用 Vue3、Vite、Vitest 和 TypeScript 构建的示例项目，展示了如何为 Vue 组件编写测试。

## 技术栈

- **Vue 3**: 使用 Composition API 和 `<script setup>` 语法
- **Vite**: 快速的构建工具
- **Vitest**: 单元测试框架
- **TypeScript**: 类型安全的 JavaScript
- **@vue/test-utils**: Vue 组件测试工具

## 项目结构

```
├── src/
│   ├── components/
│   │   ├── Counter.vue          # 简单的计数器组件
│   │   └── TodoList.vue         # 待办事项列表组件
│   ├── App.vue                  # 主应用组件
│   └── main.ts                  # 应用入口
├── tests/
│   └── components/
│       ├── Counter.test.ts      # Counter 组件测试
│       └── TodoList.test.ts     # TodoList 组件测试
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 安装依赖

```bash
npm install
```

## 开发

启动开发服务器：

```bash
npm run dev
```

## 测试

运行所有测试：

```bash
npm test
```

运行测试并显示 UI：

```bash
npm run test:ui
```

生成测试覆盖率报告：

```bash
npm run test:coverage
```

## 构建

构建生产版本：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 测试示例

### Counter 组件测试

`Counter.vue` 是一个简单的计数器组件，包含以下功能：

- 增加、减少、重置计数
- 当计数大于 10 时显示提示消息

测试覆盖了：

- 组件渲染
- 用户交互（点击按钮）
- 条件渲染
- CSS 类应用

### TodoList 组件测试

`TodoList.vue` 是一个待办事项列表组件，包含以下功能：

- 添加新的待办事项
- 标记待办事项为完成/未完成
- 删除待办事项
- 过滤显示（全部/进行中/已完成）
- 统计信息显示

测试覆盖了：

- 表单输入和提交
- 列表渲染和更新
- 状态管理
- 计算属性
- 事件处理
- 条件渲染和样式

## 测试最佳实践

1. **使用 `beforeEach`** 在每个测试前重置组件状态
2. **测试用户交互** 使用 `trigger()` 方法模拟用户操作
3. **验证 DOM 结构** 检查元素存在性和文本内容
4. **测试异步操作** 使用 `async/await` 处理异步事件
5. **测试计算属性** 验证响应式数据的正确性
6. **测试条件渲染** 检查不同状态下的组件显示

## 常用测试方法

### 查找元素

```typescript
// 通过选择器查找
wrapper.find('.btn');
wrapper.findAll('.todo-item');

// 通过文本查找
wrapper.find('h2');
```

### 触发事件

```typescript
// 点击事件
await button.trigger('click');

// 输入事件
await input.setValue('新文本');
await input.trigger('keyup.enter');
```

### 验证结果

```typescript
// 检查文本内容
expect(wrapper.find('h2').text()).toBe('期望的文本');

// 检查元素存在性
expect(wrapper.find('.message').exists()).toBe(true);

// 检查 CSS 类
expect(element.classes()).toContain('active');

// 检查元素数量
expect(wrapper.findAll('.item')).toHaveLength(3);
```

## 注意事项

- 确保在 `vite.config.ts` 中正确配置了测试环境
- 使用 `jsdom` 环境来模拟浏览器 DOM
- 在 `tsconfig.json` 中包含测试文件的类型定义
- 使用 `@vue/test-utils` 提供的 `mount` 函数来挂载组件

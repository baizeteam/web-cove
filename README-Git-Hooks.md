# Git Hooks 使用说明

## 概述

项目已配置了完整的 Git Hooks 系统，使用 Husky + lint-staged 实现代码质量自动化。

## 已配置的 Hooks

### 1. pre-commit Hook

- **触发时机**: 每次 `git commit` 前
- **执行内容**:
  - 运行 lint-staged
  - 自动修复 ESLint 问题
  - 自动格式化代码（Prettier）

### 2. commit-msg Hook

- **触发时机**: 每次 `git commit` 后
- **执行内容**: 验证提交信息格式（commitlint）

## 可用的脚本命令

### 代码检查

```bash
# 检查代码问题（不自动修复）
pnpm lint

# 自动修复代码问题
pnpm lint:fix

# 严格检查（不允许任何警告）
pnpm lint:check
```

### 代码格式化

```bash
# 格式化所有代码
pnpm format

# 检查代码格式（不修改）
pnpm format:check
```

## 工作流程

### 正常开发流程

1. 编写代码
2. 添加文件到暂存区：`git add .`
3. 提交代码：`git commit -m "feat: 添加新功能"`
4. 系统自动执行：
   - ESLint 检查和修复
   - Prettier 代码格式化
   - 提交信息格式验证

### 如果代码有问题

- ESLint 错误会在 pre-commit 阶段被阻止
- 系统会自动修复大部分格式问题
- 如果无法自动修复，需要手动修复后重新提交

## 配置文件说明

### lint-staged.config.mjs

```javascript
export default {
  "*.{js,ts,vue,jsx,tsx}": [
    "eslint --fix", // 修复 ESLint 问题
    "prettier --write", // 格式化代码
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write", // 格式化配置文件
  ],
};
```

### .eslintrc.json

- 配置 ESLint 规则
- 支持 Vue 3 + TypeScript
- 集成 Prettier 规则

### .prettierrc

- 配置代码格式化规则
- 确保团队代码风格一致

## 常见问题

### 1. Hook 不生效

```bash
# 重新安装 husky
pnpm run prepare
```

### 2. 跳过 Hook 检查（不推荐）

```bash
# 跳过 pre-commit hook
git commit --no-verify -m "紧急修复"
```

### 3. 手动运行检查

```bash
# 手动运行 lint-staged
npx lint-staged

# 手动运行 ESLint
npx eslint --fix src/
```

## 最佳实践

1. **提交前检查**: 使用 `pnpm lint:check` 确保代码质量
2. **定期格式化**: 使用 `pnpm format` 保持代码整洁
3. **遵循规范**: 使用规范的提交信息格式
4. **团队协作**: 确保所有团队成员都安装了依赖

## 提交信息格式

使用 Conventional Commits 格式：

```
type(scope): description

feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 注意事项

- 确保在提交前运行 `pnpm install` 安装所有依赖
- 如果遇到 ESLint 配置问题，检查 `.eslintrc.json` 文件
- 代码格式化规则在 `.prettierrc` 中配置
- 忽略规则在 `.eslintignore` 和 `.prettierignore` 中配置

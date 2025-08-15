# 新系统架构说明

## 概述

系统已从原来的单一 `/step/:id` 路由升级为更灵活的 `/step/:language/:id` 路由结构，支持多语言课程管理和学习状态跟踪。

## 主要变更

### 1. 路由结构

- **旧路由**: `/step/:id` - 只能处理单一课程类型
- **新路由**: `/step/:language/:id` - 支持多语言课程，如 `/step/python/1`, `/step/javascript/1`

### 2. 数据结构

新的课程数据结构位于 `src/data/courses.ts`：

```typescript
export interface Course {
  id: string; // 课程唯一标识
  type: LanguageType; // 语言类型 (python, javascript, html等)
  title: string; // 课程标题
  description: string; // 课程描述
  icon: string; // 课程图标
  totalSteps: number; // 总步骤数
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // 难度等级
  steps: Record<number, StepConfig>; // 步骤配置
  tags: string[]; // 标签
}
```

### 3. 学习状态管理

学习状态通过 `src/utils/learning.util.ts` 管理，包括：

- 课程加入/退出状态
- 学习进度跟踪
- 本地存储管理
- 学习历史记录

### 4. 页面更新

#### Recommend 页面 (`src/views/recommend/recommend/index.vue`)

- 新增语言分类标签页
- 课程卡片展示，包含难度、标签、进度等信息
- 加入学习功能
- 学习状态显示

#### Study 页面 (`src/views/study/study.vue`)

- 学习统计展示（进行中课程数、总体进度、学习天数）
- 我的课程列表，显示学习进度和状态
- 课程操作（继续学习、退出学习）
- 空状态引导

#### Step 页面 (`src/views/step/step/index.vue`)

- 支持新的路由参数 `language` 和 `id`
- 从课程数据中动态获取步骤配置
- 自动更新学习进度
- 导航逻辑适配新路由

## 使用流程

### 1. 发现课程

用户在 Recommend 页面浏览不同语言的课程，可以：

- 切换语言标签页查看对应课程
- 查看课程详情（难度、步骤数、标签等）
- 加入感兴趣的课程

### 2. 学习课程

加入课程后：

- 自动跳转到学习页面 `/step/:language/:id`
- 系统记录学习状态和进度
- 支持步骤间导航

### 3. 管理学习

在 Study 页面：

- 查看所有已加入的课程
- 监控学习进度
- 继续学习或退出课程

## 技术特点

### 1. 数据驱动

- 课程配置完全由数据驱动
- 易于添加新语言和新课程
- 支持灵活的步骤配置

### 2. 状态持久化

- 学习状态存储在 localStorage
- 支持离线学习状态保存
- 学习进度实时更新

### 3. 响应式设计

- 使用 Vue 3 Composition API
- 响应式数据绑定
- 现代化的 UI 设计

## 扩展性

### 1. 添加新语言

在 `src/data/courses.ts` 中添加新的语言类型：

```typescript
export type LanguageType =
  | 'javascript'
  | 'python'
  | 'java'
  | 'html'
  | 'css'
  | 'newLanguage';
```

### 2. 添加新课程

在 `coursesData` 数组中添加新课程配置即可。

### 3. 自定义步骤类型

可以扩展 `StepConfig` 类型支持更多步骤类型，如视频、实践练习等。

## 注意事项

1. **图标文件**: 当前使用占位符文件，实际项目中需要替换为真实的图标
2. **MD 文件**: 部分课程暂时使用 Python 的 MD 文件，需要根据实际内容调整
3. **路由兼容**: 旧的路由 `/step/:id` 已废弃，需要更新所有相关链接
4. **数据迁移**: 如果系统已有用户数据，需要考虑数据迁移策略

## 未来改进

1. **后端集成**: 将课程数据和学习状态迁移到后端数据库
2. **用户系统**: 添加用户认证和个性化学习路径
3. **学习分析**: 添加学习行为分析和推荐算法
4. **多媒体支持**: 支持视频、音频等多媒体学习内容
5. **社交功能**: 添加学习社区和讨论功能

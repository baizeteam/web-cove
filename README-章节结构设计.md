# 章节结构设计说明

## 设计理念

新的数据结构采用了更清晰的三层架构，支持章节分组概念，让学习内容更有层次感和逻辑性。

## 数据结构对比

### 旧结构（平面化）

```typescript
interface Course {
  steps: Record<number, StepConfig>; // 步骤是平面的，没有分组
}
```

### 新结构（层次化）

```typescript
interface Course {
  chapters: Chapter[]; // 支持章节分组
}

interface Chapter {
  id: number;
  title: string;
  description?: string;
  steps: Step[];
}

interface Step {
  id: number;
  type: 'md' | 'choice';
  title?: string;
  content: StepContent;
}
```

## 核心优势

### 1. **清晰的层次结构**

- **课程** → **章节** → **步骤** 的三层结构
- 每个层级都有明确的职责和属性
- 支持章节标题和描述，增强可读性

### 2. **灵活的内容组织**

- 章节可以包含不同数量的步骤
- 支持混合内容类型（MD文档、选择题等）
- 每个步骤可以有独立的标题

### 3. **更好的学习体验**

- 学习者可以按章节分组学习
- 章节进度可视化
- 支持跨章节导航

### 4. **扩展性强**

- 易于添加新的内容类型
- 支持复杂的课程结构
- 为未来的学习路径规划留下空间

## 实际应用示例

### Python 基础课程结构

```
Python 基础入门
├── 第1章：Python 简介
│   ├── 步骤1：Python特点 (MD文档)
│   └── 步骤2：Python基础概念测试 (选择题)
└── 第2章：Python 函数
    ├── 步骤3：函数基础 (MD文档)
    ├── 步骤4：函数定义测试 (选择题)
    └── 步骤5：函数进阶 (MD文档)
```

### JavaScript 基础课程结构

```
JavaScript 基础
├── 第1章：JavaScript 基础语法
│   ├── 步骤1：JavaScript简介 (MD文档)
│   └── 步骤2：变量声明测试 (选择题)
└── 第2章：JavaScript 数据类型
    ├── 步骤3：数据类型测试 (选择题)
    └── 步骤4：数据类型详解 (MD文档)
```

## 技术实现特点

### 1. **类型安全**

- 使用 TypeScript 确保数据结构的一致性
- 泛型支持不同类型的步骤内容
- 编译时类型检查

### 2. **状态管理**

- 学习状态包含章节和步骤信息
- 支持跨章节的学习进度跟踪
- 本地存储持久化

### 3. **导航系统**

- 支持章节内步骤导航
- 支持跨章节导航
- 智能的前进/后退逻辑

### 4. **UI 组件**

- 章节头部显示当前章节信息
- 步骤头部显示当前步骤信息
- 章节导航面板，支持快速跳转
- 进度可视化

## 学习状态管理

### 状态结构

```typescript
interface LearningStatus {
  courseId: string;
  language: LanguageType;
  currentChapter: number; // 当前章节
  currentStep: number; // 当前步骤
  completedSteps: number[]; // 已完成的步骤
  isEnrolled: boolean; // 是否已加入学习
  lastStudyTime: number; // 最后学习时间
  progress: number; // 总体进度
}
```

### 进度计算

- **章节进度**：当前章节内已完成的步骤数 / 章节总步骤数
- **总体进度**：所有已完成的步骤数 / 课程总步骤数
- **学习位置**：当前章节和步骤的组合

## 扩展性设计

### 1. **新增内容类型**

```typescript
// 可以轻松添加新的步骤类型
type StepContent = MdStep | ChoiceStep | VideoStep | PracticeStep;
```

### 2. **新增章节属性**

```typescript
interface Chapter {
  id: number;
  title: string;
  description?: string;
  steps: Step[];
  // 未来可以添加：
  // difficulty?: 'beginner' | 'intermediate' | 'advanced';
  // estimatedTime?: number; // 预计学习时间
  // prerequisites?: string[]; // 前置要求
}
```

### 3. **学习路径支持**

```typescript
// 未来可以支持学习路径
interface LearningPath {
  id: string;
  title: string;
  chapters: Chapter[];
  dependencies: string[]; // 依赖的其他课程
}
```

## 使用建议

### 1. **课程设计**

- 每个章节应该有明确的主题和目标
- 章节内的步骤应该逻辑连贯
- 合理分配理论学习和实践练习

### 2. **内容组织**

- MD文档适合理论讲解
- 选择题适合知识检验
- 可以添加实践练习、代码示例等

### 3. **学习体验**

- 提供清晰的章节导航
- 显示学习进度和位置
- 支持灵活的学习路径

## 总结

新的章节结构设计相比原来的平面结构有以下优势：

1. **更好的内容组织**：支持逻辑分组，学习更有条理
2. **增强的用户体验**：清晰的导航和进度显示
3. **更强的扩展性**：易于添加新功能和内容类型
4. **更清晰的数据模型**：类型安全，结构清晰

这种设计为未来的功能扩展（如学习路径、个性化推荐、社交学习等）奠定了良好的基础。

Course (课程)
├── Chapter[] (章节数组)
│   ├── Chapter (章节)
│   │   ├── id, title, description
│   │   └── Step[] (步骤数组)
│   │       ├── Step (步骤)
│   │       │   ├── id, type, title
│   │       │   └── content (具体内容)
│   │       └── ...
│   └── ...
└── ...

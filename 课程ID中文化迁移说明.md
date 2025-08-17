# 课程ID中文化迁移说明

## 更新内容

### 1. 课程ID变更

- **Python基础入门**: `python-basics` → `Python基础入门`
- **JavaScript基础**: `javascript-basics` → `JavaScript基础`

### 2. 自动数据迁移

创建了 `src/utils/id-migration.util.ts` 工具，实现：

- 自动检测localStorage中的旧ID数据
- 将学习状态中的课程ID迁移到新的中文ID
- 将收藏数据中的课程ID迁移到新的中文ID
- 应用启动时自动执行迁移（在main.ts中）

### 3. 兼容性处理

- `getCourseById()` 函数支持旧ID查询，自动映射到新ID
- 保持了所有现有API的兼容性
- 不会破坏现有的学习进度和收藏数据

### 4. URL编码支持

- 路由参数自动进行URL编码/解码处理中文ID
- 所有页面跳转都正确编码中文课程ID
- 导航工具函数支持中文路径识别

### 5. 更新的文件列表

```
src/data/courses.ts           # 课程数据定义，ID映射表
src/utils/id-migration.util.ts  # ID迁移工具
src/main.ts                   # 应用启动时执行迁移
src/router/index.ts           # 路由URL编码支持
src/utils/navigation.util.ts  # 导航工具中文支持
src/views/recommend/recommend/index.vue  # 推荐页课程点击
src/views/study/study.vue     # 学习页课程跳转
```

## 使用方式

### 课程URL示例

- 旧格式: `/step/python/python-basics`
- 新格式: `/step/python/Python%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8` (URL编码后的中文)

### 开发者注意事项

1. **新增课程**: 直接使用中文作为课程ID
2. **数据查询**: 继续使用 `getCourseById()` 函数，支持新旧ID
3. **路由跳转**: 使用 `encodeURIComponent()` 对中文ID进行编码

## 用户体验

- 用户无需做任何操作，现有学习进度自动保留
- 首次访问时自动完成数据迁移
- URL现在更加语义化和友好

## 技术要点

1. **向后兼容**: 旧的课程ID仍然可以查询到对应课程
2. **数据完整性**: 学习状态和收藏数据完全保留
3. **URL编码**: 正确处理中文字符在URL中的编码
4. **性能**: 迁移只在首次检测到旧数据时执行一次

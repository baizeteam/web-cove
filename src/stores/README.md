# 全局状态管理 (Stores)

本项目使用 Pinia 进行全局状态管理，避免重复代码，便于维护和扩展。

## 课程数据管理 (courses.store.ts)

### 主要功能

- 统一管理所有课程数据
- 提供课程筛选和搜索功能
- 提供语言和难度的文本转换
- 为将来接入服务端API做准备

### 使用方法

```typescript
import { useCoursesStore } from "@/stores/courses.store";

const coursesStore = useCoursesStore();

// 获取筛选后的课程列表
const { filteredCourses } = coursesStore;

// 切换语言筛选
coursesStore.setSelectedLanguage("python");

// 搜索课程
coursesStore.setSearchQuery("入门");

// 获取课程信息
const course = coursesStore.getCourseById("course-id");

// 获取语言文本
const languageText = coursesStore.getLanguageText("python"); // "Python"
```

### 扩展为服务端数据

将来需要接入服务端时，只需要修改 `fetchCourses` 方法：

```typescript
const fetchCourses = async (language?: LanguageType) => {
  isLoading.value = true;
  try {
    const response = await api.getCourses({ language });
    courses.value = response.data;
  } catch (error) {
    console.error("获取课程数据失败:", error);
  } finally {
    isLoading.value = false;
  }
};
```

## 搜索管理 (search.store.ts)

### 主要功能

- 管理搜索历史记录
- 提供热门搜索词
- 搜索建议和自动完成
- 与课程store协同工作

### 使用方法

```typescript
import { useSearchStore } from "@/stores/search.store";

const searchStore = useSearchStore();

// 执行搜索
await searchStore.performSearch("Python入门");

// 获取搜索建议
const suggestions = searchStore.getSearchSuggestions("py");

// 清除搜索历史
searchStore.clearSearchHistory();
```

## 布局管理 (layout.store.ts)

现有的布局状态管理，保持不变。

## 数据流向

```
用户操作 → Store Actions → 更新 State → 组件响应
```

### 示例：搜索流程

1. 用户在搜索框输入关键词
2. 调用 `searchStore.performSearch()`
3. SearchStore 调用 `coursesStore.searchCourses()`
4. CoursesStore 更新 `filteredCourses`
5. 所有使用 `filteredCourses` 的组件自动更新

## 最佳实践

### 1. 避免重复代码

❌ 不好的做法：

```typescript
// 在每个组件中重复定义
const getLanguageText = (language) => {
  const map = { python: 'Python', ... }
  return map[language]
}
```

✅ 好的做法：

```typescript
// 使用store中的方法
const { getLanguageText } = useCoursesStore();
```

### 2. 统一数据源

❌ 不好的做法：

```typescript
// 在不同组件中重复导入静态数据
import { coursesData } from "@/data/courses";
```

✅ 好的做法：

```typescript
// 使用store中的响应式数据
const { filteredCourses } = useCoursesStore();
```

### 3. 便于扩展

- 所有与服务端交互的逻辑都集中在store中
- 组件只需要关注UI逻辑
- 添加新功能时，只需要扩展store

## 组件迁移指南

将现有组件迁移到使用store：

1. 导入对应的store
2. 解构需要的状态和方法
3. 删除重复的本地状态和方法
4. 使用store中的方法替换本地逻辑

### 迁移前后对比

**迁移前：**

```typescript
const courses = ref(coursesData);
const selectedLanguage = ref("python");
const filteredCourses = computed(() =>
  courses.value.filter(c => c.type === selectedLanguage.value)
);
```

**迁移后：**

```typescript
const coursesStore = useCoursesStore();
const { filteredCourses, selectedLanguage, setSelectedLanguage } = coursesStore;
```

这样既减少了代码重复，又便于后续维护和扩展。

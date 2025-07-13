import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from '../../src/components/TodoList.vue'

describe('TodoList 组件', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(TodoList)
  })

  it('应该正确渲染初始状态', () => {
    expect(wrapper.find('h2').text()).toBe('待办事项列表')
    expect(wrapper.find('.todo-input').exists()).toBe(true)
    expect(wrapper.find('.add-btn').text()).toBe('添加')
    expect(wrapper.find('.todos').exists()).toBe(true)
  })

  it('应该有三个过滤器按钮', () => {
    const filterButtons = wrapper.findAll('.filter-btn')
    expect(filterButtons).toHaveLength(3)
    expect(filterButtons[0].text()).toBe('全部')
    expect(filterButtons[1].text()).toBe('进行中')
    expect(filterButtons[2].text()).toBe('已完成')
  })

  it('应该能够添加新的待办事项', async () => {
    const input = wrapper.find('.todo-input')
    const addButton = wrapper.find('.add-btn')

    await input.setValue('学习 Vue3 测试')
    await addButton.trigger('click')

    const todoItems = wrapper.findAll('.todo-item')
    expect(todoItems).toHaveLength(1)
    expect(todoItems[0].find('.todo-text').text()).toBe('学习 Vue3 测试')
  })

  it('应该能够通过回车键添加待办事项', async () => {
    const input = wrapper.find('.todo-input')
    
    await input.setValue('学习 TypeScript')
    await input.trigger('keyup.enter')

    const todoItems = wrapper.findAll('.todo-item')
    expect(todoItems).toHaveLength(1)
    expect(todoItems[0].find('.todo-text').text()).toBe('学习 TypeScript')
  })

  it('不应该添加空的待办事项', async () => {
    const addButton = wrapper.find('.add-btn')
    await addButton.trigger('click')

    const todoItems = wrapper.findAll('.todo-item')
    expect(todoItems).toHaveLength(0)
  })

  it('应该能够切换待办事项的完成状态', async () => {
    // 先添加一个待办事项
    const input = wrapper.find('.todo-input')
    const addButton = wrapper.find('.add-btn')
    await input.setValue('测试待办事项')
    await addButton.trigger('click')

    const checkbox = wrapper.find('.todo-checkbox')
    await checkbox.trigger('change')

    // 检查是否添加了 completed 类
    const todoItem = wrapper.find('.todo-item')
    expect(todoItem.classes()).toContain('completed')
  })

  it('应该能够删除待办事项', async () => {
    // 先添加一个待办事项
    const input = wrapper.find('.todo-input')
    const addButton = wrapper.find('.add-btn')
    await input.setValue('要删除的待办事项')
    await addButton.trigger('click')

    expect(wrapper.findAll('.todo-item')).toHaveLength(1)

    // 删除待办事项
    const deleteButton = wrapper.find('.delete-btn')
    await deleteButton.trigger('click')

    expect(wrapper.findAll('.todo-item')).toHaveLength(0)
  })

  it('应该正确显示统计信息', async () => {
    // 添加几个待办事项
    const input = wrapper.find('.todo-input')
    const addButton = wrapper.find('.add-btn')

    await input.setValue('第一个待办事项')
    await addButton.trigger('click')
    
    await input.setValue('第二个待办事项')
    await addButton.trigger('click')

    const stats = wrapper.find('.stats')
    expect(stats.text()).toContain('总计: 2')
    expect(stats.text()).toContain('已完成: 0')
    expect(stats.text()).toContain('进行中: 2')
  })

  it('应该能够过滤待办事项', async () => {
    // 添加几个待办事项
    const input = wrapper.find('.todo-input')
    const addButton = wrapper.find('.add-btn')

    await input.setValue('进行中的任务')
    await addButton.trigger('click')
    
    await input.setValue('已完成的任务')
    await addButton.trigger('click')

    // 将第二个任务标记为完成
    const checkboxes = wrapper.findAll('.todo-checkbox')
    await checkboxes[1].trigger('change')

    // 测试"进行中"过滤器
    const activeFilter = wrapper.findAll('.filter-btn')[1]
    await activeFilter.trigger('click')
    expect(wrapper.findAll('.todo-item')).toHaveLength(1)

    // 测试"已完成"过滤器
    const completedFilter = wrapper.findAll('.filter-btn')[2]
    await completedFilter.trigger('click')
    expect(wrapper.findAll('.todo-item')).toHaveLength(1)

    // 测试"全部"过滤器
    const allFilter = wrapper.findAll('.filter-btn')[0]
    await allFilter.trigger('click')
    expect(wrapper.findAll('.todo-item')).toHaveLength(2)
  })

  it('应该正确应用过滤器按钮的激活状态', async () => {
    const filterButtons = wrapper.findAll('.filter-btn')
    
    // 初始状态，"全部"按钮应该是激活的
    expect(filterButtons[0].classes()).toContain('active')
    expect(filterButtons[1].classes()).not.toContain('active')
    expect(filterButtons[2].classes()).not.toContain('active')

    // 点击"进行中"按钮
    await filterButtons[1].trigger('click')
    expect(filterButtons[0].classes()).not.toContain('active')
    expect(filterButtons[1].classes()).toContain('active')
    expect(filterButtons[2].classes()).not.toContain('active')
  })

  it('应该正确处理多个待办事项的删除', async () => {
    // 添加多个待办事项
    const input = wrapper.find('.todo-input')
    const addButton = wrapper.find('.add-btn')

    await input.setValue('任务1')
    await addButton.trigger('click')
    
    await input.setValue('任务2')
    await addButton.trigger('click')
    
    await input.setValue('任务3')
    await addButton.trigger('click')

    expect(wrapper.findAll('.todo-item')).toHaveLength(3)

    // 删除第二个任务
    const deleteButtons = wrapper.findAll('.delete-btn')
    await deleteButtons[1].trigger('click')

    expect(wrapper.findAll('.todo-item')).toHaveLength(2)
    
    // 检查剩余的任务文本
    const todoTexts = wrapper.findAll('.todo-text')
    expect(todoTexts[0].text()).toBe('任务1')
    expect(todoTexts[1].text()).toBe('任务3')
  })
}) 
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '../../src/components/Counter.vue'

describe('Counter 组件', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(Counter)
  })

  it('应该正确渲染初始状态', () => {
    expect(wrapper.find('h2').text()).toBe('计数器: 0')
    expect(wrapper.find('.btn').exists()).toBe(true)
  })

  it('应该有三个按钮', () => {
    const buttons = wrapper.findAll('.btn')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].text()).toBe('增加')
    expect(buttons[1].text()).toBe('减少')
    expect(buttons[2].text()).toBe('重置')
  })

  it('点击增加按钮应该增加计数', async () => {
    const incrementButton = wrapper.findAll('.btn')[0]
    await incrementButton.trigger('click')
    expect(wrapper.find('h2').text()).toBe('计数器: 1')
  })

  it('点击减少按钮应该减少计数', async () => {
    // 先增加几次
    const incrementButton = wrapper.findAll('.btn')[0]
    await incrementButton.trigger('click')
    await incrementButton.trigger('click')
    expect(wrapper.find('h2').text()).toBe('计数器: 2')

    // 然后减少
    const decrementButton = wrapper.findAll('.btn')[1]
    await decrementButton.trigger('click')
    expect(wrapper.find('h2').text()).toBe('计数器: 1')
  })

  it('点击重置按钮应该将计数重置为0', async () => {
    // 先增加几次
    const incrementButton = wrapper.findAll('.btn')[0]
    await incrementButton.trigger('click')
    await incrementButton.trigger('click')
    expect(wrapper.find('h2').text()).toBe('计数器: 2')

    // 然后重置
    const resetButton = wrapper.findAll('.btn')[2]
    await resetButton.trigger('click')
    expect(wrapper.find('h2').text()).toBe('计数器: 0')
  })

  it('当计数大于10时应该显示消息', async () => {
    // 初始状态不应该显示消息
    expect(wrapper.find('.message').exists()).toBe(false)

    // 增加11次
    const incrementButton = wrapper.findAll('.btn')[0]
    for (let i = 0; i < 11; i++) {
      await incrementButton.trigger('click')
    }

    expect(wrapper.find('h2').text()).toBe('计数器: 11')
    expect(wrapper.find('.message').exists()).toBe(true)
    expect(wrapper.find('.message').text()).toBe('数字很大了！')
  })

  it('应该正确处理负数', async () => {
    const decrementButton = wrapper.findAll('.btn')[1]
    await decrementButton.trigger('click')
    expect(wrapper.find('h2').text()).toBe('计数器: -1')
  })

  it('应该正确应用CSS类', () => {
    expect(wrapper.find('.counter').exists()).toBe(true)
    const buttons = wrapper.findAll('.btn')
    buttons.forEach((button: any) => {
      expect(button.classes()).toContain('btn')
    })
  })
}) 
import { describe, test } from 'vitest'
import { mount } from '@vue/test-utils'
import JsonView from '../JsonView.vue'

describe('JsonView Component Test', () => {
  const propMsg = JSON.stringify({ msg: 'hello' })
  const wrapper = mount(JsonView, {
    props: {
      data: propMsg,
    },
  })

  test('should exist', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('JsonView component should have props', () => {
    const style = 'flex-grow: 1; flex-shrink: 1; flex-basis: 0%; width: 100%; white-space: pre-wrap; overflow-y: auto; overflow-x: hidden;'
    const labelInstance = wrapper.attributes()
    expect(labelInstance).toHaveProperty('expand-depth', '2')
    expect(labelInstance).toHaveProperty('value', propMsg)
    expect(labelInstance).toHaveProperty('style', style)
    expect(labelInstance).toHaveProperty('copyable')
    expect(labelInstance).toHaveProperty('boxed')
    expect(labelInstance).toHaveProperty('expanded')
  })
})

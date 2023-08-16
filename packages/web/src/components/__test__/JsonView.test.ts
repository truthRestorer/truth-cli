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
    const labelInstance = wrapper.attributes()
    expect(labelInstance).toHaveProperty('class', 'vjs-tree')
    expect(labelInstance).toHaveProperty('style', 'overflow: hidden;')
  })
})

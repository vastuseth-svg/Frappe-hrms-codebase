import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Login from '../Login.vue'
import { useAuthStore } from '../../../stores/auth'

// Mock the auth store module
vi.mock('../../../stores/auth', () => {
  const loginMock = vi.fn()
  const errorMock = { value: null }
  const loadingMock = { value: false }
  return {
    useAuthStore: () => ({
      login: loginMock,
      error: errorMock,
      loading: loadingMock
    })
  }
})

describe('Login.vue', () => {
  it('renders login form elements correctly', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('h2').text()).toBe('Sign in to your account')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('Continue with OTP')
  })

  it('submits form credentials to the auth store', async () => {
    const wrapper = mount(Login)
    const store = useAuthStore()

    // Fill the email and password fields
    await wrapper.find('input[type="email"]').setValue('test@domain.com')
    await wrapper.find('input[type="password"]').setValue('password123')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.login).toHaveBeenCalledWith('test@domain.com', 'password123')
  })
})

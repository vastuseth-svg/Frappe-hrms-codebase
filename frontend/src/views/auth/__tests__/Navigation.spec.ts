import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import App from '../../../App.vue'
import { useAuthStore } from '../../../stores/auth'

// Mock the auth store module
vi.mock('../../../stores/auth', () => {
  const permittedModulesMock = { value: [] as string[] }
  const stepMock = { value: 'dashboard' }
  const sessionTokenMock = { value: 'mock-token' }
  const userMock = { value: 'test@domain.com' }
  const logoutMock = vi.fn()
  const bootstrapPermissionsMock = vi.fn()
  return {
    useAuthStore: () => ({
      permittedModules: permittedModulesMock,
      step: stepMock,
      sessionToken: sessionTokenMock,
      user: userMock,
      logout: logoutMock,
      bootstrapPermissions: bootstrapPermissionsMock
    })
  }
})

describe('App.vue Navigation Guard & Role-Aware Shell', () => {
  it('does not render navigation tabs when permittedModules is empty', () => {
    const store = useAuthStore()
    store.permittedModules.value = []
    
    const wrapper = mount(App)
    // Header should exist but nav list should not show buttons
    expect(wrapper.find('nav').findAll('button').length).toBe(0)
  })

  it('renders Tenant Setup and HR Dashboard tabs when user has Tenant Setup permission', () => {
    const store = useAuthStore()
    store.permittedModules.value = ['Tenant Setup']
    
    const wrapper = mount(App)
    const navButtons = wrapper.find('nav').findAll('button')
    expect(navButtons.length).toBe(2)
    expect(navButtons[0].text()).toContain('Tenant Setup')
    expect(navButtons[1].text()).toContain('HR Dashboard')
  })

  it('renders only Web Punch tab when user has Punch In-Out permission', () => {
    const store = useAuthStore()
    store.permittedModules.value = ['Punch In-Out']
    
    const wrapper = mount(App)
    const navButtons = wrapper.find('nav').findAll('button')
    expect(navButtons.length).toBe(1)
    expect(navButtons[0].text()).toContain('Web Punch')
  })
})

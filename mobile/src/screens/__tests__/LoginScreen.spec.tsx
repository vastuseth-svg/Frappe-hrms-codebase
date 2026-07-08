import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginScreen from '../LoginScreen'
import * as authService from '../../services/authService'

// Mock react-native components for jsdom/web testing environment
vi.mock('react-native', () => {
  return {
    StyleSheet: {
      create: (styles: any) => styles,
    },
    View: ({ children, style }: any) => <div style={style}>{children}</div>,
    Text: ({ children, style }: any) => <span style={style}>{children}</span>,
    TextInput: ({ value, onChangeText, placeholder, style, secureTextEntry }: any) => (
      <input
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        type={secureTextEntry ? 'password' : 'text'}
        style={style}
      />
    ),
    TouchableOpacity: ({ children, onPress, disabled, style }: any) => (
      <button onClick={onPress} disabled={disabled} style={style}>
        {children}
      </button>
    ),
    ActivityIndicator: () => <span>Loading...</span>,
  }
})

// Mock authService login API
vi.mock('../../services/authService', () => ({
  apiLogin: vi.fn(),
}))

describe('LoginScreen.tsx', () => {
  it('renders login screen form elements correctly', () => {
    const onLoginSuccessMock = vi.fn()
    render(<LoginScreen onLoginSuccess={onLoginSuccessMock} />)

    expect(screen.getByText('Shree')).toBeTruthy()
    expect(screen.getByPlaceholderText('you@domain.com')).toBeTruthy()
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy()
    expect(screen.getByText('Continue with OTP')).toBeTruthy()
  })

  it('triggers authentication and callback on credentials submission', async () => {
    const onLoginSuccessMock = vi.fn()
    vi.mocked(authService.apiLogin).mockResolvedValue({ status: 'success' })

    render(<LoginScreen onLoginSuccess={onLoginSuccessMock} />)

    // Set credentials
    fireEvent.change(screen.getByPlaceholderText('you@domain.com'), { target: { value: 'test_mobile@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } })

    // Submit form
    fireEvent.click(screen.getByText('Continue with OTP'))

    await waitFor(() => {
      expect(authService.apiLogin).toHaveBeenCalledWith('test_mobile@example.com', 'password123')
      expect(onLoginSuccessMock).toHaveBeenCalledWith('test_mobile@example.com')
    })
  })
})

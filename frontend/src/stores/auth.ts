import { reactive, toRefs } from 'vue'

interface AuthState {
	user: string | null
	tenant: string | null
	roles: string[]
	permittedModules: string[]
	sessionToken: string | null
	expiryTime: string | null
	step: 'login' | 'verify-otp' | 'dashboard'
	loading: boolean
	error: string | null
	tempUser: string | null
}

const state = reactive<AuthState>({
	user: localStorage.getItem('auth_user'),
	tenant: localStorage.getItem('auth_tenant'),
	roles: JSON.parse(localStorage.getItem('auth_roles') || '[]'),
	permittedModules: JSON.parse(localStorage.getItem('auth_permitted_modules') || '[]'),
	sessionToken: localStorage.getItem('auth_token'),
	expiryTime: localStorage.getItem('auth_expiry'),
	step: localStorage.getItem('auth_token') ? 'dashboard' : 'login',
	loading: false,
	error: null,
	tempUser: null
})

export function useAuthStore() {
	async function login(username: string, password: string) {
		state.loading = true
		state.error = null
		try {
			const res = await fetch('/api/method/hrms_saas.api.auth.login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ usr: username, pwd: password }),
				credentials: 'omit'
			})
			const data = await res.json()
			
			if (data.message && data.message.status === 'success') {
				state.tempUser = username
				state.step = 'verify-otp'
			} else {
				// Handle standard Frappe exception response
				const errorMsg = data._server_messages 
					? JSON.parse(JSON.parse(data._server_messages)[0]).message 
					: (data.message || 'Invalid credentials')
				state.error = errorMsg
			}
		} catch (err: any) {
			state.error = err.message || 'Failed to connect to backend'
		} finally {
			state.loading = false
		}
	}

	async function verifyOtp(otpCode: string) {
		state.loading = true
		state.error = null
		try {
			const res = await fetch('/api/method/hrms_saas.api.auth.verify_otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ usr: state.tempUser, otp: otpCode, device_type: 'Web' }),
				credentials: 'omit'
			})
			const data = await res.json()
			
			if (data.message && data.message.status === 'success') {
				const session = data.message.session
				state.sessionToken = session.session_token
				state.expiryTime = session.expiry_time
				state.user = state.tempUser
				
				localStorage.setItem('auth_token', session.session_token)
				localStorage.setItem('auth_expiry', session.expiry_time)
				localStorage.setItem('auth_user', state.tempUser!)
				
				await bootstrapPermissions()
			} else {
				const errorMsg = data._server_messages 
					? JSON.parse(JSON.parse(data._server_messages)[0]).message 
					: (data.message || 'Invalid OTP')
				state.error = errorMsg
			}
		} catch (err: any) {
			state.error = err.message || 'Failed to verify OTP'
		} finally {
			state.loading = false
		}
	}

	async function requestOtp(username: string) {
		state.loading = true
		state.error = null
		try {
			const res = await fetch('/api/method/hrms_saas.api.auth.request_otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ usr: username }),
				credentials: 'omit'
			})
			const data = await res.json()
			if (data.message && data.message.status === 'success') {
				return data.message
			} else {
				const errorMsg = data._server_messages 
					? JSON.parse(JSON.parse(data._server_messages)[0]).message 
					: (data.message || 'Failed to request OTP')
				state.error = errorMsg
			}
		} catch (err: any) {
			state.error = err.message || 'Failed to connect to backend'
		} finally {
			state.loading = false
		}
	}

	async function bootstrapPermissions() {
		try {
			const res = await fetch('/api/method/hrms_saas.api.auth.permission_bootstrap', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ session_token: state.sessionToken }),
				credentials: 'omit'
			})
			const data = await res.json()
			if (data.message && data.message.status === 'success') {
				const payload = data.message
				state.roles = payload.roles
				state.permittedModules = payload.permitted_modules
				state.tenant = payload.tenant
				
				localStorage.setItem('auth_roles', JSON.stringify(payload.roles))
				localStorage.setItem('auth_permitted_modules', JSON.stringify(payload.permitted_modules))
				localStorage.setItem('auth_tenant', payload.tenant)
				
				state.step = 'dashboard'
			}
		} catch (err) {
			logout()
		}
	}

	function logout() {
		if (state.sessionToken) {
			fetch('/api/method/hrms_saas.api.auth.logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ session_token: state.sessionToken }),
				credentials: 'omit'
			}).catch(() => {})
		}
		
		state.user = null
		state.tenant = null
		state.roles = []
		state.permittedModules = []
		state.sessionToken = null
		state.expiryTime = null
		state.tempUser = null
		state.step = 'login'
		
		localStorage.removeItem('auth_token')
		localStorage.removeItem('auth_expiry')
		localStorage.removeItem('auth_user')
		localStorage.removeItem('auth_roles')
		localStorage.removeItem('auth_permitted_modules')
		localStorage.removeItem('auth_tenant')
	}

	return {
		...toRefs(state),
		login,
		verifyOtp,
		logout,
		bootstrapPermissions,
		requestOtp
	}
}

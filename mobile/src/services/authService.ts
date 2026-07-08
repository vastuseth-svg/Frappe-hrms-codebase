const API_URL = 'http://localhost:8000';

class StorageHelper {
	private memoryStore: Record<string, string> = {};

	getItem(key: string): string | null {
		if (typeof window !== 'undefined' && window.localStorage) {
			try {
				return window.localStorage.getItem(key);
			} catch (e) {}
		}
		return this.memoryStore[key] || null;
	}

	setItem(key: string, value: string): void {
		if (typeof window !== 'undefined' && window.localStorage) {
			try {
				window.localStorage.setItem(key, value);
				return;
			} catch (e) {}
		}
		this.memoryStore[key] = value;
	}

	removeItem(key: string): void {
		if (typeof window !== 'undefined' && window.localStorage) {
			try {
				window.localStorage.removeItem(key);
				return;
			} catch (e) {}
		}
		delete this.memoryStore[key];
	}
}

export const mobileStorage = new StorageHelper();

export async function apiLogin(usr: string, pwd: string) {
	const res = await fetch(`${API_URL}/api/method/hrms_saas.api.auth.login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ usr, pwd }),
		credentials: 'omit'
	});
	const data = await res.json();
	if (data.message && data.message.status === 'success') {
		return data.message;
	} else {
		throw new Error(data.message || 'Invalid credentials');
	}
}

export async function apiVerifyOtp(usr: string, otp: string) {
	const res = await fetch(`${API_URL}/api/method/hrms_saas.api.auth.verify_otp`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ usr, otp, device_type: 'Mobile' }),
		credentials: 'omit'
	});
	const data = await res.json();
	if (data.message && data.message.status === 'success') {
		const session = data.message.session;
		mobileStorage.setItem('token', session.session_token);
		mobileStorage.setItem('user', usr);
		return session;
	} else {
		throw new Error(data.message || 'Invalid OTP');
	}
}

export async function apiBootstrap() {
	const token = mobileStorage.getItem('token');
	if (!token) throw new Error('No token found');

	const res = await fetch(`${API_URL}/api/method/hrms_saas.api.auth.permission_bootstrap`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ session_token: token }),
		credentials: 'omit'
	});
	const data = await res.json();
	if (data.message && data.message.status === 'success') {
		mobileStorage.setItem('permitted_modules', JSON.stringify(data.message.permitted_modules));
		return data.message;
	} else {
		throw new Error('Failed to bootstrap permissions');
	}
}

export async function apiLogout() {
	const token = mobileStorage.getItem('token');
	if (token) {
		fetch(`${API_URL}/api/method/hrms_saas.api.auth.logout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ session_token: token }),
			credentials: 'omit'
		}).catch(() => {});
	}
	mobileStorage.removeItem('token');
	mobileStorage.removeItem('user');
	mobileStorage.removeItem('permitted_modules');
}

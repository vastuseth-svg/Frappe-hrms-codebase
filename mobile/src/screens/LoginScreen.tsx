import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { apiLogin } from '../services/authService';

interface LoginScreenProps {
	onLoginSuccess: (username: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async () => {
		if (!email || !password) {
			setError('Please enter both email and password');
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await apiLogin(email, password);
			onLoginSuccess(email);
		} catch (err: any) {
			setError(err.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.header}>
					<Text style={styles.title}><Text style={{ color: '#6366F1' }}>Shree</Text><Text style={styles.accent}> HRMS</Text></Text>
					<Text style={styles.subtitle}>Mobile HRMS Portal Login</Text>
				</View>

				{error && (
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}

				<View style={styles.form}>
					<Text style={styles.label}>Email Address</Text>
					<TextInput
						style={styles.input}
						value={email}
						onChangeText={setEmail}
						placeholder="you@domain.com"
						placeholderTextColor="#9C9C9C"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>

					<Text style={styles.label}>Password</Text>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						placeholder="••••••••"
						placeholderTextColor="#9C9C9C"
						secureTextEntry
						autoCapitalize="none"
						autoCorrect={false}
					/>

					<TouchableOpacity
						style={[styles.button, loading && styles.buttonDisabled]}
						onPress={handleLogin}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#FFF" />
						) : (
							<Text style={styles.buttonText}>Continue with OTP</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FAFAFA',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	card: {
		width: '100%',
		maxWidth: 400,
		backgroundColor: '#FFF',
		borderRadius: 12,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 16,
		elevation: 4,
		borderWidth: 1,
		borderColor: '#E8E8EC',
	},
	header: {
		alignItems: 'center',
		marginBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#0A0A0A',
		letterSpacing: -1,
	},
	accent: {
		color: '#20970B',
	},
	subtitle: {
		fontSize: 14,
		color: '#6B6B6B',
		marginTop: 6,
	},
	errorContainer: {
		backgroundColor: 'rgba(239, 68, 68, 0.1)',
		borderColor: 'rgba(239, 68, 68, 0.25)',
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
	},
	errorText: {
		color: '#EF4444',
		fontSize: 13,
		textAlign: 'center',
	},
	form: {
		gap: 16,
	},
	label: {
		fontSize: 12,
		fontWeight: '600',
		color: '#6B6B6B',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: '#E8E8EC',
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 15,
		color: '#0A0A0A',
		backgroundColor: '#FFF',
	},
	button: {
		height: 48,
		backgroundColor: '#6366F1',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 8,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: '#FFF',
		fontSize: 15,
		fontWeight: '600',
	},
});

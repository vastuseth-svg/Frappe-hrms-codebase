import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { apiVerifyOtp, apiBootstrap, apiLogin } from '../services/authService';

interface OTPScreenProps {
	username: string;
	onVerificationSuccess: () => void;
	onBack: () => void;
}

export default function OTPScreen({ username, onVerificationSuccess, onBack }: OTPScreenProps) {
	const [otp, setOtp] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleVerify = async () => {
		if (otp.length < 6) {
			setError('Please enter a 6-digit code');
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await apiVerifyOtp(username, otp);
			await apiBootstrap();
			onVerificationSuccess();
		} catch (err: any) {
			setError(err.message || 'OTP verification failed');
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		setError(null);
		try {
			await apiLogin(username, 'dummy'); // backend login handles OTP generation
			alert('A new OTP has been sent!');
		} catch (err: any) {
			// Ignore mock password error if OTP is still triggered,
			// or handle resend appropriately.
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.header}>
					<Text style={styles.title}><Text style={{ color: '#6366F1' }}>Shree</Text><Text style={styles.accent}> HRMS</Text></Text>
					<Text style={styles.subtitle}>Enter Verification Code</Text>
					<Text style={styles.emailInfo}>Sent to: {username}</Text>
				</View>

				{error && (
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}

				<View style={styles.form}>
					<Text style={styles.label}>6-Digit Code</Text>
					<TextInput
						style={styles.input}
						value={otp}
						onChangeText={setOtp}
						placeholder="000000"
						placeholderTextColor="#9C9C9C"
						keyboardType="number-pad"
						maxLength={6}
						autoFocus
						textAlign="center"
					/>

					<TouchableOpacity
						style={[styles.button, (loading || otp.length < 6) && styles.buttonDisabled]}
						onPress={handleVerify}
						disabled={loading || otp.length < 6}
					>
						{loading ? (
							<ActivityIndicator color="#FFF" />
						) : (
							<Text style={styles.buttonText}>Verify Code</Text>
						)}
					</TouchableOpacity>

					<View style={styles.footerRow}>
						<TouchableOpacity onPress={handleResend}>
							<Text style={styles.footerLink}>Resend OTP</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={onBack}>
							<Text style={styles.footerLinkText}>Back to Login</Text>
						</TouchableOpacity>
					</View>
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
	emailInfo: {
		fontSize: 12,
		color: '#9C9C9C',
		marginTop: 4,
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
		textAlign: 'center',
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: '#E8E8EC',
		borderRadius: 8,
		fontSize: 20,
		color: '#0A0A0A',
		backgroundColor: '#FFF',
		letterSpacing: 8,
		fontWeight: 'bold',
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
	footerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 12,
		width: '100%',
		alignItems: 'center',
	},
	footerLink: {
		color: '#6366F1',
		fontSize: 13,
		fontWeight: '600',
	},
	footerLinkText: {
		color: '#6B6B6B',
		fontSize: 13,
		fontWeight: '600',
		marginLeft: 'auto',
	},
});

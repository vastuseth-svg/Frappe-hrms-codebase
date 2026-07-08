import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import { mobileStorage, apiLogout } from '../services/authService';

export default function HomeScreen() {
  const [loginStep, setLoginStep] = useState<'login' | 'otp' | 'home'>('login');
  const [tempUser, setTempUser] = useState('');

  useEffect(() => {
    const token = mobileStorage.getItem('token');
    if (token) {
      setLoginStep('home');
    }
  }, []);

  const handleLoginSuccess = (usr: string) => {
    setTempUser(usr);
    setLoginStep('otp');
  };

  const handleVerificationSuccess = () => {
    setLoginStep('home');
  };

  const handleLogout = async () => {
    await apiLogout();
    setLoginStep('login');
  };

  // Punch state
  const [punchStatus, setPunchStatus] = useState<'out' | 'in'>('out');
  const [gpsVerified, setGpsVerified] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);

  const handleGpsCheck = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setGpsVerified(true);
      Alert.alert('GPS Location Verified', 'Coordinates match branch zone criteria.');
    }, 1000);
  };

  const handlePunchAction = () => {
    if (!gpsVerified) {
      Alert.alert('Location Required', 'Please run Step 1 (GPS check) first.');
      return;
    }
    const nextStatus = punchStatus === 'out' ? 'in' : 'out';
    setPunchStatus(nextStatus);
    setGpsVerified(false);
    setSelfieTaken(false);
    Alert.alert('Attendance Logged', `Punched ${nextStatus.toUpperCase()} successfully.`);
  };



  if (loginStep === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (loginStep === 'otp') {
    return (
      <OTPScreen
        username={tempUser}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={() => setLoginStep('login')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Editorial Header */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <View>
              <Text style={styles.overline}>PHASE 1 / MOBILE PORTAL</Text>
              <Text style={styles.displayTitle}><Text style={{ color: '#6366F1' }}>Shree</Text><Text style={styles.secondaryBrand}> HRMS</Text></Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Quietly confident developer-centric HRMS application shell.</Text>
        </View>

        {/* Punch Interface */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Attendance Checkin</Text>
            <Text style={styles.cardSubtitle}>Submit biometrics and coordinate checks.</Text>
          </View>

            <View style={styles.formGroup}>
              {/* Row 1: GPS */}
              <View style={styles.listRow}>
                <View style={styles.rowMeta}>
                  <Text style={styles.rowTitle}>1. Geolocation Check</Text>
                  <Text style={styles.rowDesc}>Retrieves device coordinates.</Text>
                </View>
                
                {/* Chip-style Tag button */}
                <TouchableOpacity
                  style={[styles.chipTag, gpsVerified && styles.chipTagActive]}
                  onPress={handleGpsCheck}
                  disabled={gpsVerified}
                >
                  <Text style={[styles.chipTagText, gpsVerified && styles.chipTagTextActive]}>
                    {isLocating ? 'Locating...' : gpsVerified ? '✓ Mapped' : 'Verify'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Row 2: Selfie */}
              <View style={styles.listRow}>
                <View style={styles.rowMeta}>
                  <Text style={styles.rowTitle}>2. Selfie Capture</Text>
                  <Text style={styles.rowDesc}>Confirms biometric integrity.</Text>
                </View>
                <TouchableOpacity
                  style={[styles.chipTag, selfieTaken && styles.chipTagActive]}
                  onPress={() => setSelfieTaken(true)}
                >
                  <Text style={[styles.chipTagText, selfieTaken && styles.chipTagTextActive]}>
                    {selfieTaken ? '✓ Uploaded' : 'Capture'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Primary button (Indigo fill, white text, 6px radius, medium weight) */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handlePunchAction}
              >
                <Text style={styles.primaryButtonText}>
                  CONFIRM {punchStatus === 'out' ? 'PUNCH IN' : 'PUNCH OUT'}
                </Text>
              </TouchableOpacity>
            </View>
        </View>

        <Text style={styles.footerText}>SaaS HRMS Platform • Shree HRMS</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Background
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 32,
  },
  overline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366F1', // Primary
    letterSpacing: 1.5,
  },
  displayTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0A0A0A', // Text Primary
    letterSpacing: -1,
    marginTop: 4,
  },
  secondaryBrand: {
    color: '#20970B', // Green highlight
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B', // Text Secondary
    marginTop: 6,
    lineHeight: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E8E8EC', // Border
    borderRadius: 6, // 6px radius
    padding: 3,
    backgroundColor: '#FFFFFF', // Surface
    marginBottom: 32,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  activeTabButton: {
    backgroundColor: '#6366F1', // Primary
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B6B6B',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF', // Surface
    borderWidth: 1,
    borderColor: '#E8E8EC',
    borderRadius: 12, // 12px radius
    padding: 24,
    width: '100%',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderColor: '#E8E8EC',
    paddingBottom: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 4,
  },
  formGroup: {
    gap: 20,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E8E8EC',
  },
  rowMeta: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  rowDesc: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  chipTag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999, // rounded-full
    backgroundColor: '#E8E8EC', // gray-100 placeholder bg
  },
  chipTagActive: {
    backgroundColor: '#6366F1', // Active
  },
  chipTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B6B6B',
  },
  chipTagTextActive: {
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#6366F1', // Primary
    height: 38, // medium (38px)
    borderRadius: 6, // 6px radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B6B6B',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF', // Surface
    borderWidth: 1,
    borderColor: '#E8E8EC',
    borderRadius: 6, // 6px radius
    height: 38,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0A0A0A',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  checkbox: {
    height: 20, // 20px size
    width: 20,
    borderRadius: 9999, // rounded-full
    borderWidth: 1,
    borderColor: '#E8E8EC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  successIcon: {
    fontSize: 24,
    color: '#10B981', // Success
    fontWeight: '800',
  },
  successHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  successMeta: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#EF4444', // Destructive
    height: 38,
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '700',
  },
  footerText: {
    fontSize: 12,
    color: '#9C9C9C',
    marginTop: 48,
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
});

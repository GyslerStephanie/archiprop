import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '@/components/ui';
import { colors, spacing, radius, typography } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function LogoMark({ size = 56 }: { size?: number }) {
  const sq = size * 0.4;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
      <View style={{ width: sq, height: sq, borderRadius: 6, backgroundColor: colors.textPrimary }} />
      <View style={{ width: sq, height: sq, borderRadius: 6, backgroundColor: colors.teal }} />
      <View style={{ width: sq, height: sq, borderRadius: 6, backgroundColor: colors.teal }} />
      <View style={{ width: sq, height: sq, borderRadius: 6, backgroundColor: colors.textPrimary }} />
    </View>
  );
}

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { setUser, isLoading, setLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      // Demo mode: no backend configured, mock a login so the app is usable.
      if (!isSupabaseConfigured || !supabase) {
        await new Promise((r) => setTimeout(r, 800));
        setUser({ id: 'mock-user-id', email });
        return;
      }

      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          Alert.alert('Sign up failed', error.message);
          return;
        }
        // With email confirmation on, there's a user but no session yet.
        if (data.user && !data.session) {
          Alert.alert(
            'Confirm your email',
            'We sent you a confirmation link. Verify your email, then sign in.'
          );
          setIsRegister(false);
        }
        // Otherwise onAuthStateChange picks up the new session automatically.
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          Alert.alert('Sign in failed', error.message);
          return;
        }
        // Session is applied via the onAuthStateChange listener in useAuthSession.
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.background, '#111827']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <LogoMark size={64} />
            <Text style={[typography.wordmark, styles.wordmark]}>ARCHIPROP</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              placeholder="xxxxx@xmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              containerStyle={styles.inputWrap}
            />
            <Input
              placeholder="••••••••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              containerStyle={styles.inputWrap}
            />
          </View>

          {/* CTA */}
          <Button
            label={isRegister ? 'Create Account' : 'Start'}
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.button}
          />

          {/* Toggle register/login */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {isRegister ? 'Already have an account? ' : "You don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.toggleLink}>{isRegister ? 'Sign In' : 'Register'}</Text>
            </TouchableOpacity>
          </View>

          {/* Pagination dots */}
          <View style={styles.dots}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  kav: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  wordmark: {
    letterSpacing: 4,
  },
  form: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  inputWrap: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  toggleLink: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  dotActive: {
    backgroundColor: colors.teal,
    width: 20,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

interface HeaderProps {
  onBack?: () => void;
  showProfile?: boolean;
  onProfile?: () => void;
}

export function Header({ onBack, showProfile = false, onProfile }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}

        <View style={styles.logoRow}>
          {/* Placeholder logo — replace with actual SVG logo asset */}
          <View style={styles.logoMark}>
            <View style={styles.logoSquare} />
            <View style={[styles.logoSquare, styles.logoSquareTeal]} />
          </View>
          <Text style={[typography.wordmark, styles.wordmark]}>ARCHIPROP</Text>
        </View>

        {showProfile ? (
          <TouchableOpacity style={styles.profileBtn} onPress={onProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.profileBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: colors.textPrimary,
    marginTop: -4,
    fontWeight: '300',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoMark: {
    width: 28,
    height: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  logoSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: colors.textPrimary,
  },
  logoSquareTeal: {
    backgroundColor: colors.teal,
  },
  wordmark: {
    fontSize: 16,
    letterSpacing: 3,
  },
  profileBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 16,
  },
});

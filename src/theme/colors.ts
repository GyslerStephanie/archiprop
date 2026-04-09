export const colors = {
  // Backgrounds
  background: '#0D1117',
  surface: '#1A1F2E',
  surfaceElevated: '#222838',
  card: '#1E2433',

  // Accent
  teal: '#3A8A8E',
  tealLight: '#4AACB0',
  tealDark: '#2A6A6E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8B95A5',
  textMuted: '#556070',

  // UI
  border: '#2A3040',
  inputBackground: '#2A3040',
  overlay: 'rgba(13, 17, 23, 0.85)',

  // Status
  success: '#4CAF82',
  warning: '#F0A500',
  error: '#E05050',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;

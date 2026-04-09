import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, radius } from '@/theme';
import type { OnboardingStackParams } from '@/navigation/types';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'WELCOME TO ARCHIPROP',
    card: null,
    body: 'An AR mobile app that brings architectural models to life at the exact location they\'ll be built.',
  },
  {
    title: null,
    card: 'HOW IT WORKS',
    body: 'If you are a new user, you can select from a public web based library of buildings posted by architects or navigate to an existing site and scan QR Code to generate a building model.',
  },
  {
    title: null,
    card: 'WHAT IS LIDAR?',
    body: 'LiDAR captures millions of precise distance measurement points each second, from which a 3D matrix of its environment can be produced. Information on objects\' position, shape, and behavior can be obtained from this comprehensive mapping of the environment.',
  },
  {
    title: null,
    card: 'GET STARTED',
    body: 'Navigate to a building site, scan the QR code provided by your architect, and see the proposed building come to life in augmented reality.',
  },
];

type NavigationProp = StackNavigationProp<OnboardingStackParams, 'OnboardingSlides'>;

export function OnboardingSlides() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    } else {
      navigation.navigate('Login');
    }
  };

  const skip = () => navigation.navigate('Login');

  return (
    <LinearGradient
      colors={[colors.background, '#111827']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <StatusBar barStyle="light-content" />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoSection}>
        <LogoMark size={48} />
        <Text style={styles.wordmark}>ArchiProp</Text>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.slides}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            {slide.title && <Text style={styles.slideTitle}>{slide.title}</Text>}
            <View style={styles.card}>
              {slide.card && <Text style={styles.cardLabel}>{slide.card}</Text>}
              <Text style={styles.cardBody}>{slide.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.nextBtn} onPress={goToNext}>
        <Text style={styles.nextText}>
          {currentIndex < SLIDES.length - 1 ? 'Next' : 'Get Started'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: insets.bottom + spacing.md }} />
    </LinearGradient>
  );
}

function LogoMark({ size = 40 }: { size?: number }) {
  const sq = size * 0.4;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
      <View style={{ width: sq, height: sq, borderRadius: 4, backgroundColor: colors.textPrimary }} />
      <View style={{ width: sq, height: sq, borderRadius: 4, backgroundColor: colors.teal }} />
      <View style={{ width: sq, height: sq, borderRadius: 4, backgroundColor: colors.teal }} />
      <View style={{ width: sq, height: sq, borderRadius: 4, backgroundColor: colors.textPrimary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  skipBtn: {
    alignSelf: 'flex-end',
    marginRight: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.xs,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  slides: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: '#E8EDF2',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 0.5,
  },
  cardBody: {
    fontSize: 15,
    color: '#2A2A3E',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.lg,
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
  nextBtn: {
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  nextText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});

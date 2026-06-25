import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient();

function Root() {
  // Restore persisted session and subscribe to auth changes.
  useAuthSession();
  const initialized = useAuthStore((s) => s.initialized);

  // Avoid flashing the onboarding screen before the session is restored.
  if (!initialized) return null;

  return <RootNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: '#3A8A8E',
                background: '#0D1117',
                card: '#1A1F2E',
                text: '#FFFFFF',
                border: '#2A3040',
                notification: '#3A8A8E',
              },
            }}
          >
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
            <Root />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import { useThemeStore } from '@/src/features/settings/stores/useThemeStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { isSessionLoading, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !isSessionLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isSessionLoading]);

  // Keep showing splash screen (return null) until fonts are loaded
  if (!loaded) {
    return null;
  }

  // We can render the Nav now. The Nav will handle the specific redirects,
  // but since we waited for isSessionLoading, the state is stable.
  return <RootLayoutNav />;
}

// ... (existing imports)

import { I18nProvider } from '@/src/i18n/I18nContext';

function RootLayoutNav() {
  const { user, isSessionLoading } = useAuthStore();
  const { themeMode, loadTheme, getEffectiveColorScheme } = useThemeStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadTheme();
  }, []);

  // Use the effective color scheme from the store
  const colorScheme = getEffectiveColorScheme();


  useEffect(() => {
    if (isSessionLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, isSessionLoading, segments]);

  if (isSessionLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <I18nProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </I18nProvider>
    </ThemeProvider>
  );
}

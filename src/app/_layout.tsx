import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import "./global.css";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      const inAuthGroup = segments[0] === '(tabs)';

      if (!authenticated && inAuthGroup) {
        // Redirect to login if not authenticated and trying to access tabs
        router.replace('/login');
      } else if (authenticated && segments[0] === 'login') {
        // Redirect to tabs if already authenticated and trying to access login
        router.replace('/(tabs)');
      }
      setIsReady(true);
    };

    checkAuth();
  }, [segments]);

  if (!isReady) return null;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}



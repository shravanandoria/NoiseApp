import { ThemedText } from '@/components/themed-text';
import { PortalHost } from "@rn-primitives/portal";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <>      
      <Stack />
      <PortalHost />

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ThemedText type="small" style={{ color: '#000000' }}>
          Hello World
        </ThemedText>
      </ThemeProvider>
    </>
  );
}

import { CDPHooksProvider } from "@coinbase/cdp-hooks";
import { PortalHost } from "@rn-primitives/portal";
import structuredClone from "@ungap/structured-clone";
import { Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NAV_THEME, THEME } from "@/lib/theme";
import "../global.css";

// Install crypto polyfills.
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone as typeof globalThis.structuredClone;
}

// react-native-quick-crypto / react-native-get-random-values are native (JSI) modules
// with no web implementation; browsers already provide crypto.getRandomValues/crypto.subtle.
// Static `import` would evaluate their native module lookups unconditionally (crashing on
// web), so pull them in with a guarded `require` instead.
if (Platform.OS !== "web") {
  require("react-native-get-random-values");
  require("react-native-quick-crypto").install();
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const cdpProjectId = process.env.EXPO_PUBLIC_COINBASE_CDP_PROJECT_ID ?? "";

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <CDPHooksProvider config={{ projectId: cdpProjectId }}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: THEME.background },
            }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="market/[id]" options={{ animation: "slide_from_right" }} />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </SafeAreaProvider>
    </CDPHooksProvider>
  );
}

import { DarkTheme, type Theme } from "expo-router/react-navigation";

/**
 * Noise App is dark-only (see src/global.css for the source-of-truth
 * HSL tokens used by NativeWind). This mirrors those values for
 * react-navigation chrome (header bar, native screen background).
 */
export const THEME = {
  background: "hsl(248 24% 7%)",
  foreground: "hsl(0 0% 99%)",
  card: "hsl(248 18% 11%)",
  cardForeground: "hsl(0 0% 99%)",
  elevated: "hsl(248 15% 16%)",
  primary: "hsl(233 96% 64%)",
  primaryForeground: "hsl(0 0% 100%)",
  muted: "hsl(248 15% 16%)",
  mutedForeground: "hsl(245 8% 60%)",
  destructive: "hsl(4 90% 58%)",
  up: "hsl(142 71% 50%)",
  down: "hsl(11 92% 58%)",
  border: "hsl(248 13% 20%)",
  ring: "hsl(233 96% 64%)",
  radius: "0.875rem",
} as const;

export const NAV_THEME: Theme = {
  ...DarkTheme,
  colors: {
    background: THEME.background,
    border: THEME.border,
    card: THEME.card,
    notification: THEME.destructive,
    primary: THEME.primary,
    text: THEME.foreground,
  },
};

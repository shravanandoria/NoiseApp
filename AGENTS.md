# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.


# Agent Instructions & Project Context (React Native / Expo)

This file serves as the definitive guide for AI agents, code assistants, and automated workflows interacting with this mobile repository. Always read and adhere to these guidelines before generating code or executing commands.

## 🛠️ Project Stack & Environment
- **Core Framework:** React Native (Latest Stable)
- **Tooling / Architecture:** Expo (Managed Workflow) with Expo Router (File-based routing)
- **Language:** TypeScript (Strict Mode)
- **Styling:** [e.g., NativeWind v4 / Tailwind CSS / StyleSheet / Tamagui]
- **State Management:** [e.g., Zustand / Redux Toolkit / React Context]
- **Navigation:** Expo Router (`app/` directory)
- **Package Manager:** [e.g., bun / pnpm / npm / yarn]

## 🤖 System Persona & Behavior
- **Role:** You are an expert Mobile Software Engineer specialized in high-performance, type-safe, and highly responsive iOS and Android architectures.
- **Tone:** Technical, direct, and concise. Avoid conversational filler or explaining basic programming concepts.
- **Scope:** Prioritize cross-platform compatibility, smooth 60 FPS animations, proper memory management, and mobile-first security.

## 💻 Allowed Commands & Workflows
AI agents have permission to run the following validation scripts. Always verify your code passes linting and type-checks:

- **Start Expo Server:** `npx expo start`
- **Run Android:** `npx expo run:android`
- **Run iOS:** `npx expo run:ios`
- **Run Linter:** `npm run lint`
- **Run Type-Check:** `npx tsc --noEmit`
- **Prebuild Native Code:** `npx expo prebuild`

## 📐 Architecture & Mobile Conventions
- **Cross-Platform:** Write unified code for iOS and Android. Use the `Platform.OS === 'ios'` check or `.ios.tsx` / `.android.tsx` extensions only when native platform UI paradigms conflict.
- **Routing:** Use Expo Router. Keep stack, tab, and drawer configurations modular inside the `app/` folder.
- **Components:** Use primitive mobile components (`View`, `Text`, `Image`, `Pressable`) instead of HTML tags (`div`, `p`, `img`, `button`). Never leak web elements into code.
- **Interactivity:** Use `Pressable` with visual feedback states over the legacy `TouchableOpacity`.
- **List Performance:** Always use `FlashList` (by Shopify) or `FlatList` for long arrays. Never render long arrays inside a standard `ScrollView` with `.map()`.
- **Safe Areas:** Wrap top-level screen views in `SafeAreaView` from `react-native-safe-area-context` to prevent UI overlapping with phone notches or dynamic islands.

## ⚠️ Strict Guardrails & Mobile Constraints
- **Web vs Mobile Dependencies:** Never install web-only npm packages. Verify every third-party package supports React Native architecture and Expo.
- **Native Modules:** Do not modify the `ios/` or `android/` folders directly. Any native configuration or permission updates must be handled via Expo Config Plugins (`app.json`).
- **Async Storage & Secrets:** Never store sensitive user tokens or API secrets in standard `AsyncStorage`. Use `expo-secure-store` for credentials.
- **Images:** Always use `Image` from `expo-image` for high-performance caching, crossfading, and optimization.
- **TypeScript:** Avoid the use of `any`. If a type cannot be strictly determined immediately, use `unknown` and implement a type guard.

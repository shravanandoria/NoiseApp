# Noise App — AI Project Context

> This is the living context document for AI agents working on Noise App. Keep it accurate and update the change log whenever the project changes.

## Project Overview

- **Name:** Noise App
- **Description:** A cross-platform mobile prediction-market application where users can explore prediction outcomes and place bets. Market and event data is sourced from Polymarket APIs.
- **Current stage:** Early development. The Home and Market Details screens are built out with a dark-only design system and dummy data (see "UI / Design System" below). A broad Polymarket API client layer exists but is not yet wired into the UI — screens currently render local dummy data.
- **Target platforms:** iOS and Android, with web support available through Expo.

## Product Direction

The app is intended to let users:

- Discover and search prediction events.
- View event details, markets, outcome prices, volume, liquidity, dates, and tags.
- Select prediction outcomes and place bets.
- Follow the state and result of prediction markets.

These are product goals, not a claim that every feature is currently implemented.

## Current Technical Stack

- **Framework:** React Native 0.86.2
- **Runtime/tooling:** Expo SDK 57 (managed workflow)
- **Navigation:** Expo Router with file-based routing, including the headless `expo-router/ui` tabs API (see below)
- **Language:** TypeScript 6 in strict mode
- **React:** React 19.2.3
- **Package manager:** npm (`package-lock.json`)
- **Styling:** NativeWind v4 (Tailwind for React Native) + `class-variance-authority` + `tailwind-merge`, following the react-native-reusables/shadcn component pattern
- **UI primitives:** `@rn-primitives/*` (avatar, tabs, separator, slot, portal) underlying `src/components/ui/*`
- **Icons:** `lucide-react-native`
- **Charts:** `react-native-gifted-charts` (+ `expo-linear-gradient`, required at runtime for its area-chart fill even with plain start/end colors)
- **Avatars:** DiceBear HTTP image API (no npm package — see `src/lib/dicebear.ts`)
- **Images:** `expo-image`
- **Animations:** `react-native-reanimated`
- **Safe areas:** `react-native-safe-area-context`
- **Platforms:** Android, iOS, and web

## UI / Design System

The app is **dark-only** (not light/dark adaptive) — it deliberately mirrors a dark trading-terminal aesthetic. `app.json` sets `userInterfaceStyle: "dark"`.

- **Design tokens:** `src/global.css` defines the HSL custom properties (`--background`, `--card`, `--elevated`, `--primary`, `--up`, `--down`, `--border`, etc.) directly on `:root` (no `.dark` class needed — dark is the only palette). `tailwind.config.js` maps them to Tailwind color utilities, including the app-specific `up` / `down` / `elevated` tokens used for price-direction coloring and layered surfaces.
  - Colors are HSL, not oklch, even though the original design reference used oklch — React Native's style engine only resolves hex/rgb/hsl, not CSS color functions.
- **`src/lib/theme.ts`** mirrors the same palette as plain hex/hsl strings for non-NativeWind consumers (react-navigation's `ThemeProvider`, and any place that needs a raw color value, e.g. passing `color` to a lucide icon or a chart library).
- **UI primitives** (`src/components/ui/`) were scaffolded via `npx @react-native-reusables/cli@latest add ...` (the `react-native-reusables` package name alone does not exist on npm — the CLI lives at `@react-native-reusables/cli`). This generated `button.tsx`, `card.tsx`, `badge.tsx`, `avatar.tsx`, `tabs.tsx`, `separator.tsx`, `skeleton.tsx`, `text.tsx`. `button.tsx` was extended with app-specific `variant="up"`/`variant="down"` (for Buy Yes/No actions) and `size="xl"` (large pill buttons like Deposit and Buy) — extend this file further rather than one-off styling buttons elsewhere, to keep every button in the app visually consistent.
- **Reusable app components** (`src/components/`): `price-change.tsx` (up/down % badge), `filter-pills.tsx` (generic horizontal chip selector — used for category filters, chart timeframes, and tx-window filters), `segmented-tabs.tsx` (underline tab switcher), `dual-bar.tsx`, `stat-row.tsx`, `section-header.tsx`, `user-avatar.tsx` (DiceBear-backed avatar with initials fallback), `price-chart.tsx` (gifted-charts area chart wrapper), `logo-mark.tsx`, `coming-soon.tsx` (placeholder screen), `nav-tab-button.tsx`.
- **Market-specific components** (`src/components/market/`): `market-icon.tsx`, `market-row.tsx`, `trader-card.tsx`, `holder-row.tsx`, `feed-post-card.tsx`, `market-detail-header.tsx`, `price-section.tsx`, `detail-tabs.tsx`, `holders-tab.tsx`, `feed-tab.tsx`, `about-tab.tsx`, `buy-bar.tsx`.
- **Home screen sections** (`src/components/home/`): `balance-section.tsx`, `top-traders-section.tsx`, `markets-section.tsx`.

### Navigation

Expo Router v57 uses a different tab API than older Expo Router versions — **do not use `@react-navigation/bottom-tabs`'s `tabBar` render prop**; that package isn't even installed here. Instead this app uses the "headless tabs" primitives from `expo-router/ui` (`Tabs`, `TabList`, `TabTrigger`, `TabSlot`), per `src/app/(tabs)/_layout.tsx`:

- `<TabList style={{ display: "none" }}>` declares the actual routes (`name` + `href`) but is visually hidden.
- A separate, custom-styled floating pill nav bar is built from `<TabTrigger name="..." asChild><NavTabButton .../></TabTrigger>` outside the `TabList` — `TabTrigger` forwards an `isFocused` prop to the wrapped component for active-state styling.
- `market/[id].tsx` lives *outside* the `(tabs)` group as a sibling route in the root `Stack`, so pushing it naturally covers the floating tab bar (matches the reference's "hide nav on detail screen" behavior) without extra code.

Root layout (`src/app/_layout.tsx`) also hosts the `CDPHooksProvider` (Coinbase CDP wallet), `SafeAreaProvider`, and the app-wide `Stack`.

### Screens

- **Home** — `src/app/(tabs)/index.tsx`: balance + Deposit, Weekly Top Traders horizontal scroll, Watchlist/Markets/Live segmented tabs, category filter pills, low-fees banner, market list.
- **Market Details** — `src/app/market/[id].tsx`: header (back, icon, symbol/category, action icons), price/change/volume, area price chart with timeframe pills, Holders/Feed/About segmented tabs, sticky bottom Buy Yes/No bar.
- **Search / Portfolio / Social / Profile** (`src/app/(tabs)/{search,portfolio,social,profile}.tsx`) are intentionally minimal "coming soon" placeholders (via the shared `ComingSoon` component) — they exist only so the 5-icon nav bar (matching the design reference) doesn't dead-end. They are **not** built out yet.

### Dummy data

All screens currently render local dummy data from `src/lib/dummy-data/` (`markets.ts`, `price-series.ts`, `account.ts`) — chosen deliberately over wiring the real Polymarket client (see below) so UI work could proceed independently. `price-series.ts` generates a deterministic seeded pseudo-random walk per market+timeframe (same pattern as the design reference), not real price history.

**Not yet done / consciously deferred:**
- Wiring `src/lib/dummy-data/markets.ts` up to the real `src/lib/polymarket_apis/*` clients.
- Custom typography (the design reference used "Plus Jakarta Sans"). Deferred because Google Fonts via `expo-google-fonts` ship as separate static font files per weight, not a single variable-weight family — correctly mapping every `font-medium`/`font-bold`/`font-extrabold` utility used across the app to the right font *file* (RN can't fake weight the way CSS can) was judged not worth the risk/effort for a cosmetic change that wasn't requested. The app currently uses the RN system font. Revisit if custom typography is explicitly wanted.
- Search, Portfolio, Social, and Profile screens are placeholders only.

### Design reference

The visual design was ported from a Lovable project named **"NoiseApp Project"** (project ID `76088a4f-27ca-4c97-9062-3d4f9083caf7`, workspace "NoiseApp's Lovable"), accessible via the `lovable` MCP server. That project is a web (TanStack Start) implementation of the same two screens and is useful as a visual/behavioral reference, but its code (React DOM, recharts, react-router) is not directly portable — treat it as a design spec, not a source to copy from.

## Project Structure

```text
assets/                        Static images and app icons
src/app/                       Expo Router screens and layouts
src/app/_layout.tsx             Root Stack, providers (CDP wallet, SafeArea, nav theme)
src/app/(tabs)/_layout.tsx      Headless tabs layout + floating nav bar
src/app/(tabs)/index.tsx        Home screen
src/app/(tabs)/{search,portfolio,social,profile}.tsx  Placeholder screens
src/app/market/[id].tsx         Market Details screen
src/components/                Shared UI components
src/components/ui/             Design-system primitives (button, card, badge, avatar, tabs, separator, skeleton, text)
src/components/home/           Home-screen section components
src/components/market/         Market-detail section/row components
src/hooks/                     Shared React hooks
src/lib/                       Data access and domain utilities
src/lib/theme.ts               Dark palette as raw hex/hsl (for react-navigation, icon colors, chart colors)
src/lib/dicebear.ts             DiceBear avatar URL helper
src/lib/color.ts                hex -> rgba helper (for per-market tint colors)
src/lib/dummy-data/            Dummy markets, price series, account data
src/lib/polymarket_apis/       Polymarket API clients (events, markets, orderbook_pricing, orders, trades, rebates, rewards, profile, search) — not yet wired into the UI
app.json                       Expo application configuration
package.json                   Dependencies and npm scripts
AGENTS.md                      Mandatory engineering instructions for AI agents
```

The `@/*` TypeScript alias resolves to `src/*`, and `@/assets/*` resolves to `assets/*`.

## Polymarket Integration

The current API client uses the public Polymarket Gamma API:

```text
https://gamma-api.polymarket.com
```

The client lives in `src/lib/polymarket_apis/` (not yet wired into any screen — the UI uses `src/lib/dummy-data/` instead):

- `events.ts` — cursor/offset event listing, lookup by ID/slug, event tags, typed models, request validation, abort support.
- `markets.ts` — cursor-paginated (`/markets/keyset`) and offset-paginated (`/markets`) market listing, with the full documented filter/sort surface for each (they are not parameter-identical — see the file for which params are keyset-only vs. offset-only).
- `orderbook_pricing.ts`, `orders.ts`, `trades.ts`, `rebates.ts`, `rewards.ts`, `profile.ts`, `search.ts` — additional Polymarket API surfaces (orders, trading history, rebates/rewards, profile management, search).

No authenticated trading, wallet connection, order placement, or transaction flow is wired into the UI yet, though `@coinbase/cdp-hooks`/`@coinbase/cdp-core` (Coinbase CDP embedded wallet) are integrated at the provider level (`src/app/_layout.tsx`).

## Current App Configuration

- App name and slug: `NoiseApp`
- App scheme: `noiseapp`
- Orientation: portrait
- User interface style: **dark** (dark-only app, not adaptive)
- Typed routes: enabled
- React Compiler: enabled
- Web output: static

## Engineering Rules

Before changing implementation code, read and follow `AGENTS.md`. In particular:

- Use the exact Expo SDK 57 documentation at <https://docs.expo.dev/versions/v57.0.0/> — Expo Router's tab APIs in particular have changed from older versions; see "Navigation" above before touching tab-bar code.
- Keep TypeScript strict and avoid `any`; prefer `unknown` with type guards.
- Use Expo Router and keep routes under `src/app/`.
- Use React Native primitives and `Pressable`, not HTML elements or legacy touchables.
- Use `SafeAreaView` for top-level screens.
- Use `expo-image` for images.
- Use `FlatList` or `FlashList` for long lists.
- Do not edit native `ios/` or `android/` folders directly; use Expo config plugins.
- Store credentials and sensitive tokens with `expo-secure-store`, never plain AsyncStorage.
- Verify third-party packages support React Native and Expo before installing them.
- Keep the app dark-only; don't reintroduce a light palette without an explicit product decision.
- Prefer extending `src/components/ui/button.tsx` variants/sizes over one-off button styling, to keep buttons consistent app-wide.

## Local Commands

```bash
npm install
npm start
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
```

## Documentation Rules

For every subsequent project change:

1. Update any affected sections of this document so they describe the current codebase.
2. Add a dated entry to the change log below.
3. Describe what changed, why it changed, and the important files involved.
4. Clearly distinguish completed functionality from planned functionality.
5. Never add secrets, private keys, access tokens, or personal user data here.

## Change Log

### 2026-08-17 — Home and Market Details screens, dark-only design system

- Removed all remaining Expo starter-template boilerplate (`ThemedText`/`ThemedView`, `AnimatedIcon`, `HintRow`, `WebBadge`, `ExternalLink`, the old `app-tabs.tsx`, `src/constants/theme.ts`, unused starter images) and the placeholder `explore.tsx` tab.
- Rebuilt the design-system layer as dark-only: new `src/global.css` HSL tokens (including app-specific `up`/`down`/`elevated`), `tailwind.config.js` color extensions, and `src/lib/theme.ts`. `app.json` now sets `userInterfaceStyle: "dark"`.
- Scaffolded shadcn/react-native-reusables UI primitives via `@react-native-reusables/cli` (`button`, `card`, `badge`, `avatar`, `tabs`, `separator`, `skeleton`, `text`) and extended `button.tsx` with `up`/`down`/`xl` variants for the app's actual button language.
- Rebuilt navigation using Expo Router v57's headless `expo-router/ui` tabs (`Tabs`/`TabList`/`TabTrigger`/`TabSlot`) with a custom floating pill nav bar, replacing the never-wired-up `NativeTabs`-based `app-tabs.tsx`. Added `(tabs)` route group with Home plus four placeholder screens (Search/Portfolio/Social/Profile), and `market/[id]` as a sibling stack route so it naturally covers the tab bar.
- Built the Home screen (balance, Weekly Top Traders, Watchlist/Markets/Live tabs, category pills, fee banner, market list) and Market Details screen (header, price/chart, timeframe pills, Holders/Feed/About tabs, sticky Buy Yes/No bar), each decomposed into section/row components under `src/components/home/` and `src/components/market/`, plus generic reusable pieces (`price-change`, `filter-pills`, `segmented-tabs`, `dual-bar`, `stat-row`, `section-header`, `user-avatar`, `price-chart`) directly under `src/components/`.
- Added `src/lib/dummy-data/` (markets, price series, account) as the current data source for both screens — not yet wired to `src/lib/polymarket_apis/`.
- Added avatars via the DiceBear HTTP image API (`src/lib/dicebear.ts`, no npm package) and price charts via `react-native-gifted-charts` + `expo-linear-gradient` (the latter is required at runtime for the area-chart fill even with a flat start/end color — omitting it throws `Gradient package was not found` at render time).
- Deferred: wiring real Polymarket data into these screens, and custom "Plus Jakarta Sans" typography (see "UI / Design System" for why).
- Design ported from the Lovable project "NoiseApp Project" (see "Design reference" above).

### 2026-08-15 — Initial project context

- Created the living AI context document.
- Recorded the Noise App product purpose, technical stack, repository structure, and engineering rules.
- Documented the existing read-only Polymarket Gamma events API client.
- Recorded that prediction-market trading and wallet flows are not yet implemented.

### 2026-08-15 — Polymarket market listing

- Added the keyset-paginated Polymarket markets client (now at `src/lib/polymarket_apis/markets.ts`).
- Added typed support for every documented query parameter and cursor response.
- Added request validation, response-shape checks, abort support, and consistent API errors.

### 2026-08-15 — Polymarket offset-based market listing

- Added `listMarketsByOffset` in the markets client for `GET /markets`, the offset-paginated market listing endpoint (distinct from `/markets/keyset`).
- Added the `ListMarketsByOffsetParams` type covering that endpoint's documented filters, including fields not shared with the keyset endpoint (`offset`, `rewards_min_size`, singular `tag_id`) and omitting keyset-only fields (`tag_match`, `rfq_enabled`, `locale`, `decimalized`, `after_cursor`).
- The endpoint returns a bare `PolymarketMarket[]` array rather than a `{ markets, next_cursor }` wrapper.

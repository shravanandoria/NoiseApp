# Noise App — AI Project Context

> This is the living context document for AI agents working on Noise App. Keep it accurate and update the change log whenever the project changes.

## Project Overview

- **Name:** Noise App
- **Description:** A cross-platform mobile prediction-market application where users can explore prediction outcomes and place bets. Market and event data is sourced from Polymarket APIs.
- **Current stage:** Early development. The UI is still largely based on the Expo starter template, while an initial Polymarket events API client has been implemented.
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
- **Navigation:** Expo Router with file-based routing
- **Language:** TypeScript 6 in strict mode
- **React:** React 19.2.3
- **Package manager:** npm (`package-lock.json`)
- **Images:** `expo-image`
- **Animations:** `react-native-reanimated`
- **Safe areas:** `react-native-safe-area-context`
- **Platforms:** Android, iOS, and web

## Project Structure

```text
assets/                  Static images and app icons
src/app/                 Expo Router screens and layouts
src/components/          Shared UI components
src/components/ui/       Reusable UI primitives
src/constants/           Theme and design constants
src/hooks/               Shared React hooks
src/lib/                 Data access and domain utilities
src/lib/events/events.ts Polymarket events API client and shared response types
src/lib/events/markets.ts Polymarket keyset-paginated markets API client
app.json                 Expo application configuration
package.json             Dependencies and npm scripts
AGENTS.md                Mandatory engineering instructions for AI agents
```

The `@/*` TypeScript alias resolves to `src/*`, and `@/assets/*` resolves to `assets/*`.

## Polymarket Integration

The current API client uses the public Polymarket Gamma API:

```text
https://gamma-api.polymarket.com
```

Implemented event operations in `src/lib/events/events.ts`:

- Cursor-based event listing via `GET /events/keyset`.
- Offset-based event listing via `GET /events`.
- Event lookup by numeric ID via `GET /events/{id}`.
- Event lookup by slug via `GET /events/slug/{slug}`.
- Event tag lookup via `GET /events/{id}/tags`.
- Typed event, market, tag, query, response, and API error models.
- Basic request parameter and response-shape validation.
- Abort signal support for cancelling requests.

Implemented market operations in `src/lib/events/markets.ts`:

- Cursor-based market listing via `GET /markets/keyset`.
- Offset-based market listing via `GET /markets`.
- All documented market filters, sorting options, and repeated-array query parameters for both endpoints.
- Typed request/response models, request validation, API errors, and abort support.

No authenticated trading, wallet connection, order placement, or transaction flow is documented as implemented yet.

## Current App Configuration

- App name and slug: `NoiseApp`
- App scheme: `noiseapp`
- Orientation: portrait
- User interface style: automatic
- Typed routes: enabled
- React Compiler: enabled
- Web output: static

## Engineering Rules

Before changing implementation code, read and follow `AGENTS.md`. In particular:

- Use the exact Expo SDK 57 documentation at <https://docs.expo.dev/versions/v57.0.0/>.
- Keep TypeScript strict and avoid `any`; prefer `unknown` with type guards.
- Use Expo Router and keep routes under `src/app/`.
- Use React Native primitives and `Pressable`, not HTML elements or legacy touchables.
- Use `SafeAreaView` for top-level screens.
- Use `expo-image` for images.
- Use `FlatList` or `FlashList` for long lists.
- Do not edit native `ios/` or `android/` folders directly; use Expo config plugins.
- Store credentials and sensitive tokens with `expo-secure-store`, never plain AsyncStorage.
- Verify third-party packages support React Native and Expo before installing them.

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

### 2026-08-15 — Initial project context

- Created the living AI context document.
- Recorded the Noise App product purpose, technical stack, repository structure, and engineering rules.
- Documented the existing read-only Polymarket Gamma events API client.
- Recorded that prediction-market trading and wallet flows are not yet implemented.

### 2026-08-15 — Polymarket market listing

- Added the keyset-paginated Polymarket markets client in `src/lib/events/markets.ts`.
- Added typed support for every documented query parameter and cursor response.
- Added request validation, response-shape checks, abort support, and consistent API errors.

### 2026-08-15 — Polymarket offset-based market listing

- Added `listMarketsByOffset` in `src/lib/events/markets.ts` for `GET /markets`, the offset-paginated market listing endpoint (distinct from `/markets/keyset`).
- Added the `ListMarketsByOffsetParams` type covering that endpoint's documented filters, including fields not shared with the keyset endpoint (`offset`, `rewards_min_size`, singular `tag_id`) and omitting keyset-only fields (`tag_match`, `rfq_enabled`, `locale`, `decimalized`, `after_cursor`).
- The endpoint returns a bare `PolymarketMarket[]` array rather than a `{ markets, next_cursor }` wrapper.

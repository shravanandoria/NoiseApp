import { PolymarketApiError } from './events';
import type { TradeSide } from './trades';

const POLYMARKET_GAMMA_API_URL = 'https://gamma-api.polymarket.com';
const POLYMARKET_DATA_API_URL = 'https://data-api.polymarket.com';

export { PolymarketApiError } from './events';

/**
 * Re-exported from `trades.ts`: `GET /trades` is the same endpoint Polymarket
 * docs list under the Profile category ("Get trades for a user or markets").
 * Kept here rather than duplicated so a profile screen's trade history can be
 * fetched from this module without a second implementation to keep in sync.
 */
export { listTrades } from './trades';
export type {
  ListTradesParams,
  PolymarketTrade,
  TradeFilterType,
  TradeSide,
  TradesRequestOptions,
} from './trades';

export type SortDirection = 'ASC' | 'DESC';

export interface ProfileRequestOptions {
  signal?: AbortSignal;
}

/** One user account associated with a public profile. */
export interface PublicProfileUser {
  id: string;
  creator: boolean;
  mod: boolean;
}

export interface PublicProfile {
  createdAt: string | null;
  proxyWallet: string | null;
  profileImage: string | null;
  displayUsernamePublic: boolean | null;
  bio: string | null;
  pseudonym: string | null;
  name: string | null;
  users: PublicProfileUser[] | null;
  xUsername: string | null;
  verifiedBadge: boolean | null;
}

export type UserPositionsOrderBy =
  | 'CURRENT'
  | 'INITIAL'
  | 'TOKENS'
  | 'CASHPNL'
  | 'PERCENTPNL'
  | 'TITLE'
  | 'RESOLVING'
  | 'PRICE'
  | 'AVGPRICE';

export interface UserPosition {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  size: number;
  avgPrice: number;
  initialValue: number;
  grossInitialValue?: number;
  entryFeesUsdc?: number;
  currentValue: number;
  cashPnl: number;
  percentPnl: number;
  totalBought: number;
  realizedPnl: number;
  percentRealizedPnl: number;
  curPrice: number;
  redeemable: boolean;
  mergeable: boolean;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  outcomeIndex: number;
  oppositeOutcome: string;
  oppositeAsset: string;
  endDate: string;
  negativeRisk: boolean;
}

export interface GetUserPositionsParams {
  user: string;
  market?: readonly string[];
  eventId?: readonly number[];
  sizeThreshold?: number;
  redeemable?: boolean;
  mergeable?: boolean;
  includeArchived?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: UserPositionsOrderBy;
  sortDirection?: SortDirection;
  title?: string;
}

export type UserClosedPositionsOrderBy = 'REALIZEDPNL' | 'TITLE' | 'PRICE' | 'AVGPRICE' | 'TIMESTAMP';

export interface UserClosedPosition {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  avgPrice: number;
  totalBought: number;
  realizedPnl: number;
  curPrice: number;
  timestamp: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  outcomeIndex: number;
  oppositeOutcome: string;
  oppositeAsset: string;
  endDate: string;
}

export interface GetUserClosedPositionsParams {
  user: string;
  market?: readonly string[];
  title?: string;
  eventId?: readonly number[];
  limit?: number;
  offset?: number;
  sortBy?: UserClosedPositionsOrderBy;
  sortDirection?: SortDirection;
}

export type MarketPositionStatus = 'OPEN' | 'CLOSED' | 'ALL';
export type MarketPositionsOrderBy = 'TOKENS' | 'CASH_PNL' | 'REALIZED_PNL' | 'TOTAL_PNL';

export interface MarketPositionEntry {
  proxyWallet: string;
  name: string;
  profileImage: string;
  verified: boolean;
  asset: string;
  conditionId: string;
  avgPrice: number;
  size: number;
  currPrice: number;
  currentValue: number;
  cashPnl: number;
  totalBought: number;
  realizedPnl: number;
  totalPnl: number;
  outcome: string;
  outcomeIndex: number;
}

export interface MarketPositionsByToken {
  token: string;
  positions: MarketPositionEntry[];
}

export interface GetMarketPositionsParams {
  market: string;
  user?: string;
  status?: MarketPositionStatus;
  sortBy?: MarketPositionsOrderBy;
  sortDirection?: SortDirection;
  limit?: number;
  offset?: number;
}

export interface UserPositionsValue {
  user: string;
  value: number;
}

export interface GetUserPositionsValueParams {
  user: string;
  market?: readonly string[];
}

export type ActivityType =
  | 'TRADE'
  | 'SPLIT'
  | 'MERGE'
  | 'REDEEM'
  | 'REWARD'
  | 'CONVERSION'
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'YIELD'
  | 'MAKER_REBATE'
  | 'TAKER_REBATE'
  | 'REFERRAL_REWARD';

export type UserActivityOrderBy = 'TIMESTAMP' | 'TOKENS' | 'CASH';

export interface UserActivity {
  proxyWallet: string;
  timestamp: number;
  conditionId: string;
  type: ActivityType;
  size: number;
  usdcSize: number;
  transactionHash: string;
  price: number;
  asset: string;
  side?: TradeSide;
  outcomeIndex: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string;
  profileImageOptimized?: string;
  isCombo?: boolean;
}

export interface GetUserActivityParams {
  user: string;
  market?: readonly string[];
  eventId?: readonly number[];
  type?: readonly ActivityType[];
  /**
   * Excludes DEPOSIT/WITHDRAWAL rows. Defaults to `true` on the API even
   * when `type` explicitly requests those records, so pass `false` to get
   * them back.
   */
  excludeDepositsWithdrawals?: boolean;
  start?: number;
  end?: number;
  sortBy?: UserActivityOrderBy;
  sortDirection?: SortDirection;
  side?: TradeSide;
  limit?: number;
  offset?: number;
}

export interface UserTradedMarketsCount {
  user: string;
  traded: number;
}

function validateAddress(address: string, paramName: string): string {
  const normalized = address.trim();

  if (!normalized) {
    throw new TypeError(`${paramName} must be a non-empty string`);
  }

  return normalized;
}

function validateMarketEventExclusivity(market: readonly string[] | undefined, eventId: readonly number[] | undefined) {
  if (market !== undefined && eventId !== undefined) {
    throw new TypeError('market and eventId are mutually exclusive');
  }

  if (market?.some((conditionId) => !conditionId.trim())) {
    throw new TypeError('market must contain only non-empty condition ids');
  }

  if (eventId?.some((id) => !Number.isInteger(id) || id < 1)) {
    throw new TypeError('eventId must contain only integers >= 1');
  }
}

function validateLimitOffset(
  limit: number | undefined,
  offset: number | undefined,
  maxLimit: number,
  maxOffset: number,
) {
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 0 || limit > maxLimit)) {
    throw new RangeError(`limit must be an integer between 0 and ${maxLimit}`);
  }

  if (offset !== undefined && (!Number.isInteger(offset) || offset < 0 || offset > maxOffset)) {
    throw new RangeError(`offset must be an integer between 0 and ${maxOffset}`);
  }
}

function validateTitle(title: string | undefined) {
  if (title !== undefined && title.length > 100) {
    throw new RangeError('title must be at most 100 characters');
  }
}

function validateGetUserPositionsParams(params: GetUserPositionsParams) {
  validateAddress(params.user, 'user');
  validateMarketEventExclusivity(params.market, params.eventId);
  validateLimitOffset(params.limit, params.offset, 500, 10000);
  validateTitle(params.title);

  if (params.sizeThreshold !== undefined && params.sizeThreshold < 0) {
    throw new RangeError('sizeThreshold must be a non-negative number');
  }
}

function validateGetUserClosedPositionsParams(params: GetUserClosedPositionsParams) {
  validateAddress(params.user, 'user');
  validateMarketEventExclusivity(params.market, params.eventId);
  validateLimitOffset(params.limit, params.offset, 50, 100000);
  validateTitle(params.title);
}

function validateGetMarketPositionsParams(params: GetMarketPositionsParams) {
  validateAddress(params.market, 'market');
  validateLimitOffset(params.limit, params.offset, 500, 10000);
}

function validateGetUserPositionsValueParams(params: GetUserPositionsValueParams) {
  validateAddress(params.user, 'user');
}

function validateGetUserActivityParams(params: GetUserActivityParams) {
  validateAddress(params.user, 'user');
  validateMarketEventExclusivity(params.market, params.eventId);
  validateLimitOffset(params.limit, params.offset, 500, 10000);

  if (params.start !== undefined && params.start < 0) {
    throw new RangeError('start must be a non-negative number');
  }

  if (params.end !== undefined && params.end < 0) {
    throw new RangeError('end must be a non-negative number');
  }
}

async function readResponseBody(response: Response): Promise<unknown> {
  const responseText = await response.text();

  if (!responseText) {
    return undefined;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

function assertPlainObject(responseBody: unknown, status: number): asserts responseBody is object {
  if (typeof responseBody !== 'object' || responseBody === null || Array.isArray(responseBody)) {
    throw new PolymarketApiError(status, responseBody);
  }
}

function assertArray(responseBody: unknown, status: number): asserts responseBody is unknown[] {
  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(status, responseBody);
  }
}

function buildSearchParams(searchParams: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return;
      }

      params.set(key, value.join(','));
      return;
    }

    params.set(key, String(value));
  });

  return params;
}

async function fetchJson(
  baseUrl: string,
  pathname: string,
  searchParams: Record<string, unknown>,
  options: ProfileRequestOptions,
): Promise<unknown> {
  const url = new URL(pathname, baseUrl);
  url.search = buildSearchParams(searchParams).toString();

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody;
}

/**
 * Fetches a user's public profile (display name, bio, avatar, X handle,
 * verified badge) by wallet address, for a profile header screen. Accepts
 * either the proxy wallet or the underlying EOA address. Does not require
 * authentication.
 */
export async function getPublicProfile(
  address: string,
  options: ProfileRequestOptions = {},
): Promise<PublicProfile> {
  const normalizedAddress = validateAddress(address, 'address');

  const responseBody = await fetchJson(
    POLYMARKET_GAMMA_API_URL,
    '/public-profile',
    { address: normalizedAddress },
    options,
  );

  assertPlainObject(responseBody, 200);

  return responseBody as PublicProfile;
}

/**
 * Lists a user's open positions (with live PnL, current value, and
 * redeemable/mergeable flags), for a profile's "Positions" tab. `market` and
 * `eventId` are mutually exclusive. Does not require authentication.
 */
export async function getUserPositions(
  params: GetUserPositionsParams,
  options: ProfileRequestOptions = {},
): Promise<UserPosition[]> {
  validateGetUserPositionsParams(params);

  const responseBody = await fetchJson(
    POLYMARKET_DATA_API_URL,
    '/positions',
    {
      user: params.user,
      market: params.market,
      eventId: params.eventId,
      sizeThreshold: params.sizeThreshold,
      redeemable: params.redeemable,
      mergeable: params.mergeable,
      includeArchived: params.includeArchived,
      limit: params.limit,
      offset: params.offset,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      title: params.title,
    },
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as UserPosition[];
}

/**
 * Lists a user's closed (fully exited or resolved) positions with realized
 * PnL, for a profile's trade-history / closed-positions view. `market` and
 * `eventId` are mutually exclusive. Does not require authentication.
 */
export async function getUserClosedPositions(
  params: GetUserClosedPositionsParams,
  options: ProfileRequestOptions = {},
): Promise<UserClosedPosition[]> {
  validateGetUserClosedPositionsParams(params);

  const responseBody = await fetchJson(
    POLYMARKET_DATA_API_URL,
    '/closed-positions',
    {
      user: params.user,
      market: params.market,
      title: params.title,
      eventId: params.eventId,
      limit: params.limit,
      offset: params.offset,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
    },
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as UserClosedPosition[];
}

/**
 * Lists positions in one market grouped by outcome token, with each
 * holder's profile info and PnL breakdown, for a market-detail screen's
 * "holders"/"positions" panel. Pass `user` to filter to a single trader
 * (e.g. viewing that market from their profile). Does not require
 * authentication.
 */
export async function getMarketPositions(
  params: GetMarketPositionsParams,
  options: ProfileRequestOptions = {},
): Promise<MarketPositionsByToken[]> {
  validateGetMarketPositionsParams(params);

  const responseBody = await fetchJson(
    POLYMARKET_DATA_API_URL,
    '/v1/market-positions',
    {
      market: params.market,
      user: params.user,
      status: params.status,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      limit: params.limit,
      offset: params.offset,
    },
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as MarketPositionsByToken[];
}

/**
 * Fetches the total current value of a user's positions (optionally scoped
 * to specific markets), for a profile's portfolio-value summary. Does not
 * require authentication.
 */
export async function getUserPositionsValue(
  params: GetUserPositionsValueParams,
  options: ProfileRequestOptions = {},
): Promise<UserPositionsValue[]> {
  validateGetUserPositionsValueParams(params);

  const responseBody = await fetchJson(
    POLYMARKET_DATA_API_URL,
    '/value',
    { user: params.user, market: params.market },
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as UserPositionsValue[];
}

/**
 * Lists a user's on-chain activity (trades, splits, merges, redemptions,
 * rewards, conversions, and optionally deposits/withdrawals), for a
 * profile's "Activity" feed. `market` and `eventId` are mutually exclusive.
 * Does not require authentication.
 */
export async function getUserActivity(
  params: GetUserActivityParams,
  options: ProfileRequestOptions = {},
): Promise<UserActivity[]> {
  validateGetUserActivityParams(params);

  const responseBody = await fetchJson(
    POLYMARKET_DATA_API_URL,
    '/activity',
    {
      user: params.user,
      market: params.market,
      eventId: params.eventId,
      type: params.type,
      excludeDepositsWithdrawals: params.excludeDepositsWithdrawals,
      start: params.start,
      end: params.end,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      side: params.side,
      limit: params.limit,
      offset: params.offset,
    },
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as UserActivity[];
}

/**
 * Fetches the total number of distinct markets a user has traded, for a
 * profile stat like "Markets traded". Does not require authentication.
 */
export async function getUserTradedMarketsCount(
  user: string,
  options: ProfileRequestOptions = {},
): Promise<UserTradedMarketsCount> {
  const normalizedUser = validateAddress(user, 'user');

  const responseBody = await fetchJson(
    POLYMARKET_DATA_API_URL,
    '/traded',
    { user: normalizedUser },
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('user' in responseBody) || !('traded' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as UserTradedMarketsCount;
}

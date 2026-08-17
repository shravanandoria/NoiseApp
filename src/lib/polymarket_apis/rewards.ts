import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';

import { PolymarketApiError } from './events';
import type { ClobApiCredentials } from './orders';

const POLYMARKET_CLOB_API_URL = 'https://clob.polymarket.com';

export { PolymarketApiError } from './events';
export type { ClobApiCredentials } from './orders';

export type RewardsSignatureType = 0 | 1 | 2;

export interface RewardsRequestOptions {
  signal?: AbortSignal;
}

export interface RewardsMarketToken {
  token_id: string;
  outcome: string;
  price?: number;
}

/** One reward allocation entry within a market's `rewards_config`. */
export interface RewardsConfigEntry {
  asset_address: string;
  start_date: string;
  rate_per_day: number;
  id?: number;
  end_date?: string;
  total_rewards?: number;
  remaining_reward_amount?: number;
  total_days?: number;
}

export interface CurrentRewardsMarket {
  condition_id: string;
  rewards_max_spread?: number;
  rewards_min_size?: number;
  rewards_config: RewardsConfigEntry[];
  sponsored_daily_rate?: number;
  sponsors_count?: number;
  native_daily_rate?: number;
  total_daily_rate?: number;
}

export interface GetCurrentRewardsMarketsParams {
  sponsored?: boolean;
  next_cursor?: string;
}

export interface GetCurrentRewardsMarketsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: CurrentRewardsMarket[];
}

export type RewardsMarketOrderBy =
  | 'market_id'
  | 'created_at'
  | 'volume_24hr'
  | 'spread'
  | 'competitiveness'
  | 'max_spread'
  | 'min_size'
  | 'question'
  | 'one_day_price_change'
  | 'rate_per_day'
  | 'price'
  | 'end_date'
  | 'start_date'
  | 'reward_end_date';

export type RewardsSortPosition = 'ASC' | 'DESC';

export interface RewardsMarket {
  condition_id: string;
  market_id: string;
  question: string;
  tokens: RewardsMarketToken[];
  event_id?: string;
  event_slug?: string;
  created_at?: string;
  group_item_title?: string;
  image?: string;
  market_competitiveness?: number;
  market_slug?: string;
  one_day_price_change?: number;
  rewards_max_spread?: number;
  rewards_min_size?: number;
  spread?: number;
  end_date?: string;
  volume_24hr?: number;
  rewards_config: RewardsConfigEntry[];
}

export interface ListRewardsMarketsParams {
  q?: string;
  tag_slug?: readonly string[];
  event_id?: readonly string[];
  event_title?: string;
  order_by?: RewardsMarketOrderBy;
  position?: RewardsSortPosition;
  min_volume_24hr?: number;
  max_volume_24hr?: number;
  min_spread?: number;
  max_spread?: number;
  min_price?: number;
  max_price?: number;
  next_cursor?: string;
  page_size?: number;
}

export interface ListRewardsMarketsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: RewardsMarket[];
}

export interface RawRewardsMarket {
  condition_id: string;
  question: string;
  tokens: RewardsMarketToken[];
  market_slug?: string;
  event_slug?: string;
  image?: string;
  rewards_max_spread?: number;
  rewards_min_size?: number;
  market_competitiveness?: number;
  rewards_config: RewardsConfigEntry[];
}

export interface GetMarketRewardsParams {
  sponsored?: boolean;
  next_cursor?: string;
}

export interface GetMarketRewardsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: RawRewardsMarket[];
}

export interface UserRewardsEarning {
  date: string;
  condition_id: string;
  asset_address: string;
  maker_address: string;
  earnings: number;
  asset_rate?: number;
}

export interface GetUserRewardsEarningsParams {
  date: string;
  signature_type?: RewardsSignatureType;
  maker_address?: string;
  sponsored?: boolean;
  next_cursor?: string;
}

export interface GetUserRewardsEarningsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: UserRewardsEarning[];
}

export type UserRewardsPercentages = Record<string, number>;

export interface GetUserRewardsPercentagesParams {
  signature_type?: RewardsSignatureType;
  maker_address?: string;
}

export interface TotalUserEarning {
  date: string;
  asset_address: string;
  maker_address: string;
  earnings: number;
  asset_rate: number;
}

export interface GetTotalUserRewardsEarningsParams {
  date: string;
  signature_type?: RewardsSignatureType;
  maker_address?: string;
  sponsored?: boolean;
}

export interface UserRewardsEarningAsset {
  asset_address: string;
  earnings: number;
  asset_rate?: number;
}

export interface UserRewardsMarket {
  condition_id: string;
  market_id: string;
  question: string;
  tokens: RewardsMarketToken[];
  event_id?: string;
  market_slug?: string;
  event_slug?: string;
  image?: string;
  rewards_max_spread?: number;
  rewards_min_size?: number;
  volume_24hr?: number;
  spread?: number;
  market_competitiveness?: number;
  rewards_config: RewardsConfigEntry[];
  maker_address?: string;
  earning_percentage?: number;
  earnings: UserRewardsEarningAsset[];
}

export type UserRewardsMarketOrderBy =
  | 'max_spread'
  | 'min_size'
  | 'end_date'
  | 'earning_percentage'
  | 'rate_per_day'
  | 'earnings'
  | 'spread'
  | 'competitiveness'
  | 'question'
  | 'price'
  | 'market'
  | 'volume_24hr';

export interface GetUserRewardsMarketsParams {
  date?: string;
  signature_type?: RewardsSignatureType;
  maker_address?: string;
  sponsored?: boolean;
  next_cursor?: string;
  page_size?: number;
  q?: string;
  tag_slug?: readonly string[];
  favorite_markets?: boolean;
  no_competition?: boolean;
  only_mergeable?: boolean;
  only_open_orders?: boolean;
  only_open_positions?: boolean;
  order_by?: UserRewardsMarketOrderBy;
  position?: RewardsSortPosition;
}

export interface GetUserRewardsMarketsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: UserRewardsMarket[];
  total_count?: number;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Decode(value: string): Uint8Array {
  const normalized = value.trim().replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const char of normalized) {
    const digit = BASE64_ALPHABET.indexOf(char);

    if (digit === -1) {
      throw new TypeError('credentials.secret must be a valid base64 string');
    }

    buffer = (buffer << 6) | digit;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }

  return new Uint8Array(bytes);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let result = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    const triplet = (b0 << 16) | ((b1 ?? 0) << 8) | (b2 ?? 0);

    result += BASE64_ALPHABET[(triplet >> 18) & 0x3f];
    result += BASE64_ALPHABET[(triplet >> 12) & 0x3f];
    result += b1 === undefined ? '=' : BASE64_ALPHABET[(triplet >> 6) & 0x3f];
    result += b2 === undefined ? '=' : BASE64_ALPHABET[triplet & 0x3f];
  }

  return result.replace(/\+/g, '-').replace(/\//g, '_');
}

function validateCredentials(credentials: ClobApiCredentials) {
  if (!credentials.address.trim()) {
    throw new TypeError('credentials.address must be a non-empty string');
  }

  if (!credentials.apiKey.trim()) {
    throw new TypeError('credentials.apiKey must be a non-empty string');
  }

  if (!credentials.secret.trim()) {
    throw new TypeError('credentials.secret must be a non-empty string');
  }

  if (!credentials.passphrase.trim()) {
    throw new TypeError('credentials.passphrase must be a non-empty string');
  }
}

function validateDate(date: string) {
  if (!DATE_PATTERN.test(date)) {
    throw new TypeError('date must be in YYYY-MM-DD format');
  }
}

function validateSignatureType(signatureType: RewardsSignatureType | undefined) {
  if (signatureType !== undefined && signatureType !== 0 && signatureType !== 1 && signatureType !== 2) {
    throw new TypeError('signature_type must be 0, 1, or 2');
  }
}

function validateConditionId(conditionId: string): string {
  const normalized = conditionId.trim();

  if (!normalized) {
    throw new TypeError('conditionId must be a non-empty string');
  }

  return normalized;
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

function assertPaginatedResponse(responseBody: unknown, status: number): asserts responseBody is object {
  assertPlainObject(responseBody, status);

  if (!('data' in responseBody) || !Array.isArray(responseBody.data)) {
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
      value.forEach((entry) => params.append(key, String(entry)));
      return;
    }

    params.set(key, String(value));
  });

  return params;
}

async function fetchPublicRewardsJson(
  pathname: string,
  searchParams: Record<string, unknown>,
  options: RewardsRequestOptions,
): Promise<unknown> {
  const url = new URL(pathname, POLYMARKET_CLOB_API_URL);
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
 * Computes the CLOB L2 request signature:
 * `base64url(HMAC-SHA256(base64Decode(secret), timestamp + method + path + body))`.
 * `path` must be the bare request path with no query string, matching what
 * the CLOB expects to re-derive when it verifies the signature.
 */
function createL2AuthHeaders(
  credentials: ClobApiCredentials,
  method: string,
  pathname: string,
): Record<string, string> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const message = `${timestamp}${method}${pathname}`;
  const secretBytes = base64Decode(credentials.secret);
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = hmac(sha256, secretBytes, messageBytes);

  return {
    POLY_ADDRESS: credentials.address,
    POLY_API_KEY: credentials.apiKey,
    POLY_PASSPHRASE: credentials.passphrase,
    POLY_SIGNATURE: base64UrlEncode(signatureBytes),
    POLY_TIMESTAMP: timestamp,
  };
}

async function fetchSignedRewardsJson(
  pathname: string,
  searchParams: Record<string, unknown>,
  credentials: ClobApiCredentials,
  options: RewardsRequestOptions,
): Promise<unknown> {
  validateCredentials(credentials);

  const url = new URL(pathname, POLYMARKET_CLOB_API_URL);
  url.search = buildSearchParams(searchParams).toString();

  const authHeaders = createL2AuthHeaders(credentials, 'GET', pathname);

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', ...authHeaders },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody;
}

/**
 * Fetches all currently active liquidity-reward configurations, grouped by
 * market, for a "browse rewards markets" feed. Does not require
 * authentication. Pass `sponsored: true` to fetch sponsored configurations
 * instead of standard ones. Pass the returned `next_cursor` back in to fetch
 * the next page; a `next_cursor` of `"LTE="` marks the end of results.
 */
export async function getCurrentRewardsMarkets(
  params: GetCurrentRewardsMarketsParams = {},
  options: RewardsRequestOptions = {},
): Promise<GetCurrentRewardsMarketsResponse> {
  const responseBody = await fetchPublicRewardsJson(
    '/rewards/markets/current',
    { sponsored: params.sponsored, next_cursor: params.next_cursor },
    options,
  );

  assertPaginatedResponse(responseBody, 200);

  return responseBody as GetCurrentRewardsMarketsResponse;
}

/**
 * Lists active reward-eligible markets with trading metrics, supporting text
 * search, tag/event filtering, numeric range filters, and sorting, for a
 * searchable "earn rewards" market browser. Does not require authentication.
 * Pass the returned `next_cursor` back in to fetch the next page; a
 * `next_cursor` of `"LTE="` marks the end of results.
 */
export async function listRewardsMarkets(
  params: ListRewardsMarketsParams = {},
  options: RewardsRequestOptions = {},
): Promise<ListRewardsMarketsResponse> {
  const responseBody = await fetchPublicRewardsJson(
    '/rewards/markets/multi',
    {
      q: params.q,
      tag_slug: params.tag_slug,
      event_id: params.event_id,
      event_title: params.event_title,
      order_by: params.order_by,
      position: params.position,
      min_volume_24hr: params.min_volume_24hr,
      max_volume_24hr: params.max_volume_24hr,
      min_spread: params.min_spread,
      max_spread: params.max_spread,
      min_price: params.min_price,
      max_price: params.max_price,
      next_cursor: params.next_cursor,
      page_size: params.page_size,
    },
    options,
  );

  assertPaginatedResponse(responseBody, 200);

  return responseBody as ListRewardsMarketsResponse;
}

/**
 * Fetches the present and future reward configurations for one market by
 * condition id, for a rewards-detail panel on a market screen. Does not
 * require authentication. Pass `sponsored: true` to fold sponsored daily
 * rates into each config's `rate_per_day`. Pass the returned `next_cursor`
 * back in to fetch the next page; a `next_cursor` of `"LTE="` marks the end
 * of results.
 */
export async function getMarketRewards(
  conditionId: string,
  params: GetMarketRewardsParams = {},
  options: RewardsRequestOptions = {},
): Promise<GetMarketRewardsResponse> {
  const normalizedConditionId = validateConditionId(conditionId);
  const pathname = `/rewards/markets/${encodeURIComponent(normalizedConditionId)}`;

  const responseBody = await fetchPublicRewardsJson(
    pathname,
    { sponsored: params.sponsored, next_cursor: params.next_cursor },
    options,
  );

  assertPaginatedResponse(responseBody, 200);

  return responseBody as GetMarketRewardsResponse;
}

/**
 * Lists the authenticated maker's reward earnings per market for one day, for
 * a rewards history/ledger screen. Requires CLOB L2 auth. Pass the returned
 * `next_cursor` back in to fetch the next page; a `next_cursor` of `"LTE="`
 * marks the end of results.
 */
export async function getUserRewardsEarnings(
  params: GetUserRewardsEarningsParams,
  credentials: ClobApiCredentials,
  options: RewardsRequestOptions = {},
): Promise<GetUserRewardsEarningsResponse> {
  validateDate(params.date);
  validateSignatureType(params.signature_type);

  const responseBody = await fetchSignedRewardsJson(
    '/rewards/user',
    {
      date: params.date,
      signature_type: params.signature_type,
      maker_address: params.maker_address,
      sponsored: params.sponsored,
      next_cursor: params.next_cursor,
    },
    credentials,
    options,
  );

  assertPaginatedResponse(responseBody, 200);

  return responseBody as GetUserRewardsEarningsResponse;
}

/**
 * Fetches the real-time percentage of total rewards the authenticated maker
 * is currently earning in each market, keyed by condition id, for a live
 * rewards-share indicator. Requires CLOB L2 auth.
 */
export async function getUserRewardsPercentages(
  params: GetUserRewardsPercentagesParams = {},
  credentials: ClobApiCredentials,
  options: RewardsRequestOptions = {},
): Promise<UserRewardsPercentages> {
  validateSignatureType(params.signature_type);

  const responseBody = await fetchSignedRewardsJson(
    '/rewards/user/percentages',
    { signature_type: params.signature_type, maker_address: params.maker_address },
    credentials,
    options,
  );

  assertPlainObject(responseBody, 200);

  return responseBody as UserRewardsPercentages;
}

/**
 * Fetches the authenticated maker's total reward earnings for one day,
 * summed across markets and grouped by asset address, for a rewards summary
 * total. Requires CLOB L2 auth. Pass `sponsored: true` to include sponsored
 * earnings in the total.
 */
export async function getTotalUserRewardsEarnings(
  params: GetTotalUserRewardsEarningsParams,
  credentials: ClobApiCredentials,
  options: RewardsRequestOptions = {},
): Promise<TotalUserEarning[]> {
  validateDate(params.date);
  validateSignatureType(params.signature_type);

  const responseBody = await fetchSignedRewardsJson(
    '/rewards/user/total',
    {
      date: params.date,
      signature_type: params.signature_type,
      maker_address: params.maker_address,
      sponsored: params.sponsored,
    },
    credentials,
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as TotalUserEarning[];
}

/**
 * Lists reward-eligible markets together with the authenticated maker's live
 * earnings and earning percentage in each, for a combined "my rewards"
 * dashboard. Requires CLOB L2 auth. Supports text search, tag filtering,
 * favorite/open-order/open-position/no-competition/mergeable-only filters,
 * and sorting. `date` defaults to the current date. Pass the returned
 * `next_cursor` back in to fetch the next page; a `next_cursor` of `"LTE="`
 * marks the end of results.
 */
export async function getUserRewardsMarkets(
  params: GetUserRewardsMarketsParams = {},
  credentials: ClobApiCredentials,
  options: RewardsRequestOptions = {},
): Promise<GetUserRewardsMarketsResponse> {
  if (params.date !== undefined) {
    validateDate(params.date);
  }

  validateSignatureType(params.signature_type);

  const responseBody = await fetchSignedRewardsJson(
    '/rewards/user/markets',
    {
      date: params.date,
      signature_type: params.signature_type,
      maker_address: params.maker_address,
      sponsored: params.sponsored,
      next_cursor: params.next_cursor,
      page_size: params.page_size,
      q: params.q,
      tag_slug: params.tag_slug,
      favorite_markets: params.favorite_markets,
      no_competition: params.no_competition,
      only_mergeable: params.only_mergeable,
      only_open_orders: params.only_open_orders,
      only_open_positions: params.only_open_positions,
      order_by: params.order_by,
      position: params.position,
    },
    credentials,
    options,
  );

  assertPaginatedResponse(responseBody, 200);

  return responseBody as GetUserRewardsMarketsResponse;
}

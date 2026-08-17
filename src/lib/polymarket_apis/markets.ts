import {
  PolymarketApiError,
  type PolymarketMarket,
  type PolymarketTag,
} from './events';

const POLYMARKET_GAMMA_API_URL = 'https://gamma-api.polymarket.com';
const POLYMARKET_CLOB_API_URL = 'https://clob.polymarket.com';
const POLYMARKET_DATA_API_URL = 'https://data-api.polymarket.com';

export type { PolymarketMarket, PolymarketTag } from './events';
export { PolymarketApiError } from './events';

export interface ListMarketsParams {
  limit?: number;
  order?: string;
  ascending?: boolean;
  after_cursor?: string;
  id?: readonly number[];
  slug?: readonly string[];
  closed?: boolean;
  decimalized?: boolean;
  clob_token_ids?: readonly string[];
  condition_ids?: readonly string[];
  question_ids?: readonly string[];
  market_maker_address?: readonly string[];
  liquidity_num_min?: number;
  liquidity_num_max?: number;
  volume_num_min?: number;
  volume_num_max?: number;
  start_date_min?: string;
  start_date_max?: string;
  end_date_min?: string;
  end_date_max?: string;
  tag_id?: readonly number[];
  related_tags?: boolean;
  tag_match?: string;
  cyom?: boolean;
  rfq_enabled?: boolean;
  uma_resolution_status?: string;
  game_id?: string;
  sports_market_types?: readonly string[];
  include_tag?: boolean;
  locale?: string;
}

export interface ListMarketsResponse {
  markets: PolymarketMarket[];
  next_cursor?: string;
}

export interface ListMarketsByOffsetParams {
  limit?: number;
  offset?: number;
  order?: string;
  ascending?: boolean;
  id?: readonly number[];
  slug?: readonly string[];
  clob_token_ids?: readonly string[];
  condition_ids?: readonly string[];
  market_maker_address?: readonly string[];
  liquidity_num_min?: number;
  liquidity_num_max?: number;
  volume_num_min?: number;
  volume_num_max?: number;
  start_date_min?: string;
  start_date_max?: string;
  end_date_min?: string;
  end_date_max?: string;
  tag_id?: number;
  related_tags?: boolean;
  cyom?: boolean;
  uma_resolution_status?: string;
  game_id?: string;
  sports_market_types?: readonly string[];
  rewards_min_size?: number;
  question_ids?: readonly string[];
  include_tag?: boolean;
  closed?: boolean;
}

export interface ListMarketsRequestOptions {
  signal?: AbortSignal;
}

export interface GetMarketByIdParams {
  include_tag?: boolean;
}

export type GetMarketBySlugParams = GetMarketByIdParams;

export interface MarketByToken {
  condition_id: string;
  primary_token_id: string;
  secondary_token_id: string;
}

export interface PolymarketHolder {
  proxyWallet: string;
  bio?: string;
  asset?: string;
  pseudonym?: string;
  amount: number;
  displayUsernamePublic?: boolean;
  outcomeIndex?: number;
  name?: string;
  profileImage?: string;
  profileImageOptimized?: string;
}

export interface MarketTopHolders {
  token: string;
  holders: PolymarketHolder[];
}

export interface GetTopHoldersForMarketsParams {
  market: readonly string[];
  limit?: number;
  minBalance?: number;
}

export interface OpenInterest {
  market: string;
  value: number;
}

export interface GetOpenInterestParams {
  market: readonly string[];
}

export interface EventLiveVolumeMarket {
  market: string;
  value: number;
}

export interface EventLiveVolume {
  total: number;
  markets: EventLiveVolumeMarket[];
}

export interface GetLiveVolumeForEventParams {
  id: number;
}

export interface ClobRewardRate {
  asset_address: string;
  rewards_daily_rate: number;
}

export interface ClobRewards {
  rates: ClobRewardRate[];
  min_size: number;
  max_spread: number;
}

export interface ClobToken {
  token_id: string;
  outcome: string;
  price: number;
  winner: boolean;
}

export interface ClobSamplingMarket {
  enable_order_book: boolean;
  active: boolean;
  closed: boolean;
  archived: boolean;
  accepting_orders: boolean;
  accepting_order_timestamp?: string;
  minimum_order_size: number;
  minimum_tick_size: number;
  condition_id: string;
  question_id: string;
  question: string;
  description: string;
  market_slug: string;
  end_date_iso?: string;
  game_start_time?: string;
  seconds_delay: number;
  fpmm: string;
  maker_base_fee: number;
  taker_base_fee: number;
  notifications_enabled: boolean;
  neg_risk: boolean;
  neg_risk_market_id?: string;
  neg_risk_request_id?: string;
  icon: string;
  image: string;
  rewards: ClobRewards;
  is_50_50_outcome: boolean;
  tokens: ClobToken[];
  tags: string[];
}

export interface GetSamplingMarketsParams {
  next_cursor?: string;
}

export interface GetSamplingMarketsResponse {
  limit: number;
  next_cursor: string;
  count: number;
  data: ClobSamplingMarket[];
}

export interface ClobSimplifiedRewardRate {
  asset_address: string;
  rewards_daily_rate: number;
}

export interface ClobSimplifiedRewards {
  rates: ClobSimplifiedRewardRate[];
  min_size: number;
  max_spread: number;
}

export interface ClobSimplifiedToken {
  token_id: string;
  outcome: string;
  price: number;
  winner: boolean;
}

export interface ClobSimplifiedMarket {
  condition_id: string;
  rewards: ClobSimplifiedRewards;
  tokens: ClobSimplifiedToken[];
  active: boolean;
  closed: boolean;
  archived: boolean;
  accepting_orders: boolean;
}

export interface GetSamplingSimplifiedMarketsParams {
  next_cursor?: string;
}

export interface GetSamplingSimplifiedMarketsResponse {
  limit: number;
  next_cursor: string;
  count: number;
  data: ClobSimplifiedMarket[];
}

function validateIntegerArray(name: string, values: readonly number[] | undefined) {
  const invalidValue = values?.find((value) => !Number.isInteger(value));

  if (invalidValue !== undefined) {
    throw new TypeError(`${name} must contain only integers`);
  }
}

function validateListMarketsParams(params: ListMarketsParams) {
  if (
    params.limit !== undefined &&
    (!Number.isInteger(params.limit) || params.limit < 1 || params.limit > 100)
  ) {
    throw new RangeError('limit must be an integer between 1 and 100');
  }

  // The keyset endpoint explicitly rejects offset-based pagination.
  if ('offset' in params) {
    throw new TypeError('offset is not supported; use after_cursor instead');
  }

  validateIntegerArray('id', params.id);
  validateIntegerArray('tag_id', params.tag_id);
}

function validateMarketId(id: number) {
  if (!Number.isInteger(id)) {
    throw new TypeError('id must be an integer');
  }
}

function validateListMarketsByOffsetParams(params: ListMarketsByOffsetParams) {
  if (
    params.limit !== undefined &&
    (!Number.isInteger(params.limit) || params.limit < 0)
  ) {
    throw new RangeError('limit must be a non-negative integer');
  }

  if (
    params.offset !== undefined &&
    (!Number.isInteger(params.offset) || params.offset < 0)
  ) {
    throw new RangeError('offset must be a non-negative integer');
  }

  if (params.tag_id !== undefined && !Number.isInteger(params.tag_id)) {
    throw new TypeError('tag_id must be an integer');
  }

  validateIntegerArray('id', params.id);
}

function validateGetTopHoldersForMarketsParams(params: GetTopHoldersForMarketsParams) {
  if (params.market.length === 0 || params.market.some((conditionId) => !conditionId.trim())) {
    throw new TypeError('market must contain at least one non-empty condition id');
  }

  if (
    params.limit !== undefined &&
    (!Number.isInteger(params.limit) || params.limit < 1 || params.limit > 20)
  ) {
    throw new RangeError('limit must be an integer between 1 and 20');
  }

  if (
    params.minBalance !== undefined &&
    (!Number.isInteger(params.minBalance) || params.minBalance < 0)
  ) {
    throw new RangeError('minBalance must be a non-negative integer');
  }
}

function validateGetOpenInterestParams(params: GetOpenInterestParams) {
  if (params.market.length === 0 || params.market.some((conditionId) => !conditionId.trim())) {
    throw new TypeError('market must contain at least one non-empty condition id');
  }
}

function validateGetLiveVolumeForEventParams(params: GetLiveVolumeForEventParams) {
  if (!Number.isInteger(params.id) || params.id < 1) {
    throw new TypeError('id must be an integer >= 1');
  }
}

function createMarketsUrl(pathname: string, params: object) {
  const url = new URL(pathname, POLYMARKET_GAMMA_API_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => url.searchParams.append(key, String(item)));
  });

  return url;
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

/**
 * Lists Polymarket markets with stable cursor-based pagination. Pass the
 * returned `next_cursor` as `after_cursor` to request the next page.
 */
export async function listMarkets(
  params: ListMarketsParams = {},
  options: ListMarketsRequestOptions = {},
): Promise<ListMarketsResponse> {
  validateListMarketsParams(params);

  const response = await fetch(createMarketsUrl('/markets/keyset', params), {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    !('markets' in responseBody) ||
    !Array.isArray(responseBody.markets)
  ) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as ListMarketsResponse;
}

/**
 * Lists Polymarket markets with page-number-style offset pagination. Prefer
 * `listMarkets` for frequently changing feeds that need stable cursor paging;
 * use this for page-number navigation or one-off, fixed-size slices.
 */
export async function listMarketsByOffset(
  params: ListMarketsByOffsetParams = {},
  options: ListMarketsRequestOptions = {},
): Promise<PolymarketMarket[]> {
  validateListMarketsByOffsetParams(params);

  const response = await fetch(createMarketsUrl('/markets', params), {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as PolymarketMarket[];
}

/**
 * Fetches one Polymarket market by its numeric id, for a market-detail screen
 * reached from a list or a direct link.
 */
export async function getMarketById(
  id: number,
  params: GetMarketByIdParams = {},
  options: ListMarketsRequestOptions = {},
): Promise<PolymarketMarket> {
  validateMarketId(id);

  const response = await fetch(createMarketsUrl(`/markets/${id}`, params), {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    Array.isArray(responseBody) ||
    !('id' in responseBody)
  ) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as PolymarketMarket;
}

/**
 * Resolves a market's condition id and both outcome token ids from a single
 * token id, for callers that only have a token id (e.g. from an order or
 * position) and need to look up its parent market without knowing the
 * condition id in advance.
 */
export async function getMarketByToken(
  tokenId: string,
  options: ListMarketsRequestOptions = {},
): Promise<MarketByToken> {
  const normalizedTokenId = tokenId.trim();

  if (!normalizedTokenId) {
    throw new TypeError('tokenId must be a non-empty string');
  }

  const response = await fetch(
    new URL(
      `/markets-by-token/${encodeURIComponent(normalizedTokenId)}`,
      POLYMARKET_CLOB_API_URL,
    ),
    {
      headers: { Accept: 'application/json' },
      signal: options.signal,
    },
  );
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    Array.isArray(responseBody) ||
    !('condition_id' in responseBody)
  ) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as MarketByToken;
}

/**
 * Fetches a market's categories for topic chips, related-market
 * recommendations, or tag-based navigation without loading the full market.
 */
export async function getMarketTags(
  id: number,
  options: ListMarketsRequestOptions = {},
): Promise<PolymarketTag[]> {
  validateMarketId(id);

  const response = await fetch(createMarketsUrl(`/markets/${id}/tags`, {}), {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as PolymarketTag[];
}

/**
 * Fetches one Polymarket market by its slug, for a market-detail screen
 * reached from a human-readable route or shared Polymarket link.
 */
export async function getMarketBySlug(
  slug: string,
  params: GetMarketBySlugParams = {},
  options: ListMarketsRequestOptions = {},
): Promise<PolymarketMarket> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new TypeError('slug must be a non-empty string');
  }

  const response = await fetch(
    createMarketsUrl(`/markets/slug/${encodeURIComponent(normalizedSlug)}`, params),
    {
      headers: { Accept: 'application/json' },
      signal: options.signal,
    },
  );
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    Array.isArray(responseBody) ||
    !('id' in responseBody)
  ) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as PolymarketMarket;
}

/**
 * Fetches the top token holders for one or more markets, for a "top holders"
 * panel on a market-detail screen. Accepts multiple condition ids so holders
 * for a market's related outcomes can be fetched in one request.
 */
export async function getTopHoldersForMarkets(
  params: GetTopHoldersForMarketsParams,
  options: ListMarketsRequestOptions = {},
): Promise<MarketTopHolders[]> {
  validateGetTopHoldersForMarketsParams(params);

  const url = new URL('/holders', POLYMARKET_DATA_API_URL);
  url.searchParams.set('market', params.market.join(','));

  if (params.limit !== undefined) {
    url.searchParams.set('limit', String(params.limit));
  }

  if (params.minBalance !== undefined) {
    url.searchParams.set('minBalance', String(params.minBalance));
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as MarketTopHolders[];
}

/**
 * Fetches the current open interest for one or more markets, for an
 * "open interest" stat on a market-detail screen. Accepts multiple
 * condition ids so related outcomes can be fetched in one request.
 */
export async function getOpenInterest(
  params: GetOpenInterestParams,
  options: ListMarketsRequestOptions = {},
): Promise<OpenInterest[]> {
  validateGetOpenInterestParams(params);

  const url = new URL('/oi', POLYMARKET_DATA_API_URL);
  url.searchParams.set('market', params.market.join(','));

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as OpenInterest[];
}

/**
 * Fetches live (real-time) volume for an event by numeric event id, broken
 * down by market, for a "live volume" stat on an event-detail screen.
 */
export async function getLiveVolumeForEvent(
  params: GetLiveVolumeForEventParams,
  options: ListMarketsRequestOptions = {},
): Promise<EventLiveVolume[]> {
  validateGetLiveVolumeForEventParams(params);

  const url = new URL('/live-volume', POLYMARKET_DATA_API_URL);
  url.searchParams.set('id', String(params.id));

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as EventLiveVolume[];
}

/**
 * Lists CLOB markets that currently have rewards sampling enabled, for a
 * "trade to earn rewards" feed. Pass the returned `next_cursor` back in to
 * fetch the next page; a `next_cursor` of `"LTE="` marks the end of results.
 */
export async function getSamplingMarkets(
  params: GetSamplingMarketsParams = {},
  options: ListMarketsRequestOptions = {},
): Promise<GetSamplingMarketsResponse> {
  const url = new URL('/sampling-markets', POLYMARKET_CLOB_API_URL);

  if (params.next_cursor !== undefined) {
    url.searchParams.set('next_cursor', params.next_cursor);
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    !('data' in responseBody) ||
    !Array.isArray(responseBody.data)
  ) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as GetSamplingMarketsResponse;
}

/**
 * Lists CLOB markets that currently have rewards sampling enabled, using a
 * lighter-weight market shape than `getSamplingMarkets`, for feeds that only
 * need condition/token ids and reward rates. Pass the returned `next_cursor`
 * back in to fetch the next page; a `next_cursor` of `"LTE="` marks the end
 * of results.
 */
export async function getSamplingSimplifiedMarkets(
  params: GetSamplingSimplifiedMarketsParams = {},
  options: ListMarketsRequestOptions = {},
): Promise<GetSamplingSimplifiedMarketsResponse> {
  const url = new URL('/sampling-simplified-markets', POLYMARKET_CLOB_API_URL);

  if (params.next_cursor !== undefined) {
    url.searchParams.set('next_cursor', params.next_cursor);
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    !('data' in responseBody) ||
    !Array.isArray(responseBody.data)
  ) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody as GetSamplingSimplifiedMarketsResponse;
}

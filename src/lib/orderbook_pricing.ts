import { PolymarketApiError } from './events';

const POLYMARKET_CLOB_API_URL = 'https://clob.polymarket.com';

export { PolymarketApiError } from './events';

export type OrderSide = 'BUY' | 'SELL';

export interface OrderbookPricingRequestOptions {
  signal?: AbortSignal;
}

export interface OrderBookLevel {
  price: string;
  size: string;
}

export interface OrderBookSummary {
  market: string;
  asset_id: string;
  timestamp: string;
  hash: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  min_order_size: string;
  tick_size: string;
  neg_risk: boolean;
  last_trade_price: string;
}

export interface PriceRequestItem {
  token_id: string;
  side: OrderSide;
}

export type MarketPricesByToken = Record<string, Partial<Record<OrderSide, number>>>;

export type MidpointPricesByToken = Record<string, string>;

export type SpreadsByToken = Record<string, string>;

export interface LastTradePrice {
  price: string;
  side: OrderSide;
}

export interface TokenLastTradePrice extends LastTradePrice {
  token_id: string;
}

export interface TickSize {
  minimum_tick_size: number;
}

export interface FeeRate {
  base_fee: number;
}

export type PriceHistoryInterval = 'max' | 'all' | '1m' | '1w' | '1d' | '6h' | '1h';

export interface PriceHistoryPoint {
  t: number;
  p: number;
}

export interface GetPricesHistoryParams {
  market: string;
  startTs?: number;
  endTs?: number;
  interval?: PriceHistoryInterval;
  fidelity?: number;
}

export interface GetPricesHistoryResponse {
  history: PriceHistoryPoint[];
}

export interface GetBatchPricesHistoryParams {
  markets: readonly string[];
  start_ts?: number;
  end_ts?: number;
  interval?: PriceHistoryInterval;
  fidelity?: number;
}

export interface GetBatchPricesHistoryResponse {
  history: Record<string, PriceHistoryPoint[]>;
}

const PRICE_HISTORY_INTERVALS: readonly PriceHistoryInterval[] = [
  'max',
  'all',
  '1m',
  '1w',
  '1d',
  '6h',
  '1h',
];

const MAX_LAST_TRADE_PRICE_TOKENS = 500;
const MAX_BATCH_PRICES_HISTORY_MARKETS = 20;

function normalizeTokenId(tokenId: string): string {
  const normalized = tokenId.trim();

  if (!normalized) {
    throw new TypeError('tokenId must be a non-empty string');
  }

  return normalized;
}

function validateSide(side: OrderSide) {
  if (side !== 'BUY' && side !== 'SELL') {
    throw new TypeError('side must be "BUY" or "SELL"');
  }
}

function validateTokenIds(tokenIds: readonly string[], maxCount?: number) {
  if (tokenIds.length === 0 || tokenIds.some((tokenId) => !tokenId.trim())) {
    throw new TypeError('tokenIds must contain at least one non-empty token id');
  }

  if (maxCount !== undefined && tokenIds.length > maxCount) {
    throw new RangeError(`tokenIds must contain at most ${maxCount} token ids`);
  }
}

function validatePriceRequestItems(items: readonly PriceRequestItem[]) {
  if (items.length === 0) {
    throw new TypeError('items must contain at least one entry');
  }

  items.forEach((item) => {
    if (!item.token_id.trim()) {
      throw new TypeError('items[].token_id must be a non-empty string');
    }

    validateSide(item.side);
  });
}

function validateFidelity(fidelity: number | undefined) {
  if (fidelity !== undefined && (!Number.isInteger(fidelity) || fidelity < 1)) {
    throw new RangeError('fidelity must be a positive integer');
  }
}

function validateInterval(interval: PriceHistoryInterval | undefined) {
  if (interval !== undefined && !PRICE_HISTORY_INTERVALS.includes(interval)) {
    throw new TypeError(`interval must be one of: ${PRICE_HISTORY_INTERVALS.join(', ')}`);
  }
}

function validateGetPricesHistoryParams(params: GetPricesHistoryParams) {
  if (!params.market.trim()) {
    throw new TypeError('market must be a non-empty string');
  }

  validateInterval(params.interval);
  validateFidelity(params.fidelity);
}

function validateGetBatchPricesHistoryParams(params: GetBatchPricesHistoryParams) {
  if (
    params.markets.length === 0 ||
    params.markets.some((market) => !market.trim())
  ) {
    throw new TypeError('markets must contain at least one non-empty market id');
  }

  if (params.markets.length > MAX_BATCH_PRICES_HISTORY_MARKETS) {
    throw new RangeError(
      `markets must contain at most ${MAX_BATCH_PRICES_HISTORY_MARKETS} entries`,
    );
  }

  validateInterval(params.interval);
  validateFidelity(params.fidelity);
}

function createClobUrl(pathname: string, params: Record<string, unknown> = {}) {
  const url = new URL(pathname, POLYMARKET_CLOB_API_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    url.searchParams.set(key, String(value));
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

async function fetchClobJson(
  url: URL,
  options: OrderbookPricingRequestOptions,
  init: RequestInit = {},
): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init.headers },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody;
}

async function postClobJson(
  pathname: string,
  body: unknown,
  options: OrderbookPricingRequestOptions,
): Promise<unknown> {
  return fetchClobJson(new URL(pathname, POLYMARKET_CLOB_API_URL), options, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
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

/**
 * Fetches the live order book (bids and asks) for one outcome token, for a
 * market-detail screen's order book panel.
 */
export async function getOrderBook(
  tokenId: string,
  options: OrderbookPricingRequestOptions = {},
): Promise<OrderBookSummary> {
  const normalizedTokenId = normalizeTokenId(tokenId);

  const responseBody = await fetchClobJson(
    createClobUrl('/book', { token_id: normalizedTokenId }),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('market' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as OrderBookSummary;
}

/**
 * Fetches order books for multiple outcome tokens in one request, for
 * rendering several markets' books at once (e.g. an event page listing all
 * outcomes) without one round trip per token.
 */
export async function getOrderBooks(
  tokenIds: readonly string[],
  options: OrderbookPricingRequestOptions = {},
): Promise<OrderBookSummary[]> {
  validateTokenIds(tokenIds);

  const responseBody = await postClobJson(
    '/books',
    tokenIds.map((tokenId) => ({ token_id: tokenId })),
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as OrderBookSummary[];
}

/**
 * Fetches the best bid (BUY) or best ask (SELL) price for one outcome token,
 * for a lightweight price display that doesn't need the full order book.
 */
export async function getMarketPrice(
  tokenId: string,
  side: OrderSide,
  options: OrderbookPricingRequestOptions = {},
): Promise<number> {
  const normalizedTokenId = normalizeTokenId(tokenId);
  validateSide(side);

  const responseBody = await fetchClobJson(
    createClobUrl('/price', { token_id: normalizedTokenId, side }),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('price' in responseBody) || typeof responseBody.price !== 'number') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody.price;
}

/**
 * Fetches best bid/ask prices for multiple (token, side) pairs in one
 * request, for a watchlist or order-entry screen pricing several outcomes at
 * once. Returns a map keyed by token id, then by side.
 */
export async function getMarketPrices(
  items: readonly PriceRequestItem[],
  options: OrderbookPricingRequestOptions = {},
): Promise<MarketPricesByToken> {
  validatePriceRequestItems(items);

  const responseBody = await postClobJson('/prices', items, options);

  assertPlainObject(responseBody, 200);

  return responseBody as MarketPricesByToken;
}

/**
 * Fetches the midpoint price (average of best bid and best ask) for one
 * outcome token, for a "current price" display that's less noisy than the
 * best bid or ask alone.
 */
export async function getMidpointPrice(
  tokenId: string,
  options: OrderbookPricingRequestOptions = {},
): Promise<string> {
  const normalizedTokenId = normalizeTokenId(tokenId);

  const responseBody = await fetchClobJson(
    createClobUrl('/midpoint', { token_id: normalizedTokenId }),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('mid_price' in responseBody) || typeof responseBody.mid_price !== 'string') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody.mid_price;
}

/**
 * Fetches midpoint prices for multiple outcome tokens in one request, for a
 * markets list or watchlist that shows a current price per row. Returns a map
 * keyed by token id.
 */
export async function getMidpointPrices(
  tokenIds: readonly string[],
  options: OrderbookPricingRequestOptions = {},
): Promise<MidpointPricesByToken> {
  validateTokenIds(tokenIds);

  const responseBody = await postClobJson(
    '/midpoints',
    tokenIds.map((tokenId) => ({ token_id: tokenId })),
    options,
  );

  assertPlainObject(responseBody, 200);

  return responseBody as MidpointPricesByToken;
}

/**
 * Fetches the bid-ask spread for one outcome token, for a liquidity/quality
 * indicator on a market-detail screen.
 */
export async function getSpread(
  tokenId: string,
  options: OrderbookPricingRequestOptions = {},
): Promise<string> {
  const normalizedTokenId = normalizeTokenId(tokenId);

  const responseBody = await fetchClobJson(
    createClobUrl('/spread', { token_id: normalizedTokenId }),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('spread' in responseBody) || typeof responseBody.spread !== 'string') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody.spread;
}

/**
 * Fetches bid-ask spreads for multiple outcome tokens in one request, for a
 * markets list that surfaces liquidity per row. Returns a map keyed by token
 * id.
 */
export async function getSpreads(
  tokenIds: readonly string[],
  options: OrderbookPricingRequestOptions = {},
): Promise<SpreadsByToken> {
  validateTokenIds(tokenIds);

  const responseBody = await postClobJson(
    '/spreads',
    tokenIds.map((tokenId) => ({ token_id: tokenId })),
    options,
  );

  assertPlainObject(responseBody, 200);

  return responseBody as SpreadsByToken;
}

/**
 * Fetches the most recent trade's price and side for one outcome token, for
 * a "last price" display. The API returns `price: "0.5"` and `side: ""` when
 * the token has no trade history yet.
 */
export async function getLastTradePrice(
  tokenId: string,
  options: OrderbookPricingRequestOptions = {},
): Promise<LastTradePrice> {
  const normalizedTokenId = normalizeTokenId(tokenId);

  const responseBody = await fetchClobJson(
    createClobUrl('/last-trade-price', { token_id: normalizedTokenId }),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('price' in responseBody) || !('side' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as LastTradePrice;
}

/**
 * Fetches the most recent trade's price and side for up to 500 outcome
 * tokens in one request, for a markets list showing last-traded price per
 * row.
 */
export async function getLastTradePrices(
  tokenIds: readonly string[],
  options: OrderbookPricingRequestOptions = {},
): Promise<TokenLastTradePrice[]> {
  validateTokenIds(tokenIds, MAX_LAST_TRADE_PRICE_TOKENS);

  const responseBody = await postClobJson(
    '/last-trades-prices',
    tokenIds.map((tokenId) => ({ token_id: tokenId })),
    options,
  );

  assertArray(responseBody, 200);

  return responseBody as TokenLastTradePrice[];
}

/**
 * Fetches the minimum price increment (tick size) for one outcome token, for
 * validating or rounding a limit order price before submission.
 */
export async function getTickSize(
  tokenId: string,
  options: OrderbookPricingRequestOptions = {},
): Promise<number> {
  const normalizedTokenId = normalizeTokenId(tokenId);

  const responseBody = await fetchClobJson(
    new URL(`/tick-size/${encodeURIComponent(normalizedTokenId)}`, POLYMARKET_CLOB_API_URL),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (
    !('minimum_tick_size' in responseBody) ||
    typeof responseBody.minimum_tick_size !== 'number'
  ) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody.minimum_tick_size;
}

/**
 * Fetches the base trading fee rate (in basis points) for one outcome token,
 * for showing estimated fees before a trade is submitted.
 */
export async function getFeeRate(
  tokenId: string,
  options: OrderbookPricingRequestOptions = {},
): Promise<number> {
  const normalizedTokenId = normalizeTokenId(tokenId);

  const responseBody = await fetchClobJson(
    new URL(`/fee-rate/${encodeURIComponent(normalizedTokenId)}`, POLYMARKET_CLOB_API_URL),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('base_fee' in responseBody) || typeof responseBody.base_fee !== 'number') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody.base_fee;
}

/**
 * Fetches historical price points for one outcome token, for rendering a
 * price chart on a market-detail screen. Use `interval` for a preset window
 * or `startTs`/`endTs` for a custom range; `fidelity` controls point density
 * in minutes.
 */
export async function getPricesHistory(
  params: GetPricesHistoryParams,
  options: OrderbookPricingRequestOptions = {},
): Promise<GetPricesHistoryResponse> {
  validateGetPricesHistoryParams(params);

  const responseBody = await fetchClobJson(
    createClobUrl('/prices-history', {
      market: params.market,
      startTs: params.startTs,
      endTs: params.endTs,
      interval: params.interval,
      fidelity: params.fidelity,
    }),
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('history' in responseBody) || !Array.isArray(responseBody.history)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as GetPricesHistoryResponse;
}

/**
 * Fetches historical price points for up to 20 outcome tokens in one
 * request, for rendering multiple price charts (e.g. comparing outcomes on
 * one event) without one round trip per token.
 */
export async function getBatchPricesHistory(
  params: GetBatchPricesHistoryParams,
  options: OrderbookPricingRequestOptions = {},
): Promise<GetBatchPricesHistoryResponse> {
  validateGetBatchPricesHistoryParams(params);

  const responseBody = await postClobJson(
    '/batch-prices-history',
    {
      markets: params.markets,
      start_ts: params.start_ts,
      end_ts: params.end_ts,
      interval: params.interval,
      fidelity: params.fidelity,
    },
    options,
  );

  assertPlainObject(responseBody, 200);

  if (!('history' in responseBody) || typeof responseBody.history !== 'object') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as GetBatchPricesHistoryResponse;
}

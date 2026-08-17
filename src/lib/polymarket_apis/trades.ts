import { PolymarketApiError } from './events';

const POLYMARKET_DATA_API_URL = 'https://data-api.polymarket.com';

export { PolymarketApiError } from './events';

export type TradeSide = 'BUY' | 'SELL';

export type TradeFilterType = 'CASH' | 'TOKENS';

export interface PolymarketTrade {
  proxyWallet: string;
  side: TradeSide;
  asset: string;
  conditionId: string;
  size: number;
  price: number;
  timestamp: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  outcomeIndex: number;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string;
  profileImageOptimized?: string;
  transactionHash: string;
}

export interface ListTradesParams {
  limit?: number;
  offset?: number;
  takerOnly?: boolean;
  filterType?: TradeFilterType;
  filterAmount?: number;
  market?: readonly string[];
  eventId?: readonly number[];
  user?: string;
  side?: TradeSide;
  start?: number;
  end?: number;
}

export interface TradesRequestOptions {
  signal?: AbortSignal;
}

const MAX_TRADES_LIMIT = 10000;
const MAX_TRADES_OFFSET = 10000;

function validateListTradesParams(params: ListTradesParams) {
  if (
    params.limit !== undefined &&
    (!Number.isInteger(params.limit) || params.limit < 0 || params.limit > MAX_TRADES_LIMIT)
  ) {
    throw new RangeError(`limit must be an integer between 0 and ${MAX_TRADES_LIMIT}`);
  }

  if (
    params.offset !== undefined &&
    (!Number.isInteger(params.offset) || params.offset < 0 || params.offset > MAX_TRADES_OFFSET)
  ) {
    throw new RangeError(`offset must be an integer between 0 and ${MAX_TRADES_OFFSET}`);
  }

  if (params.market !== undefined && params.eventId !== undefined) {
    throw new TypeError('market and eventId are mutually exclusive');
  }

  if (params.market?.some((conditionId) => !conditionId.trim())) {
    throw new TypeError('market must contain only non-empty condition ids');
  }

  if (params.eventId?.some((id) => !Number.isInteger(id) || id < 1)) {
    throw new TypeError('eventId must contain only integers >= 1');
  }

  if (
    (params.filterType === undefined) !== (params.filterAmount === undefined)
  ) {
    throw new TypeError('filterType and filterAmount must be provided together');
  }

  if (params.filterAmount !== undefined && params.filterAmount < 0) {
    throw new RangeError('filterAmount must be a non-negative number');
  }

  if (params.side !== undefined && params.side !== 'BUY' && params.side !== 'SELL') {
    throw new TypeError('side must be "BUY" or "SELL"');
  }
}

function createTradesUrl(params: ListTradesParams) {
  const url = new URL('/trades', POLYMARKET_DATA_API_URL);

  if (params.limit !== undefined) {
    url.searchParams.set('limit', String(params.limit));
  }

  if (params.offset !== undefined) {
    url.searchParams.set('offset', String(params.offset));
  }

  if (params.takerOnly !== undefined) {
    url.searchParams.set('takerOnly', String(params.takerOnly));
  }

  if (params.filterType !== undefined) {
    url.searchParams.set('filterType', params.filterType);
  }

  if (params.filterAmount !== undefined) {
    url.searchParams.set('filterAmount', String(params.filterAmount));
  }

  if (params.market !== undefined) {
    url.searchParams.set('market', params.market.join(','));
  }

  if (params.eventId !== undefined) {
    url.searchParams.set('eventId', params.eventId.join(','));
  }

  if (params.user !== undefined) {
    url.searchParams.set('user', params.user);
  }

  if (params.side !== undefined) {
    url.searchParams.set('side', params.side);
  }

  if (params.start !== undefined) {
    url.searchParams.set('start', String(params.start));
  }

  if (params.end !== undefined) {
    url.searchParams.set('end', String(params.end));
  }

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
 * Lists executed trades across all users, filterable by market/event, user
 * address, side, or time window, for a market's "recent trades" feed or a
 * user's public trade history. Unlike `getTrades` in `orders.ts` (which
 * requires L2 auth and returns only the authenticated account's own fills),
 * this is a public endpoint that can look up any user or market.
 *
 * `market` and `eventId` are mutually exclusive. `start`/`end` bound the
 * trade window (epoch seconds); market/event-scoped requests are floored to
 * roughly the last 3 years, while user-scoped requests can go back further
 * by passing a small positive `start`. Paginate with `limit`/`offset`; to
 * read past offset 10000, narrow the `start`/`end` window instead.
 */
export async function listTrades(
  params: ListTradesParams = {},
  options: TradesRequestOptions = {},
): Promise<PolymarketTrade[]> {
  validateListTradesParams(params);

  const response = await fetch(createTradesUrl(params), {
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

  return responseBody as PolymarketTrade[];
}

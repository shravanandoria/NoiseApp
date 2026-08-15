import { PolymarketApiError } from './events';

const POLYMARKET_CLOB_API_URL = 'https://clob.polymarket.com';

export { PolymarketApiError } from './events';

export interface PolymarketRebate {
  date: string;
  condition_id: string;
  asset_address: string;
  maker_address: string;
  rebated_fees_usdc: string;
}

export interface GetCurrentRebatesParams {
  date: string;
  maker_address: string;
}

export interface RebatesRequestOptions {
  signal?: AbortSignal;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateGetCurrentRebatesParams(params: GetCurrentRebatesParams) {
  if (!DATE_PATTERN.test(params.date)) {
    throw new TypeError('date must be in YYYY-MM-DD format');
  }

  if (!params.maker_address.trim()) {
    throw new TypeError('maker_address must be a non-empty string');
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

/**
 * Fetches the current rebated maker fees for one address on a given date, for
 * a rewards/rebates summary screen. Each entry covers one market (condition
 * id) the maker had rebated fees on that day. Does not require
 * authentication.
 */
export async function getCurrentRebates(
  params: GetCurrentRebatesParams,
  options: RebatesRequestOptions = {},
): Promise<PolymarketRebate[]> {
  validateGetCurrentRebatesParams(params);

  const url = new URL('/rebates/current', POLYMARKET_CLOB_API_URL);
  url.searchParams.set('date', params.date);
  url.searchParams.set('maker_address', params.maker_address);

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

  return responseBody as PolymarketRebate[];
}

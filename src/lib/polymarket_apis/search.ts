import { PolymarketApiError } from './events';
import type { PolymarketEvent } from './events';

const POLYMARKET_GAMMA_API_URL = 'https://gamma-api.polymarket.com';

export { PolymarketApiError } from './events';

export interface SearchParams {
  q: string;
  cache?: boolean;
  events_status?: string;
  limit_per_type?: number;
  page?: number;
  events_tag?: readonly string[];
  keep_closed_markets?: number;
  sort?: string;
  ascending?: boolean;
  search_tags?: boolean;
  search_profiles?: boolean;
  recurrence?: string;
  exclude_tag_id?: readonly number[];
  optimized?: boolean;
}

export interface SearchTag {
  id: string;
  label: string;
  slug: string;
  event_count: number;
}

export interface SearchProfile {
  id: string;
  name: string | null;
  user: number | null;
  referral: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  walletActivated: boolean | null;
  pseudonym: string | null;
  displayUsernamePublic: boolean | null;
  profileImage: string | null;
  bio: string | null;
  proxyWallet: string | null;
  isCloseOnly: boolean | null;
  isCertReq: boolean | null;
  certReqDate: string | null;
}

export interface SearchPagination {
  hasMore: boolean;
  totalResults: number;
}

export interface SearchResponse {
  events: PolymarketEvent[];
  tags: SearchTag[];
  profiles: SearchProfile[];
  pagination: SearchPagination;
}

export interface SearchRequestOptions {
  signal?: AbortSignal;
}

function validateSearchParams(params: SearchParams) {
  if (!params.q.trim()) {
    throw new TypeError('q must be a non-empty string');
  }

  if (
    params.limit_per_type !== undefined &&
    (!Number.isInteger(params.limit_per_type) || params.limit_per_type < 1)
  ) {
    throw new RangeError('limit_per_type must be a positive integer');
  }

  if (params.page !== undefined && (!Number.isInteger(params.page) || params.page < 1)) {
    throw new RangeError('page must be a positive integer');
  }
}

function createSearchUrl(params: SearchParams): URL {
  const url = new URL('/public-search', POLYMARKET_GAMMA_API_URL);

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

function assertSearchResponse(responseBody: unknown, status: number): asserts responseBody is SearchResponse {
  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    Array.isArray(responseBody)
  ) {
    throw new PolymarketApiError(status, responseBody);
  }
}

/**
 * Use case: power a global search bar — a single query returns matching
 * events (with their nested markets), tags, and user profiles in one call,
 * for a unified search-results screen. Set `search_tags` / `search_profiles`
 * to `false` to skip those result types when the UI only needs markets.
 */
export async function search(
  params: SearchParams,
  options: SearchRequestOptions = {},
): Promise<SearchResponse> {
  validateSearchParams(params);

  const response = await fetch(createSearchUrl(params), {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  assertSearchResponse(responseBody, 200);

  return {
    events: responseBody.events ?? [],
    tags: responseBody.tags ?? [],
    profiles: responseBody.profiles ?? [],
    pagination: responseBody.pagination ?? { hasMore: false, totalResults: 0 },
  };
}

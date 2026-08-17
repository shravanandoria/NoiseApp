const POLYMARKET_GAMMA_API_URL = 'https://gamma-api.polymarket.com';

export interface ListEventsParams {
  limit?: number;
  order?: string;
  ascending?: boolean;
  after_cursor?: string;
  id?: readonly number[];
  slug?: readonly string[];
  closed?: boolean;
  live?: boolean;
  featured?: boolean;
  cyom?: boolean;
  title_search?: string;
  liquidity_min?: number;
  liquidity_max?: number;
  volume_min?: number;
  volume_max?: number;
  start_date_min?: string;
  start_date_max?: string;
  end_date_min?: string;
  end_date_max?: string;
  start_time_min?: string;
  start_time_max?: string;
  tag_id?: readonly number[];
  tag_slug?: string;
  exclude_tag_id?: readonly number[];
  related_tags?: boolean;
  tag_match?: string;
  series_id?: readonly number[];
  game_id?: readonly number[];
  event_date?: string;
  event_week?: number;
  featured_order?: boolean;
  recurrence?: string;
  created_by?: readonly string[];
  parent_event_id?: number;
  include_children?: boolean;
  partner_slug?: string;
  include_chat?: boolean;
  include_template?: boolean;
  include_best_lines?: boolean;
  locale?: string;
}

export interface ListEventsByOffsetParams {
  limit?: number;
  offset?: number;
  order?: string;
  ascending?: boolean;
  id?: readonly number[];
  tag_id?: number;
  exclude_tag_id?: readonly number[];
  slug?: readonly string[];
  tag_slug?: string;
  related_tags?: boolean;
  active?: boolean;
  archived?: boolean;
  featured?: boolean;
  cyom?: boolean;
  include_chat?: boolean;
  include_template?: boolean;
  recurrence?: string;
  closed?: boolean;
  liquidity_min?: number;
  liquidity_max?: number;
  volume_min?: number;
  volume_max?: number;
  start_date_min?: string;
  start_date_max?: string;
  end_date_min?: string;
  end_date_max?: string;
}

export interface GetEventByIdParams {
  include_chat?: boolean;
  include_template?: boolean;
}

export type GetEventBySlugParams = GetEventByIdParams;

export interface PolymarketMarket {
  id: string;
  question?: string;
  conditionId?: string;
  slug?: string;
  description?: string;
  outcomes?: string;
  outcomePrices?: string;
  volume?: string;
  liquidity?: string;
  image?: string;
  icon?: string;
  active?: boolean;
  closed?: boolean;
  acceptingOrders?: boolean;
  startDate?: string;
  endDate?: string;
  bestBid?: number;
  bestAsk?: number;
  lastTradePrice?: number;
  [key: string]: unknown;
}

export interface PolymarketTag {
  id: string;
  label: string | null;
  slug: string | null;
  forceShow: boolean | null;
  publishedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  forceHide: boolean | null;
  isCarousel: boolean | null;
}

export interface PolymarketEvent {
  id: string;
  ticker?: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  resolutionSource?: string;
  startDate?: string;
  creationDate?: string;
  endDate?: string;
  image?: string;
  icon?: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  featured?: boolean;
  restricted?: boolean;
  live?: boolean;
  liquidity?: number;
  volume?: number;
  openInterest?: number;
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;
  volume1yr?: number;
  category?: string;
  subcategory?: string;
  markets: PolymarketMarket[];
  series?: Record<string, unknown>[];
  tags?: PolymarketTag[];
  eventCreators?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface ListEventsResponse {
  events: PolymarketEvent[];
  next_cursor?: string;
}

export interface ListEventsRequestOptions {
  signal?: AbortSignal;
}

export class PolymarketApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly responseBody: unknown,
  ) {
    super(`Polymarket API request failed with status ${status}`);
    this.name = 'PolymarketApiError';
  }
}

function validateKeysetParams(params: ListEventsParams) {
  if (
    params.limit !== undefined &&
    (!Number.isInteger(params.limit) || params.limit < 1 || params.limit > 500)
  ) {
    throw new RangeError('limit must be an integer between 1 and 500');
  }

  const includedTagIds = new Set(params.tag_id ?? []);
  const overlappingTagId = params.exclude_tag_id?.find((tagId) => includedTagIds.has(tagId));

  if (overlappingTagId !== undefined) {
    throw new RangeError(`tag_id and exclude_tag_id cannot both contain ${overlappingTagId}`);
  }
}

function validateOffsetParams(params: ListEventsByOffsetParams) {
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
}

function validateEventId(id: number) {
  if (!Number.isInteger(id)) {
    throw new TypeError('id must be an integer');
  }
}

function createEventsUrl(pathname: string, params: object) {
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

async function fetchPolymarketResponse(
  url: URL,
  options: ListEventsRequestOptions,
): Promise<unknown> {
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

function parseEventResponse(responseBody: unknown): PolymarketEvent {
  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    Array.isArray(responseBody) ||
    !('id' in responseBody)
  ) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as PolymarketEvent;
}

/**
 * Use case: load a filterable page of Polymarket events for discovery screens,
 * search results, or infinite scrolling. Pass the returned `next_cursor` as
 * `after_cursor` to fetch the next stable page without offset-based duplicates.
 */
export async function listEvents(
  params: ListEventsParams = {},
  options: ListEventsRequestOptions = {},
): Promise<ListEventsResponse> {
  validateKeysetParams(params);

  const responseBody = await fetchPolymarketResponse(
    createEventsUrl('/events/keyset', params),
    options,
  );

  if (
    typeof responseBody !== 'object' ||
    responseBody === null ||
    !('events' in responseBody) ||
    !Array.isArray(responseBody.events)
  ) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as ListEventsResponse;
}

/**
 * Use case: fetch event lists by page number or a fixed slice, such as an admin
 * table or a short curated section. Increase `offset` by `limit` for each page;
 * prefer `listEvents` for frequently changing feeds that need stable pagination.
 */
export async function listEventsByOffset(
  params: ListEventsByOffsetParams = {},
  options: ListEventsRequestOptions = {},
): Promise<PolymarketEvent[]> {
  validateOffsetParams(params);

  const responseBody = await fetchPolymarketResponse(
    createEventsUrl('/events', params),
    options,
  );

  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as PolymarketEvent[];
}

/**
 * Use case: load one complete Polymarket event for an event-detail screen after
 * selecting an event from a list. Enable the optional flags when the UI also
 * needs the event's chat or template relations.
 */
export async function getEventById(
  id: number,
  params: GetEventByIdParams = {},
  options: ListEventsRequestOptions = {},
): Promise<PolymarketEvent> {
  validateEventId(id);

  const responseBody = await fetchPolymarketResponse(
    createEventsUrl(`/events/${id}`, params),
    options,
  );

  return parseEventResponse(responseBody);
}

/**
 * Use case: fetch an event's categories for topic chips, related-event
 * recommendations, or tag-based navigation without loading the full event.
 */
export async function getEventTags(
  id: number,
  options: ListEventsRequestOptions = {},
): Promise<PolymarketTag[]> {
  validateEventId(id);

  const responseBody = await fetchPolymarketResponse(
    createEventsUrl(`/events/${id}/tags`, {}),
    options,
  );

  if (!Array.isArray(responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as PolymarketTag[];
}

/**
 * Use case: load an event-detail screen from a human-readable route or shared
 * Polymarket link when the event slug is available instead of its numeric ID.
 */
export async function getEventBySlug(
  slug: string,
  params: GetEventBySlugParams = {},
  options: ListEventsRequestOptions = {},
): Promise<PolymarketEvent> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new TypeError('slug must be a non-empty string');
  }

  const responseBody = await fetchPolymarketResponse(
    createEventsUrl(`/events/slug/${encodeURIComponent(normalizedSlug)}`, params),
    options,
  );

  return parseEventResponse(responseBody);
}

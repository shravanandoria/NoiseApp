import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';

import { PolymarketApiError } from './events';
import type { OrderSide } from './orderbook_pricing';

const POLYMARKET_CLOB_API_URL = 'https://clob.polymarket.com';

export { PolymarketApiError } from './events';
export type { OrderSide } from './orderbook_pricing';

/**
 * L2 credentials issued by `POST /auth/api-key` (or `/auth/derive-api-key`),
 * required by every endpoint in this file. `secret` is the base64-encoded
 * CLOB API secret used to HMAC-sign each request.
 */
export interface ClobApiCredentials {
  address: string;
  apiKey: string;
  secret: string;
  passphrase: string;
}

export type ClobOrderType = 'GTC' | 'FOK' | 'GTD' | 'FAK';

/**
 * A fully built and EIP-712-signed CLOB order. This module does not
 * construct or sign orders; build and sign it with your wallet/signing layer
 * (see Polymarket's "Place Orders" guide), then pass the result here.
 */
export interface ClobSignedOrder {
  maker: string;
  signer: string;
  tokenId: string;
  makerAmount: string;
  takerAmount: string;
  side: OrderSide;
  expiration: string;
  timestamp: string;
  metadata?: string;
  builder: string;
  signature: string;
  salt: number;
  signatureType: number;
}

export interface CreateOrderRequest {
  order: ClobSignedOrder;
  owner: string;
  orderType?: ClobOrderType;
  deferExec?: boolean;
  postOnly?: boolean;
}

export interface CreateOrderResponse {
  success: boolean;
  orderID: string;
  status: 'live' | 'matched' | 'delayed' | string;
  makingAmount?: string;
  takingAmount?: string;
  transactionsHashes?: string[];
  tradeIDs?: string[];
  errorMsg?: string;
}

export interface CancelOrdersResult {
  canceled: string[];
  not_canceled: Record<string, string>;
}

export interface CancelMarketOrdersParams {
  market: string;
  asset_id: string;
}

export interface ClobAccountOrder {
  id: string;
  status: string;
  owner: string;
  maker_address: string;
  market: string;
  asset_id: string;
  side: OrderSide;
  original_size: string;
  size_matched: string;
  price: string;
  outcome: string;
  expiration: string;
  order_type: ClobOrderType;
  associate_trades?: string[];
  created_at: number;
}

export interface GetOrdersParams {
  id?: string;
  market?: string;
  asset_id?: string;
  next_cursor?: string;
}

export interface GetOrdersResponse {
  limit: number;
  next_cursor: string;
  count: number;
  data: ClobAccountOrder[];
}

export interface ClobTradeMakerOrder {
  order_id?: string;
  owner?: string;
  maker_address?: string;
  matched_amount?: string;
  price?: string;
  fee_rate_bps?: string;
  asset_id?: string;
  outcome?: string;
  side?: OrderSide;
}

export interface ClobTrade {
  id: string;
  taker_order_id: string;
  market: string;
  asset_id: string;
  side: OrderSide;
  size: string;
  price: string;
  status: string;
  match_time: string;
  last_update: string;
  outcome: string;
  bucket_index: number;
  owner: string;
  maker_address: string;
  trader_side: 'TAKER' | 'MAKER';
  fee_rate_bps?: string;
  transaction_hash?: string;
  err_msg?: string | null;
  maker_orders?: ClobTradeMakerOrder[];
}

export interface GetTradesParams {
  maker_address: string;
  id?: string;
  market?: string;
  asset_id?: string;
  before?: string;
  after?: string;
  next_cursor?: string;
}

export interface GetTradesResponse {
  limit: number;
  next_cursor: string;
  count: number;
  data: ClobTrade[];
}

export type OrdersScoringResult = Record<string, boolean>;

export interface HeartbeatResponse {
  status: string;
}

export interface HeartbeatV1Response {
  heartbeat_id: string;
}

export type NotificationSignatureType = 0 | 1 | 2;

export interface ClobNotification {
  id: number;
  owner?: string;
  type: 1 | 2 | 3 | 4 | 5 | 6;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface OrdersRequestOptions {
  signal?: AbortSignal;
}

const MAX_CREATE_ORDERS_BATCH = 15;
const MAX_CANCEL_ORDERS_BATCH = 1000;

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

function validateOrderId(orderId: string): string {
  const normalized = orderId.trim();

  if (!normalized) {
    throw new TypeError('orderId must be a non-empty string');
  }

  return normalized;
}

function validateOrderIds(orderIds: readonly string[], maxCount?: number) {
  if (orderIds.length === 0 || orderIds.some((orderId) => !orderId.trim())) {
    throw new TypeError('orderIds must contain at least one non-empty order id');
  }

  if (maxCount !== undefined && orderIds.length > maxCount) {
    throw new RangeError(`orderIds must contain at most ${maxCount} entries`);
  }
}

function validateSignedOrder(order: ClobSignedOrder) {
  const requiredStringFields: (keyof ClobSignedOrder)[] = [
    'maker',
    'signer',
    'tokenId',
    'makerAmount',
    'takerAmount',
    'expiration',
    'timestamp',
    'builder',
    'signature',
  ];

  requiredStringFields.forEach((field) => {
    const value = order[field];

    if (typeof value !== 'string' || !value.trim()) {
      throw new TypeError(`order.${field} must be a non-empty string`);
    }
  });

  if (order.side !== 'BUY' && order.side !== 'SELL') {
    throw new TypeError('order.side must be "BUY" or "SELL"');
  }

  if (!Number.isInteger(order.salt)) {
    throw new TypeError('order.salt must be an integer');
  }

  if (!Number.isInteger(order.signatureType) || order.signatureType < 0) {
    throw new TypeError('order.signatureType must be a non-negative integer');
  }
}

function validateCreateOrderRequest(request: CreateOrderRequest) {
  validateSignedOrder(request.order);

  if (!request.owner.trim()) {
    throw new TypeError('owner must be a non-empty string');
  }
}

function validateCreateOrderRequests(requests: readonly CreateOrderRequest[]) {
  if (requests.length === 0) {
    throw new TypeError('orders must contain at least one entry');
  }

  if (requests.length > MAX_CREATE_ORDERS_BATCH) {
    throw new RangeError(`orders must contain at most ${MAX_CREATE_ORDERS_BATCH} entries`);
  }

  requests.forEach(validateCreateOrderRequest);
}

function validateCancelMarketOrdersParams(params: CancelMarketOrdersParams) {
  if (!params.market.trim()) {
    throw new TypeError('market must be a non-empty string');
  }

  if (!params.asset_id.trim()) {
    throw new TypeError('asset_id must be a non-empty string');
  }
}

function validateGetTradesParams(params: GetTradesParams) {
  if (!params.maker_address.trim()) {
    throw new TypeError('maker_address must be a non-empty string');
  }
}

function validateSignatureType(signatureType: NotificationSignatureType) {
  if (signatureType !== 0 && signatureType !== 1 && signatureType !== 2) {
    throw new TypeError('signatureType must be 0, 1, or 2');
  }
}

function validateNotificationIds(ids: readonly number[]) {
  if (ids.length === 0 || ids.some((id) => !Number.isInteger(id))) {
    throw new TypeError('ids must contain at least one integer notification id');
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
  bodyString: string,
): Record<string, string> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const message = `${timestamp}${method}${pathname}${bodyString}`;
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

interface SignedRequestInit {
  searchParams?: Record<string, unknown>;
  body?: unknown;
}

async function fetchSignedClobJson(
  method: 'GET' | 'POST' | 'DELETE',
  pathname: string,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions,
  init: SignedRequestInit = {},
): Promise<unknown> {
  validateCredentials(credentials);

  const url = new URL(pathname, POLYMARKET_CLOB_API_URL);

  Object.entries(init.searchParams ?? {}).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  const hasBody = init.body !== undefined;
  const bodyString = hasBody ? JSON.stringify(init.body) : '';
  const authHeaders = createL2AuthHeaders(credentials, method, pathname, bodyString);

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders,
    },
    body: hasBody ? bodyString : undefined,
    signal: options.signal,
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new PolymarketApiError(response.status, responseBody);
  }

  return responseBody;
}

/**
 * Submits one signed order to the CLOB, for a buy/sell confirmation flow
 * where the caller has already built and EIP-712-signed the order. Returns
 * `live` when the order rests on the book, `matched` when it fills
 * immediately, or `delayed` when it's marketable but subject to a matching
 * delay.
 */
export async function createOrder(
  request: CreateOrderRequest,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<CreateOrderResponse> {
  validateCreateOrderRequest(request);

  const responseBody = await fetchSignedClobJson('POST', '/order', credentials, options, {
    body: request,
  });

  assertPlainObject(responseBody, 200);

  if (!('success' in responseBody) || !('orderID' in responseBody) || !('status' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as CreateOrderResponse;
}

/**
 * Submits up to 15 signed orders in one request, for placing several
 * outcomes or a bracket of orders together. Orders are processed in
 * parallel; check each response entry independently since one order can
 * fail while others succeed.
 */
export async function createOrders(
  requests: readonly CreateOrderRequest[],
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<CreateOrderResponse[]> {
  validateCreateOrderRequests(requests);

  const responseBody = await fetchSignedClobJson('POST', '/orders', credentials, options, {
    body: requests,
  });

  assertArray(responseBody, 200);

  return responseBody as CreateOrderResponse[];
}

/**
 * Cancels a single resting order by ID, for a cancel action on an open-order
 * row. Works even while the CLOB is in cancel-only mode.
 */
export async function cancelOrder(
  orderId: string,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<CancelOrdersResult> {
  const normalizedOrderId = validateOrderId(orderId);

  const responseBody = await fetchSignedClobJson('DELETE', '/order', credentials, options, {
    body: { orderID: normalizedOrderId },
  });

  assertPlainObject(responseBody, 200);

  if (!('canceled' in responseBody) || !('not_canceled' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as CancelOrdersResult;
}

/**
 * Cancels up to 1000 resting orders by ID in one request, for a "cancel
 * selected" action on an open-orders list. Duplicate IDs are ignored; works
 * even while the CLOB is in cancel-only mode.
 */
export async function cancelOrders(
  orderIds: readonly string[],
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<CancelOrdersResult> {
  validateOrderIds(orderIds, MAX_CANCEL_ORDERS_BATCH);

  const responseBody = await fetchSignedClobJson('DELETE', '/orders', credentials, options, {
    body: orderIds,
  });

  assertPlainObject(responseBody, 200);

  if (!('canceled' in responseBody) || !('not_canceled' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as CancelOrdersResult;
}

/**
 * Cancels every resting order for the authenticated account, for a
 * "cancel all" panic-button action. Works even while the CLOB is in
 * cancel-only mode.
 */
export async function cancelAllOrders(
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<CancelOrdersResult> {
  const responseBody = await fetchSignedClobJson('DELETE', '/cancel-all', credentials, options);

  assertPlainObject(responseBody, 200);

  if (!('canceled' in responseBody) || !('not_canceled' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as CancelOrdersResult;
}

/**
 * Cancels every resting order the account has on one market's outcome token,
 * for a "cancel all orders in this market" action on a market-detail screen.
 * Works even while the CLOB is in cancel-only mode.
 */
export async function cancelMarketOrders(
  params: CancelMarketOrdersParams,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<CancelOrdersResult> {
  validateCancelMarketOrdersParams(params);

  const responseBody = await fetchSignedClobJson(
    'DELETE',
    '/cancel-market-orders',
    credentials,
    options,
    { body: params },
  );

  assertPlainObject(responseBody, 200);

  if (!('canceled' in responseBody) || !('not_canceled' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as CancelOrdersResult;
}

/**
 * Fetches one order (any status: live, partially filled, matched, or
 * cancelled) by its ID, for checking the current state of an order the
 * caller already knows about rather than scanning the full order list.
 */
export async function getOrder(
  orderId: string,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<ClobAccountOrder> {
  const normalizedOrderId = validateOrderId(orderId);
  const pathname = `/data/order/${encodeURIComponent(normalizedOrderId)}`;

  const responseBody = await fetchSignedClobJson('GET', pathname, credentials, options);

  assertPlainObject(responseBody, 200);

  if (!('id' in responseBody) || !('status' in responseBody)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as ClobAccountOrder;
}

/**
 * Lists the authenticated account's orders, optionally narrowed to one
 * order, market, or outcome token, for reconciling local state with what's
 * actually resting on the book. Pass the returned `next_cursor` back in to
 * fetch the next page.
 */
export async function getOrders(
  params: GetOrdersParams,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<GetOrdersResponse> {
  const responseBody = await fetchSignedClobJson('GET', '/data/orders', credentials, options, {
    searchParams: {
      id: params.id,
      market: params.market,
      asset_id: params.asset_id,
      next_cursor: params.next_cursor,
    },
  });

  assertPlainObject(responseBody, 200);

  if (!('data' in responseBody) || !Array.isArray(responseBody.data)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as GetOrdersResponse;
}

/**
 * Lists executed fills for the authenticated account, as opposed to orders
 * still resting on the book, for reconstructing fill history or auditing
 * what actually matched. Pass the returned `next_cursor` back in to fetch
 * the next page.
 */
export async function getTrades(
  params: GetTradesParams,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<GetTradesResponse> {
  validateGetTradesParams(params);

  const responseBody = await fetchSignedClobJson('GET', '/data/trades', credentials, options, {
    searchParams: {
      maker_address: params.maker_address,
      id: params.id,
      market: params.market,
      asset_id: params.asset_id,
      before: params.before,
      after: params.after,
      next_cursor: params.next_cursor,
    },
  });

  assertPlainObject(responseBody, 200);

  if (!('data' in responseBody) || !Array.isArray(responseBody.data)) {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as GetTradesResponse;
}

/**
 * Checks whether one order currently qualifies for maker rewards (live on a
 * rewards-eligible market, meets minimum size, within the valid spread, and
 * has rested long enough), for a rewards indicator on an open-order row.
 */
export async function getOrderScoring(
  orderId: string,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<boolean> {
  const normalizedOrderId = validateOrderId(orderId);

  const responseBody = await fetchSignedClobJson('GET', '/order-scoring', credentials, options, {
    searchParams: { order_id: normalizedOrderId },
  });

  assertPlainObject(responseBody, 200);

  if (!('scoring' in responseBody) || typeof responseBody.scoring !== 'boolean') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody.scoring;
}

/**
 * Checks maker-reward scoring status for multiple orders in one request, for
 * a rewards indicator across an open-orders list. Returns a map keyed by
 * order ID.
 */
export async function getOrdersScoring(
  orderIds: readonly string[],
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<OrdersScoringResult> {
  validateOrderIds(orderIds);

  const responseBody = await fetchSignedClobJson(
    'POST',
    '/orders-scoring',
    credentials,
    options,
    { body: orderIds },
  );

  assertPlainObject(responseBody, 200);

  return responseBody as OrdersScoringResult;
}

/**
 * Sends a heartbeat to keep the account's resting orders alive. If an
 * automated trading integration stops sending heartbeats, the CLOB
 * auto-cancels all of its open orders as a safety mechanism.
 */
export async function sendHeartbeat(
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<HeartbeatResponse> {
  const responseBody = await fetchSignedClobJson('POST', '/heartbeats', credentials, options);

  assertPlainObject(responseBody, 200);

  if (!('status' in responseBody) || typeof responseBody.status !== 'string') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as HeartbeatResponse;
}

/**
 * Sends a session-tracked heartbeat (v1), for automated trading integrations
 * that want the CLOB to detect out-of-order or duplicate heartbeat calls.
 * Pass an empty string as `heartbeatId` for the first call in a session, then
 * pass back the `heartbeat_id` from each response on the next call.
 */
export async function sendHeartbeatV1(
  heartbeatId: string,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<HeartbeatV1Response> {
  const responseBody = await fetchSignedClobJson('POST', '/v1/heartbeats', credentials, options, {
    body: { heartbeat_id: heartbeatId },
  });

  assertPlainObject(responseBody, 200);

  if (!('heartbeat_id' in responseBody) || typeof responseBody.heartbeat_id !== 'string') {
    throw new PolymarketApiError(200, responseBody);
  }

  return responseBody as HeartbeatV1Response;
}

/**
 * Fetches unread order-lifecycle notifications (fills, cancellations, market
 * resolution, reward payouts) for the authenticated account, for a
 * notifications inbox or badge count. `signatureType` must match the
 * account's wallet type (0 EOA, 1 proxy, 2 Gnosis Safe).
 */
export async function getNotifications(
  signatureType: NotificationSignatureType,
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<ClobNotification[]> {
  validateSignatureType(signatureType);

  const responseBody = await fetchSignedClobJson('GET', '/notifications', credentials, options, {
    searchParams: { signature_type: signatureType },
  });

  assertArray(responseBody, 200);

  return responseBody as ClobNotification[];
}

/**
 * Marks notifications as read so they stop appearing in `getNotifications`,
 * for dismissing items from a notifications inbox.
 */
export async function markNotificationsRead(
  ids: readonly number[],
  credentials: ClobApiCredentials,
  options: OrdersRequestOptions = {},
): Promise<void> {
  validateNotificationIds(ids);

  await fetchSignedClobJson('DELETE', '/notifications', credentials, options, {
    searchParams: { ids: ids.join(',') },
  });
}

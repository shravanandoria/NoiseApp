/**
 * Deterministic pseudo-random price history for the market chart.
 * Same seed always produces the same series, so charts stay stable
 * across re-renders without needing a real price-history endpoint.
 */

export type PricePoint = {
  index: number;
  value: number;
};

export const chartTimeframes = ["1H", "1D", "7D", "1M", "3M", "6M", "ALL"] as const;

export type ChartTimeframe = (typeof chartTimeframes)[number];

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

function hashSeed(seed: string) {
  return seed.split("").reduce((total, char) => total + char.charCodeAt(0), 7);
}

export function buildPriceSeries(seed: string, endValue: number, points = 60): PricePoint[] {
  const random = seededRandom(hashSeed(seed));
  const series: PricePoint[] = [];
  let value = endValue - 8 + random() * 6;

  for (let index = 0; index < points; index += 1) {
    value += (random() - 0.47) * 3.4;
    value = Math.max(4, Math.min(96, value));
    series.push({ index, value: Number(value.toFixed(2)) });
  }

  series[series.length - 1] = { index: points - 1, value: endValue };
  return series;
}

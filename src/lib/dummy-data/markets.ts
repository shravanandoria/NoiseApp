/**
 * Dummy prediction-market data for UI development.
 *
 * Shaped so it can later be swapped for real Polymarket data from
 * `@/lib/polymarket_apis` without changing any component that consumes it.
 */

export type MarketCategory =
  | "Politics"
  | "Crypto"
  | "Sports"
  | "Economics"
  | "Culture"
  | "Tech";

export type Market = {
  id: string;
  symbol: string;
  question: string;
  category: MarketCategory;
  icon: string;
  tint: string;
  yesPrice: number;
  changePct: number;
  volume: string;
  liquidity: string;
  holdersCount: number;
  endsAt: string;
  description: string;
};

export const markets: Market[] = [
  {
    id: "us-election-2028",
    symbol: "ELEC28",
    question: "Will the Democrats win the 2028 US Presidency?",
    category: "Politics",
    icon: "🗳️",
    tint: "#4B5EFC",
    yesPrice: 54,
    changePct: 2.4,
    volume: "$248.6M",
    liquidity: "$4.2M",
    holdersCount: 503840,
    endsAt: "Nov 7, 2028",
    description:
      "This market resolves YES if the candidate nominated by the Democratic Party is certified as the winner of the 2028 United States presidential election. Resolution follows the official Electoral College certification.",
  },
  {
    id: "btc-100k",
    symbol: "BTC100",
    question: "Will Bitcoin close above $100,000 this year?",
    category: "Crypto",
    icon: "₿",
    tint: "#F7931A",
    yesPrice: 71,
    changePct: 0.64,
    volume: "$182.3M",
    liquidity: "$3.1M",
    holdersCount: 214902,
    endsAt: "Dec 31, 2026",
    description:
      "Resolves YES if the BTC/USD daily close on the final trading day of the year is above $100,000 according to the Coinbase spot index. Settlement uses the 00:00 UTC close.",
  },
  {
    id: "fed-cut",
    symbol: "FEDCUT",
    question: "Will the Fed cut rates at the next meeting?",
    category: "Economics",
    icon: "🏦",
    tint: "#00C853",
    yesPrice: 38,
    changePct: -1.82,
    volume: "$96.4M",
    liquidity: "$1.8M",
    holdersCount: 88213,
    endsAt: "Sep 18, 2026",
    description:
      "Resolves YES if the FOMC announces a reduction of the federal funds target range at its next scheduled meeting. Any cut size counts.",
  },
  {
    id: "champions-league",
    symbol: "UCL",
    question: "Will Real Madrid win the Champions League?",
    category: "Sports",
    icon: "⚽",
    tint: "#FFD400",
    yesPrice: 22,
    changePct: 3.46,
    volume: "$74.1M",
    liquidity: "$920K",
    holdersCount: 51204,
    endsAt: "May 30, 2027",
    description:
      "Resolves YES if Real Madrid CF lifts the UEFA Champions League trophy for the current season. Abandoned or replayed finals follow UEFA's official ruling.",
  },
  {
    id: "gpt6-release",
    symbol: "GPT6",
    question: "Will OpenAI release GPT-6 before July?",
    category: "Tech",
    icon: "🤖",
    tint: "#8B5CF6",
    yesPrice: 44,
    changePct: -0.21,
    volume: "$61.9M",
    liquidity: "$780K",
    holdersCount: 39877,
    endsAt: "Jul 1, 2027",
    description:
      "Resolves YES if OpenAI publicly launches a model branded GPT-6 and makes it generally available to consumers or developers before the deadline.",
  },
  {
    id: "oscar-best-picture",
    symbol: "OSCAR",
    question: "Will an A24 film win Best Picture?",
    category: "Culture",
    icon: "🎬",
    tint: "#FF4D2E",
    yesPrice: 17,
    changePct: 1.13,
    volume: "$28.4M",
    liquidity: "$410K",
    holdersCount: 22318,
    endsAt: "Mar 14, 2027",
    description:
      "Resolves YES if a film distributed by A24 wins the Academy Award for Best Picture at the next ceremony. Co-distribution credits count.",
  },
  {
    id: "mars-launch",
    symbol: "MARS",
    question: "Will SpaceX launch Starship to Mars orbit?",
    category: "Tech",
    icon: "🚀",
    tint: "#22D3EE",
    yesPrice: 9,
    changePct: -2.05,
    volume: "$19.2M",
    liquidity: "$260K",
    holdersCount: 14092,
    endsAt: "Dec 31, 2028",
    description:
      "Resolves YES if a Starship vehicle achieves Mars orbital insertion confirmed by SpaceX telemetry and independent tracking.",
  },
];

export const categoryFilters = [
  "Trending",
  "Politics",
  "Crypto",
  "Sports",
  "Economics",
  "Culture",
  "Tech",
] as const;

export type CategoryFilter = (typeof categoryFilters)[number];

export type TopTrader = {
  name: string;
  pnl: string;
  avatarSeed: string;
};

export const topTraders: TopTrader[] = [
  { name: "Quanterty", pnl: "+$869,254.04", avatarSeed: "quanterty-whale" },
  { name: "Rowdy", pnl: "+$479,306.41", avatarSeed: "rowdy-fox" },
  { name: "0xVela", pnl: "+$312,880.19", avatarSeed: "0xvela-dragon" },
  { name: "SimonADHD03", pnl: "+$204,117.60", avatarSeed: "simon-turtle" },
];

export type Holder = {
  name: string;
  entry: string;
  value: string;
  changePct: number;
  avatarSeed: string;
};

export const holders: Holder[] = [
  { name: "SimonADHD03", entry: "42¢ avg. entry", value: "$38,314.23", changePct: -1.37, avatarSeed: "simon-turtle" },
  { name: "GNMICAT", entry: "38¢ avg. entry", value: "$12,655.37", changePct: -3.24, avatarSeed: "gnmicat-cat" },
  { name: "Quanterty", entry: "51¢ avg. entry", value: "$9,201.08", changePct: 5.12, avatarSeed: "quanterty-whale" },
  { name: "belle.eth", entry: "33¢ avg. entry", value: "$6,884.90", changePct: 2.06, avatarSeed: "belle-swan" },
  { name: "Rowdy", entry: "47¢ avg. entry", value: "$4,110.44", changePct: -0.82, avatarSeed: "rowdy-fox" },
];

export type FeedPost = {
  name: string;
  avatarSeed: string;
  time: string;
  text: string;
};

export const feedPosts: FeedPost[] = [
  { name: "Quanterty", avatarSeed: "quanterty-whale", time: "2m", text: "Polls tightening in the rust belt. Loading more YES here." },
  { name: "GNMICAT", avatarSeed: "gnmicat-cat", time: "14m", text: "Volume spike out of nowhere, someone knows something." },
  { name: "belle.eth", avatarSeed: "belle-swan", time: "1h", text: "Took profit at 56¢. Will re-enter on any dip below 50." },
  { name: "Rowdy", avatarSeed: "rowdy-fox", time: "3h", text: "This is the most liquid market on Noise right now." },
];

export function getMarketById(id: string): Market {
  return markets.find((market) => market.id === id) ?? markets[0]!;
}

export function getMarketsByCategory(category: string): Market[] {
  if (category === "Trending") {
    return markets;
  }
  return markets.filter((market) => market.category === category);
}

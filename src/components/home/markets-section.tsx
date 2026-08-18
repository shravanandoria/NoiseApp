import { Info, Tag } from "lucide-react-native";
import { Fragment, useState } from "react";
import { View } from "react-native";

import { FilterPills } from "@/components/filter-pills";
import { MarketRow } from "@/components/market/market-row";
import { SegmentedTabs } from "@/components/segmented-tabs";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { categoryFilters, getMarketsByCategory } from "@/lib/dummy-data/markets";

const MARKET_TABS = ["Watchlist", "Markets", "Live"] as const;
type MarketTab = (typeof MARKET_TABS)[number];

export function MarketsSection() {
  const [tab, setTab] = useState<MarketTab>("Markets");
  const [category, setCategory] = useState<(typeof categoryFilters)[number]>("Trending");

  const filtered = getMarketsByCategory(category);
  const visible = tab === "Watchlist" ? filtered.slice(0, 2) : filtered;

  return (
    <View className="mt-7">
      <SegmentedTabs items={MARKET_TABS} value={tab} onChange={setTab} />

      <FilterPills items={categoryFilters} value={category} onChange={setCategory} className="mt-4" />

      <View className="mt-4 flex-row items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
        <Tag size={18} color={THEME.primary} />
        <Text className="min-w-0 flex-1 text-sm font-semibold">
          <Text className="text-sm font-semibold text-primary">Lowest fees</Text>
          <Text className="text-sm font-semibold text-muted-foreground"> on every market, anywhere.</Text>
        </Text>
        <Info size={16} color={THEME.mutedForeground} />
      </View>

      <View className="mt-2">
        {visible.length === 0 ? (
          <Text className="py-10 text-center text-sm text-muted-foreground">
            No markets in this category yet.
          </Text>
        ) : (
          visible.map((market, index) => (
            <Fragment key={market.id}>
              {index > 0 ? <Separator /> : null}
              <MarketRow market={market} />
            </Fragment>
          ))
        )}
      </View>
    </View>
  );
}

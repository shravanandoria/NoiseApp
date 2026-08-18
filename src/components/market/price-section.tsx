import { useMemo, useState } from "react";
import { View } from "react-native";

import { FilterPills } from "@/components/filter-pills";
import { PriceChange } from "@/components/price-change";
import { PriceChart } from "@/components/price-chart";
import { Text } from "@/components/ui/text";
import type { Market } from "@/lib/dummy-data/markets";
import { buildPriceSeries, chartTimeframes, type ChartTimeframe } from "@/lib/dummy-data/price-series";

type PriceSectionProps = {
  market: Market;
};

export function PriceSection({ market }: PriceSectionProps) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("1H");

  const series = useMemo(
    () => buildPriceSeries(market.id + timeframe, market.yesPrice),
    [market.id, market.yesPrice, timeframe]
  );
  const up = market.changePct >= 0;

  return (
    <View>
      <Text className="mt-4 text-xl font-extrabold leading-snug">{market.question}</Text>

      <View className="mt-4 flex-row items-start justify-between gap-4">
        <View className="min-w-0">
          <Text className="tabular text-4xl font-extrabold leading-none">{market.yesPrice}¢</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <PriceChange value={market.changePct} />
            <Text className="text-sm text-muted-foreground">{timeframe.toLowerCase()}</Text>
          </View>
        </View>
        <View className="shrink-0 items-end">
          <Text className="tabular text-xl font-extrabold">{market.volume}</Text>
          <Text className="text-sm text-muted-foreground">Volume</Text>
        </View>
      </View>

      <View className="mt-4">
        <PriceChart data={series} up={up} />
      </View>

      <FilterPills items={chartTimeframes} value={timeframe} onChange={setTimeframe} className="mt-2" />
    </View>
  );
}

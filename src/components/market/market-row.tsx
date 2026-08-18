import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { MarketIcon } from "@/components/market/market-icon";
import { PriceChange } from "@/components/price-change";
import { Text } from "@/components/ui/text";
import type { Market } from "@/lib/dummy-data/markets";

type MarketRowProps = {
  market: Market;
};

export function MarketRow({ market }: MarketRowProps) {
  return (
    <Link href={{ pathname: "/market/[id]", params: { id: market.id } }} asChild>
      <Pressable className="flex-row items-center gap-3 py-3.5 active:opacity-70">
        <MarketIcon market={market} />
        <View className="min-w-0 flex-1">
          <Text className="text-base font-bold leading-tight" numberOfLines={2}>
            {market.question}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">{market.volume} Vol.</Text>
        </View>
        <View className="shrink-0 items-end">
          <Text className="tabular text-xl font-extrabold">{market.yesPrice}%</Text>
          <PriceChange value={market.changePct} className="mt-0.5" />
        </View>
      </Pressable>
    </Link>
  );
}

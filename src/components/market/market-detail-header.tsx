import { useRouter } from "expo-router";
import { ChevronLeft, History, Share2, Star } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { MarketIcon } from "@/components/market/market-icon";
import { Text } from "@/components/ui/text";
import type { Market } from "@/lib/dummy-data/markets";
import { THEME } from "@/lib/theme";

type MarketDetailHeaderProps = {
  market: Market;
};

export function MarketDetailHeader({ market }: MarketDetailHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="shrink-0 p-1 active:opacity-60">
        <ChevronLeft size={26} color={THEME.mutedForeground} />
      </Pressable>

      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <MarketIcon market={market} size={44} />
        <View className="min-w-0 flex-1">
          <Text className="text-xl font-extrabold" numberOfLines={1}>
            {market.symbol}
          </Text>
          <Text className="text-sm text-muted-foreground" numberOfLines={1}>
            {market.category}
          </Text>
        </View>
      </View>

      <View className="shrink-0 flex-row items-center gap-4">
        <History size={20} color={THEME.mutedForeground} />
        <Star size={20} color={THEME.mutedForeground} />
        <Share2 size={20} color={THEME.mutedForeground} />
      </View>
    </View>
  );
}

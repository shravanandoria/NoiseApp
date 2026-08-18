import { Info, Tag } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { Market } from "@/lib/dummy-data/markets";
import { THEME } from "@/lib/theme";

type BuyBarProps = {
  market: Market;
};

export function BuyBar({ market }: BuyBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute inset-x-0 bottom-0 border-t border-border bg-background px-4 pt-3"
      style={{ paddingBottom: insets.bottom + 12 }}>
      <View className="flex-row items-center justify-center gap-2 pb-3">
        <Tag size={14} color={THEME.primary} />
        <Text className="text-sm font-semibold text-primary">Lowest fees: 0.05%</Text>
        <Info size={14} color={THEME.mutedForeground} />
      </View>
      <View className="flex-row gap-3">
        <Button variant="up" size="xl" className="flex-1">
          <Text>Buy Yes · {market.yesPrice}¢</Text>
        </Button>
        <Button variant="down" size="xl" className="flex-1">
          <Text>Buy No · {100 - market.yesPrice}¢</Text>
        </Button>
      </View>
    </View>
  );
}

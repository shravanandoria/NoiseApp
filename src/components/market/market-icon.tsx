import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { hexToRgba } from "@/lib/color";
import type { Market } from "@/lib/dummy-data/markets";

type MarketIconProps = {
  market: Pick<Market, "icon" | "tint">;
  size?: number;
};

export function MarketIcon({ market, size = 48 }: MarketIconProps) {
  return (
    <View
      className="shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: hexToRgba(market.tint, 0.22),
        borderWidth: 1,
        borderColor: hexToRgba(market.tint, 0.45),
      }}>
      <Text style={{ fontSize: size * 0.45 }}>{market.icon}</Text>
    </View>
  );
}

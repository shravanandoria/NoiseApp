import { TrendingDown, TrendingUp } from "lucide-react-native";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

type PriceChangeProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export function PriceChange({ value, suffix = "%", className }: PriceChangeProps) {
  const isUp = value >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <View className={cn("flex-row items-center gap-1", className)}>
      <Icon size={13} color={isUp ? THEME.up : THEME.down} strokeWidth={2.5} />
      <Text
        className={cn("tabular text-sm font-semibold", isUp ? "text-up" : "text-down")}>
        {Math.abs(value).toFixed(2)}
        {suffix}
      </Text>
    </View>
  );
}

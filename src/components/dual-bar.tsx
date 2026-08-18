import { View } from "react-native";

import { Text } from "@/components/ui/text";

type DualBarProps = {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
};

export function DualBar({ leftLabel, rightLabel, leftValue, rightValue }: DualBarProps) {
  const total = leftValue + rightValue || 1;
  const leftPct = (leftValue / total) * 100;

  return (
    <View className="gap-2">
      <View className="flex-row items-baseline justify-between gap-4">
        <Text className="tabular shrink text-base font-extrabold" numberOfLines={1}>
          {leftLabel}
        </Text>
        <Text className="tabular shrink text-base font-extrabold" numberOfLines={1}>
          {rightLabel}
        </Text>
      </View>
      <View className="h-1.5 flex-row gap-1.5">
        <View className="h-1.5 rounded-full bg-up" style={{ width: `${leftPct}%` }} />
        <View className="h-1.5 flex-1 rounded-full bg-down" />
      </View>
    </View>
  );
}

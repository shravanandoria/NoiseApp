import { View } from "react-native";

import { Text } from "@/components/ui/text";

type StatRowProps = {
  label: string;
  value: string;
};

export function StatRow({ label, value }: StatRowProps) {
  return (
    <View className="flex-row items-baseline justify-between gap-3">
      <Text className="shrink text-base text-muted-foreground" numberOfLines={1}>
        {label}
      </Text>
      <Text className="tabular shrink-0 text-base font-extrabold">{value}</Text>
    </View>
  );
}

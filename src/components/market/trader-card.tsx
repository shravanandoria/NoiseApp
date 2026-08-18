import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/user-avatar";
import type { TopTrader } from "@/lib/dummy-data/markets";

type TraderCardProps = {
  trader: TopTrader;
};

export function TraderCard({ trader }: TraderCardProps) {
  return (
    <View className="w-40 shrink-0 rounded-2xl border border-border bg-card p-3">
      <View className="flex-row items-center gap-2">
        <UserAvatar seed={trader.avatarSeed} name={trader.name} size={32} />
        <Text className="shrink text-base font-bold" numberOfLines={1}>
          {trader.name}
        </Text>
      </View>
      <Text className="tabular mt-3 text-base font-bold text-up">{trader.pnl}</Text>
    </View>
  );
}

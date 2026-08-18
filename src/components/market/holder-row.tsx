import { View } from "react-native";

import { PriceChange } from "@/components/price-change";
import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/user-avatar";
import type { Holder } from "@/lib/dummy-data/markets";

type HolderRowProps = {
  holder: Holder;
};

export function HolderRow({ holder }: HolderRowProps) {
  return (
    <View className="flex-row items-center gap-3 py-3.5">
      <UserAvatar seed={holder.avatarSeed} name={holder.name} size={48} />
      <View className="min-w-0 flex-1">
        <Text className="text-lg font-extrabold" numberOfLines={1}>
          {holder.name}
        </Text>
        <Text className="text-sm text-muted-foreground" numberOfLines={1}>
          {holder.entry}
        </Text>
      </View>
      <View className="shrink-0 items-end">
        <Text className="tabular text-lg font-extrabold">{holder.value}</Text>
        <PriceChange value={holder.changePct} className="mt-0.5" />
      </View>
    </View>
  );
}

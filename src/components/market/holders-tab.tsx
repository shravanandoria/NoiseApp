import { Fragment, useState } from "react";
import { Switch, View } from "react-native";

import { HolderRow } from "@/components/market/holder-row";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { holders } from "@/lib/dummy-data/markets";
import { THEME } from "@/lib/theme";

export function HoldersTab() {
  const [friendsOnly, setFriendsOnly] = useState(false);
  const visible = friendsOnly ? holders.slice(0, 2) : holders;

  return (
    <View className="mt-4">
      <View className="flex-row items-center gap-3">
        <Switch
          value={friendsOnly}
          onValueChange={setFriendsOnly}
          trackColor={{ false: THEME.elevated, true: THEME.primary }}
          thumbColor={THEME.foreground}
        />
        <Text className="text-lg font-bold">Friends</Text>
      </View>

      <View className="mt-2">
        {visible.map((holder, index) => (
          <Fragment key={holder.name}>
            {index > 0 ? <Separator /> : null}
            <HolderRow holder={holder} />
          </Fragment>
        ))}
      </View>
    </View>
  );
}

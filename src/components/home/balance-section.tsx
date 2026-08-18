import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { accountBalance } from "@/lib/dummy-data/account";

export function BalanceSection() {
  return (
    <View className="mt-5 flex-row items-start justify-between gap-4">
      <View className="min-w-0 shrink">
        <Text className="tabular text-4xl font-extrabold leading-none">
          ${accountBalance.dollars}
          <Text className="tabular text-4xl font-extrabold leading-none text-muted-foreground">
            .{accountBalance.cents}
          </Text>
        </Text>
        <Text className="tabular mt-2 text-sm font-semibold text-up">
          {accountBalance.changeAmount} ({accountBalance.changePct}%) {accountBalance.window}
        </Text>
      </View>
      <Button size="xl" className="shrink-0">
        <Text>Deposit</Text>
      </Button>
    </View>
  );
}

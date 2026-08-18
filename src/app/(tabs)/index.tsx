import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BalanceSection } from "@/components/home/balance-section";
import { MarketsSection } from "@/components/home/markets-section";
import { TopTradersSection } from "@/components/home/top-traders-section";
import { LogoMark } from "@/components/logo-mark";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-32">
        <LogoMark className="mt-2" />
        <BalanceSection />
        <TopTradersSection />
        <MarketsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

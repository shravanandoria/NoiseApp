import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BuyBar } from "@/components/market/buy-bar";
import { DetailTabs } from "@/components/market/detail-tabs";
import { MarketDetailHeader } from "@/components/market/market-detail-header";
import { PriceSection } from "@/components/market/price-section";
import { getMarketById } from "@/lib/dummy-data/markets";

export default function MarketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const market = getMarketById(id ?? "");

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-40">
          <MarketDetailHeader market={market} />
          <PriceSection market={market} />
          <DetailTabs market={market} />
        </ScrollView>
      </SafeAreaView>

      <BuyBar market={market} />
    </View>
  );
}

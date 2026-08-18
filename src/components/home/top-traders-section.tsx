import { Lightbulb } from "lucide-react-native";
import { ScrollView } from "react-native";

import { SectionHeader } from "@/components/section-header";
import { TraderCard } from "@/components/market/trader-card";
import { topTraders } from "@/lib/dummy-data/markets";

export function TopTradersSection() {
  return (
    <>
      <SectionHeader icon={Lightbulb} title="Weekly Top Traders" className="mt-7" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerClassName="flex-row gap-3">
        {topTraders.map((trader) => (
          <TraderCard key={trader.name} trader={trader} />
        ))}
      </ScrollView>
    </>
  );
}

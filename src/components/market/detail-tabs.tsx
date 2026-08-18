import { useState } from "react";
import { View } from "react-native";

import { AboutTab } from "@/components/market/about-tab";
import { FeedTab } from "@/components/market/feed-tab";
import { HoldersTab } from "@/components/market/holders-tab";
import { SegmentedTabs } from "@/components/segmented-tabs";
import { holders } from "@/lib/dummy-data/markets";
import type { Market } from "@/lib/dummy-data/markets";

type DetailTab = "Holders" | "Feed" | "About";

type DetailTabsProps = {
  market: Market;
};

export function DetailTabs({ market }: DetailTabsProps) {
  const [tab, setTab] = useState<DetailTab>("Holders");
  const items = [`Holders (${holders.length})`, "Feed", "About"] as const;
  const activeLabel = tab === "Holders" ? items[0] : tab;

  return (
    <View className="mt-5">
      <SegmentedTabs
        items={items}
        value={activeLabel}
        onChange={(value) => setTab(value.startsWith("Holders") ? "Holders" : (value as DetailTab))}
      />

      {tab === "Holders" ? <HoldersTab /> : null}
      {tab === "Feed" ? <FeedTab /> : null}
      {tab === "About" ? <AboutTab market={market} /> : null}
    </View>
  );
}

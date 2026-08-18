import { Globe, Info, Tag } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { DualBar } from "@/components/dual-bar";
import { FilterPills } from "@/components/filter-pills";
import { StatRow } from "@/components/stat-row";
import { Text } from "@/components/ui/text";
import type { Market } from "@/lib/dummy-data/markets";
import { THEME } from "@/lib/theme";

const QUICK_LINKS = [
  { label: "Website", icon: Globe },
  { label: "Rules", icon: Info },
  { label: "Resolver", icon: Tag },
] as const;

const TX_WINDOWS = ["5M", "1H", "1D"] as const;
type TxWindow = (typeof TX_WINDOWS)[number];

type AboutTabProps = {
  market: Market;
};

export function AboutTab({ market }: AboutTabProps) {
  const [expanded, setExpanded] = useState(false);
  const [txWindow, setTxWindow] = useState<TxWindow>("1H");

  return (
    <View className="mt-5">
      <Text className="text-2xl font-extrabold">Rules</Text>
      <Text className="mt-3 text-lg leading-snug text-muted-foreground">
        {expanded ? `${market.description} Settlement is handled on-chain.` : market.description}{" "}
        {!expanded ? (
          <Text onPress={() => setExpanded(true)} className="font-semibold text-primary">
            Read more
          </Text>
        ) : null}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-5"
        contentContainerClassName="flex-row gap-3">
        {QUICK_LINKS.map(({ label, icon: Icon }) => (
          <Pressable
            key={label}
            className="shrink-0 flex-row items-center gap-2 rounded-2xl bg-elevated px-6 py-3.5 active:opacity-70">
            <Icon size={18} color={THEME.foreground} />
            <Text className="text-lg font-bold">{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="mt-8 flex-row items-center justify-between gap-4">
        <Text className="shrink truncate text-2xl font-extrabold">Transactions</Text>
        <FilterPills items={TX_WINDOWS} value={txWindow} onChange={setTxWindow} className="shrink-0" />
      </View>

      <View className="mt-5 gap-7">
        <DualBar leftLabel="273 buys" rightLabel="247 sells" leftValue={273} rightValue={247} />
        <DualBar leftLabel="$643K vol." rightLabel="$429.3K vol." leftValue={643} rightValue={429} />
        <DualBar leftLabel="136 buyers" rightLabel="127 sellers" leftValue={136} rightValue={127} />
      </View>

      <Text className="mt-8 text-2xl font-extrabold">Holders</Text>
      <View className="mt-4 gap-3">
        <StatRow label="Number of holders" value={market.holdersCount.toLocaleString()} />
        <StatRow label="Liquidity" value={market.liquidity} />
        <StatRow label="Ends" value={market.endsAt} />
      </View>
    </View>
  );
}

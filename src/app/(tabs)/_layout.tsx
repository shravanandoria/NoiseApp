import { BarChart3, Home, Search, User, Users } from "lucide-react-native";
import { Tabs, TabList, TabSlot, TabTrigger } from "expo-router/ui";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NavTabButton } from "@/components/nav-tab-button";

const TABS = [
  { name: "index", href: "/" as const, icon: Home, label: "Home" },
  { name: "search", href: "/search" as const, icon: Search, label: "Search" },
  { name: "portfolio", href: "/portfolio" as const, icon: BarChart3, label: "Portfolio" },
  { name: "social", href: "/social" as const, icon: Users, label: "Social" },
  { name: "profile", href: "/profile" as const, icon: User, label: "Profile" },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />

      {/* Defines the tab routes; visually hidden in favor of the floating bar below. */}
      <TabList style={{ display: "none" }}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} />
        ))}
      </TabList>

      <View
        className="absolute inset-x-0 bottom-0 items-center px-3"
        style={{ paddingBottom: insets.bottom + 12 }}
        pointerEvents="box-none">
        <View className="w-full max-w-[430px] flex-row items-center justify-between rounded-full border border-border bg-card px-3 py-2">
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} asChild>
              <NavTabButton icon={tab.icon} label={tab.label} />
            </TabTrigger>
          ))}
        </View>
      </View>
    </Tabs>
  );
}

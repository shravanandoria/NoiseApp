import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";

type ComingSoonProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 items-center justify-center gap-4 px-8 pb-24">
        <View className="size-16 items-center justify-center rounded-full bg-elevated">
          <Icon size={28} color={THEME.mutedForeground} />
        </View>
        <Text className="text-center text-xl font-extrabold">{title}</Text>
        <Text className="text-center text-base text-muted-foreground">{description}</Text>
      </View>
    </SafeAreaView>
  );
}

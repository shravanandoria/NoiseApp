import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  className?: string;
};

export function SectionHeader({ icon: Icon, title, className }: SectionHeaderProps) {
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Icon size={18} color={THEME.mutedForeground} />
      <Text className="text-xl font-extrabold">{title}</Text>
    </View>
  );
}

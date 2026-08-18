import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { THEME } from "@/lib/theme";

type NavTabButtonProps = PressableProps & {
  icon: LucideIcon;
  label: string;
  isFocused?: boolean;
};

export function NavTabButton({ icon: Icon, label, isFocused, ...props }: NavTabButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={isFocused ? { selected: true } : undefined}
      className="rounded-full p-3"
      style={isFocused ? { backgroundColor: THEME.elevated } : undefined}
      {...props}>
      <Icon size={22} strokeWidth={2.2} color={isFocused ? THEME.foreground : THEME.mutedForeground} />
    </Pressable>
  );
}

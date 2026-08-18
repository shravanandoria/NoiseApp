import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 40, className }: LogoMarkProps) {
  return (
    <View
      className={cn("items-center justify-center rounded-xl bg-primary", className)}
      style={{ width: size, height: size }}>
      <Text
        className="font-extrabold text-primary-foreground"
        style={{ fontSize: size * 0.5 }}>
        N
      </Text>
    </View>
  );
}

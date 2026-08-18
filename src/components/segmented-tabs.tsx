import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SegmentedTabsProps<T extends string> = {
  items: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <View className={cn("flex-row border-b border-border", className)}>
      {items.map((item) => {
        const selected = item === value;
        return (
          <Pressable key={item} onPress={() => onChange(item)} className="flex-1 pb-3">
            <Text
              className={cn(
                "text-center text-base font-bold",
                selected ? "text-foreground" : "text-muted-foreground"
              )}>
              {item}
            </Text>
            <View
              className={cn(
                "-mb-px mt-3 h-0.5 rounded-full",
                selected ? "bg-primary" : "bg-transparent"
              )}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

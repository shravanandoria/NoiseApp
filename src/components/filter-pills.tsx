import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type FilterPillsProps<T extends string> = {
  items: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function FilterPills<T extends string>({
  items,
  value,
  onChange,
  className,
}: FilterPillsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerClassName="flex-row gap-2">
      {items.map((item) => {
        const selected = item === value;
        return (
          <Pressable key={item} onPress={() => onChange(item)}>
            <View
              className={cn(
                "shrink-0 rounded-full px-4 py-2",
                selected ? "bg-elevated" : "bg-transparent"
              )}>
              <Text
                className={cn(
                  "text-sm font-bold",
                  selected ? "text-foreground" : "text-muted-foreground"
                )}>
                {item}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { getAvatarUrl } from "@/lib/dicebear";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  seed: string;
  name: string;
  size?: number;
  className?: string;
};

export function UserAvatar({ seed, name, size = 40, className }: UserAvatarProps) {
  return (
    <Avatar alt={name} className={cn(className)} style={{ width: size, height: size }}>
      <AvatarImage source={{ uri: getAvatarUrl(seed, size * 2) }} />
      <AvatarFallback>
        <Text className="text-sm font-bold">{name.charAt(0).toUpperCase()}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

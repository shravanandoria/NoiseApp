import { View } from "react-native";

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/user-avatar";
import type { FeedPost } from "@/lib/dummy-data/markets";

type FeedPostCardProps = {
  post: FeedPost;
};

export function FeedPostCard({ post }: FeedPostCardProps) {
  return (
    <Card className="gap-0 p-4">
      <View className="flex-row items-center gap-2">
        <UserAvatar seed={post.avatarSeed} name={post.name} size={28} />
        <Text className="min-w-0 flex-1 text-base font-bold" numberOfLines={1}>
          {post.name}
        </Text>
        <Text className="shrink-0 text-sm text-muted-foreground">{post.time}</Text>
      </View>
      <Text className="mt-2 text-base text-muted-foreground">{post.text}</Text>
    </Card>
  );
}

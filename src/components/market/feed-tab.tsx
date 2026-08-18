import { View } from "react-native";

import { FeedPostCard } from "@/components/market/feed-post-card";
import { feedPosts } from "@/lib/dummy-data/markets";

export function FeedTab() {
  return (
    <View className="mt-4 gap-3">
      {feedPosts.map((post) => (
        <FeedPostCard key={post.name + post.time} post={post} />
      ))}
    </View>
  );
}

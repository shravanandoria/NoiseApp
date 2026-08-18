import { Users } from "lucide-react-native";

import { ComingSoon } from "@/components/coming-soon";

export default function SocialScreen() {
  return (
    <ComingSoon
      icon={Users}
      title="Social"
      description="Follow traders and see what the community is betting on. Coming soon."
    />
  );
}

import { User } from "lucide-react-native";

import { ComingSoon } from "@/components/coming-soon";

export default function ProfileScreen() {
  return (
    <ComingSoon
      icon={User}
      title="Profile"
      description="Manage your account, wallet, and settings. Coming soon."
    />
  );
}

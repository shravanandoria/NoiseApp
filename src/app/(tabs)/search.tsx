import { Search } from "lucide-react-native";

import { ComingSoon } from "@/components/coming-soon";

export default function SearchScreen() {
  return (
    <ComingSoon
      icon={Search}
      title="Search"
      description="Search across every market on Noise. Coming soon."
    />
  );
}

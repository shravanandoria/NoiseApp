import { BarChart3 } from "lucide-react-native";

import { ComingSoon } from "@/components/coming-soon";

export default function PortfolioScreen() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Portfolio"
      description="Track your positions, P&L, and activity. Coming soon."
    />
  );
}

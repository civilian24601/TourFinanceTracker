import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { TourSection } from "@/components/ui/tour-section";
import { FinancialInsights } from "@/components/ui/financial-insights";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Tour } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  const { data: tours = [] } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  return (
    <div className="min-h-screen bg-[#262629]">
      <Header />
      <motion.main
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="container mx-auto py-6 px-4 space-y-6 pb-32"
      >
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold">
          <span className="text-[#FF6200]">Welcome back, </span>
          <span className="text-white">{user?.username}!</span>
        </h1>

        {/* Tours Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Tours</h2>
          <p className="text-muted-foreground">
            Currently running, scheduled and completed tour history at a glance
          </p>
          <TourSection tours={tours} />
        </div>

        {/* Financial Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Financial Insights</h2>
          <FinancialInsights />
        </div>
      </motion.main>
      <Navigation />
    </div>
  );
}
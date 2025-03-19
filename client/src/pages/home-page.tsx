import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { TourSection } from "@/components/ui/tour-section";
import { FinancialInsights } from "@/components/ui/financial-insights";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Tour } from "@shared/schema";

export default function HomePage() {
  const { data: tours = [] } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const today = new Date();
  const activeTours = tours.filter(tour => {
    const startDate = new Date(tour.startDate);
    const endDate = new Date(tour.endDate);
    return today >= startDate && today <= endDate;
  });

  const upcomingTours = tours.filter(tour => {
    const startDate = new Date(tour.startDate);
    return today < startDate;
  });

  const completedTours = tours.filter(tour => {
    const endDate = new Date(tour.endDate);
    return today > endDate;
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
        {/* Tour Sections */}
        {activeTours.length > 0 && (
          <TourSection
            title="Active Tours"
            description="Currently running tours"
            tours={activeTours}
          />
        )}
        {upcomingTours.length > 0 && (
          <TourSection
            title="Upcoming Tours"
            description="Tours scheduled for the future"
            tours={upcomingTours}
          />
        )}
        {completedTours.length > 0 && (
          <TourSection
            title="Past Tours"
            description="Completed tour history"
            tours={completedTours}
          />
        )}

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
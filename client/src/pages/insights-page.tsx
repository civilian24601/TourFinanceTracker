import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { InsightSection } from "@/components/insights/insight-section";
import { SAMPLE_INSIGHTS } from "@/types/insights";
import { motion } from "framer-motion";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#262629]">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto py-6 px-4 space-y-6 pb-32"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#FF6200]">Insights</h1>
          <p className="text-muted-foreground">
            AI-powered financial analysis and recommendations for your tours
          </p>
        </div>

        {/* Insight sections */}
        <div className="space-y-8 mt-8">
          {SAMPLE_INSIGHTS.map((section, index) => (
            <InsightSection key={index} section={section} />
          ))}
        </div>
      </motion.main>
      <Navigation />
    </div>
  );
}
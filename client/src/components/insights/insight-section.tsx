import { InsightCard } from "./insight-card";
import type { InsightSection as InsightSectionType } from "@/types/insights";
import { motion } from "framer-motion";

interface InsightSectionProps {
  section: InsightSectionType;
}

export function InsightSection({ section }: InsightSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-6"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2 text-white">{section.title}</h2>
        {section.description && (
          <p className="text-muted-foreground">{section.description}</p>
        )}
      </div>
      <div className="relative">
        <div 
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {section.insights.map((insight) => (
            <div 
              key={insight.id} 
              className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] snap-start h-full"
            >
              <InsightCard insight={insight} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

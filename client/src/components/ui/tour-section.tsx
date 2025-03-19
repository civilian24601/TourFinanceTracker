import { motion } from "framer-motion";
import { TourCard } from "./tour-card";
import type { Tour } from "@shared/schema";

interface TourSectionProps {
  tours: Tour[];
}

export function TourSection({ tours }: TourSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-6"
    >
      <div className="relative">
        <div 
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {tours.map((tour) => (
            <div 
              key={tour.id} 
              className="snap-start h-full"
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
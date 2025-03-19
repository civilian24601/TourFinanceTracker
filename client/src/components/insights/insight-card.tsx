import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import type { InsightCard as InsightCardType } from "@/types/insights";

interface InsightCardProps {
  insight: InsightCardType;
}

export function InsightCard({ insight }: InsightCardProps) {
  const TrendIcon = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: Minus
  }[insight.impact];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="w-full h-[280px] hover:shadow-lg transition-shadow duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] bg-[#2d2d30] rounded-lg overflow-hidden flex flex-col">
        <CardHeader className="p-4 flex-grow">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-2">
              <Badge 
                variant="secondary" 
                className={`
                  w-fit
                  ${insight.impact === 'positive' ? 'bg-green-500/10 text-green-500' : 
                    insight.impact === 'negative' ? 'bg-red-500/10 text-red-500' : 
                    'bg-gray-500/10 text-gray-500'}
                `}
              >
                {insight.category}
              </Badge>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TrendIcon className={`h-5 w-5 
                  ${insight.impact === 'positive' ? 'text-green-500' : 
                    insight.impact === 'negative' ? 'text-red-500' : 
                    'text-gray-500'}`} 
                />
              </motion.div>
            </div>
            <h3 className="font-semibold text-lg leading-tight text-white hover:text-primary line-clamp-2 mb-2">
              {insight.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {insight.description}
            </p>
            {insight.value && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-semibold mb-2"
                style={{
                  color: insight.impact === 'positive' ? '#22c55e' : 
                         insight.impact === 'negative' ? '#ef4444' : 
                         '#6b7280'
                }}
              >
                {insight.value}
              </motion.div>
            )}
            <div className="mt-auto">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  {insight.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {insight.readTime}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

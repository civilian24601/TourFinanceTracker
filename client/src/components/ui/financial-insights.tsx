import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { TrendingUp, AlertCircle, CheckCircle, TrendingDown, DollarSign, Calendar, Clock } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface InsightCard {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  impact: 'positive' | 'negative' | 'neutral';
  value?: string;
  trend?: number;
}

interface InsightSection {
  title: string;
  description?: string;
  insights: InsightCard[];
}

function InsightCard({ insight }: { insight: InsightCard }) {
  const TrendIcon = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: CheckCircle
  }[insight.impact];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="w-[280px] h-[280px] hover:shadow-lg transition-shadow duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] bg-[#2d2d30] rounded-lg overflow-hidden flex flex-col">
        <CardHeader className="p-4 flex-grow">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-2">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${insight.impact === 'positive' ? 'bg-green-500/10 text-green-500' : 
                  insight.impact === 'negative' ? 'bg-red-500/10 text-red-500' : 
                  'bg-gray-500/10 text-gray-500'}
              `}>
                {insight.category}
              </span>
              <TrendIcon className={`h-5 w-5 
                ${insight.impact === 'positive' ? 'text-green-500' : 
                  insight.impact === 'negative' ? 'text-red-500' : 
                  'text-gray-500'}`} 
              />
            </div>
            <h3 className="font-semibold text-lg leading-tight text-white hover:text-primary line-clamp-2 mb-2">
              {insight.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {insight.description}
            </p>
            {insight.value && (
              <div className="text-xl font-semibold mb-2"
                style={{
                  color: insight.impact === 'positive' ? '#22c55e' : 
                         insight.impact === 'negative' ? '#ef4444' : 
                         '#6b7280'
                }}
              >
                {insight.value}
              </div>
            )}
            <div className="mt-auto">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
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

function InsightSection({ section }: { section: InsightSection }) {
  return (
    <div className="py-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">{section.title}</h3>
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
              className="snap-start h-full"
            >
              <InsightCard insight={insight} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SAMPLE_INSIGHTS: InsightSection[] = [
  {
    title: "Revenue Analysis",
    description: "Key financial metrics and trends",
    insights: [
      {
        id: "1",
        title: "Merchandise Sales Growth",
        description: "Your merch revenue has increased significantly compared to last tour",
        category: "Revenue",
        date: "Today",
        readTime: "2 min",
        impact: "positive",
        value: "+25%"
      },
      {
        id: "2",
        title: "Ticket Sales Performance",
        description: "Current tour ticket sales analysis and projections",
        category: "Sales",
        date: "Today",
        readTime: "3 min",
        impact: "positive",
        value: "15% above target"
      }
    ]
  },
  {
    title: "Cost Management",
    description: "Expense analysis and optimization opportunities",
    insights: [
      {
        id: "3",
        title: "Venue Cost Analysis",
        description: "Breakdown of venue costs and potential savings",
        category: "Expenses",
        date: "Today",
        readTime: "4 min",
        impact: "neutral",
        value: "$2,500 avg/venue"
      },
      {
        id: "4",
        title: "Travel Expense Alert",
        description: "Rising fuel costs affecting travel budget",
        category: "Travel",
        date: "Today",
        readTime: "2 min",
        impact: "negative",
        value: "-10% margin"
      }
    ]
  },
  {
    title: "Future Projections",
    description: "AI-powered forecasts and recommendations",
    insights: [
      {
        id: "5",
        title: "Q3 Revenue Forecast",
        description: "Projected earnings based on current trends",
        category: "Forecast",
        date: "Today",
        readTime: "3 min",
        impact: "positive",
        value: "$125K expected"
      },
      {
        id: "6",
        title: "Cost Saving Opportunities",
        description: "AI-identified areas for potential savings",
        category: "Optimization",
        date: "Today",
        readTime: "4 min",
        impact: "positive",
        value: "$15K potential"
      }
    ]
  }
];

export function FinancialInsights() {
  return (
    <div className="space-y-8">
      {SAMPLE_INSIGHTS.map((section, index) => (
        <InsightSection key={index} section={section} />
      ))}
    </div>
  );
}
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calendar, 
  DollarSign,
  BarChart as ChartIcon,
  Clock,
  Lightbulb,
  PieChart,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

interface InsightCard {
  id: string;
  title: string;
  description: string;
  category: string;
  value?: string;
  impact: 'positive' | 'negative' | 'neutral';
  date: string;
  metrics?: { label: string; value: string }[];
}

interface InsightSection {
  title: string;
  description: string;
  insights: InsightCard[];
}

function InsightCard({ insight }: { insight: InsightCard }) {
  const TrendIcon = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: PieChart
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
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <Badge 
              variant="secondary" 
              className={`
                ${insight.impact === 'positive' ? 'bg-green-500/10 text-green-500' : 
                  insight.impact === 'negative' ? 'bg-red-500/10 text-red-500' : 
                  'bg-blue-500/10 text-blue-500'}
              `}
            >
              {insight.category}
            </Badge>
            <TrendIcon className={`h-5 w-5 
              ${insight.impact === 'positive' ? 'text-green-500' : 
                insight.impact === 'negative' ? 'text-red-500' : 
                'text-blue-500'}`} 
            />
          </div>

          <h3 className="font-semibold text-lg text-white mb-2">
            {insight.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {insight.description}
          </p>

          {insight.value && (
            <div className="text-xl font-semibold mb-4"
              style={{
                color: insight.impact === 'positive' ? '#22c55e' : 
                       insight.impact === 'negative' ? '#ef4444' : 
                       '#3b82f6'
              }}
            >
              {insight.value}
            </div>
          )}

          {insight.metrics && (
            <div className="space-y-2 mt-auto mb-4">
              {insight.metrics.map((metric, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium text-white">{metric.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{insight.date}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InsightSection({ section }: { section: InsightSection }) {
  return (
    <div className="py-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">{section.title}</h3>
        <p className="text-muted-foreground">{section.description}</p>
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
            <div key={insight.id} className="snap-start h-full">
              <InsightCard insight={insight} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const INSIGHTS_DATA: InsightSection[] = [
  {
    title: "Summary & Analysis",
    description: "Key financial metrics and risk assessment",
    insights: [
      {
        id: "1",
        title: "Current Financial Status",
        description: "Overall financial health and key performance indicators",
        category: "Summary",
        value: "Healthy",
        impact: "positive",
        date: "Today",
        metrics: [
          { label: "Revenue Growth", value: "+15%" },
          { label: "Cost Control", value: "Optimal" }
        ]
      },
      {
        id: "2",
        title: "Risk Assessment",
        description: "Current risk level and contributing factors",
        category: "Risk",
        value: "Low Risk",
        impact: "positive",
        date: "Today",
        metrics: [
          { label: "Cash Flow", value: "Strong" },
          { label: "Debt Ratio", value: "8.5%" }
        ]
      },
      {
        id: "3",
        title: "Spending Patterns",
        description: "Analysis of recent spending trends and behaviors",
        category: "Trends",
        value: "-5% MoM",
        impact: "neutral",
        date: "Today",
        metrics: [
          { label: "Top Category", value: "Travel" },
          { label: "Avg Transaction", value: "$2,450" }
        ]
      }
    ]
  },
  {
    title: "Forecasting & Planning",
    description: "Future projections and optimization opportunities",
    insights: [
      {
        id: "4",
        title: "Q2 2025 Forecast",
        description: "Projected expenses and revenue for next quarter",
        category: "Forecast",
        value: "$125K Revenue",
        impact: "positive",
        date: "Today",
        metrics: [
          { label: "Confidence", value: "92%" },
          { label: "Growth Rate", value: "+18%" }
        ]
      },
      {
        id: "5",
        title: "Budget Optimization",
        description: "Identified areas for cost reduction and efficiency",
        category: "Optimization",
        value: "$15K Potential Savings",
        impact: "positive",
        date: "Today",
        metrics: [
          { label: "Focus Area", value: "Venues" },
          { label: "Timeline", value: "3 months" }
        ]
      },
      {
        id: "6",
        title: "Seasonal Impact",
        description: "Expected seasonal variations in costs and revenue",
        category: "Seasonal",
        value: "Q3 Peak Expected",
        impact: "neutral",
        date: "Today",
        metrics: [
          { label: "Peak Month", value: "August" },
          { label: "Variance", value: "±12%" }
        ]
      }
    ]
  }
];

export function FinancialInsights() {
  return (
    <div className="space-y-8">
      {INSIGHTS_DATA.map((section, index) => (
        <InsightSection key={index} section={section} />
      ))}
    </div>
  );
}
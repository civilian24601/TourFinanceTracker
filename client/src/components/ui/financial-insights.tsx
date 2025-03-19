import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar
} from "lucide-react";
import { Skeleton } from "./skeleton";
import { motion } from "framer-motion";

interface FinancialInsight {
  summary: string;
  trends: string[];
  recommendations: string[];
  forecast: {
    nextMonthExpense: number;
    confidence: number;
    breakdown: {
      category: string;
      amount: number;
      trend: "increasing" | "decreasing" | "stable";
    }[];
  };
  riskAnalysis: {
    level: "low" | "medium" | "high";
    factors: string[];
  };
  seasonalPatterns: {
    pattern: string;
    confidence: number;
    months: string[];
  }[];
  budgetOptimization: {
    suggestions: string[];
    potentialSavings: number;
  };
}

interface InsightCard {
  title: string;
  description: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  value?: string;
  metrics?: { label: string; value: string }[];
  size?: 'small' | 'medium' | 'large';
}

interface InsightSection {
  title: string;
  description: string;
  cardSize: 'small' | 'medium' | 'large';
  insights: InsightCard[];
}

function InsightCard({ insight, size = 'medium' }: { insight: InsightCard; size?: 'small' | 'medium' | 'large' }) {
  const TrendIcon = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: CheckCircle
  }[insight.impact];

  const sizeClasses = {
    small: "w-[280px] h-[200px]",
    medium: "w-[350px] h-[280px]",
    large: "w-[400px] h-[350px]"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={`${sizeClasses[size]} hover:shadow-lg transition-shadow duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] bg-[#2d2d30] rounded-lg overflow-hidden`}>
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
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

          <p className="text-sm text-muted-foreground mb-3">
            {insight.description}
          </p>

          {insight.value && (
            <div className="text-xl font-semibold mb-3"
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
            <div className="mt-auto space-y-2 overflow-y-auto flex-grow">
              {insight.metrics.map((metric, index) => (
                <div key={index} className="flex justify-between text-sm items-center py-1">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium text-white">{metric.value}</span>
                </div>
              ))}
            </div>
          )}
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
          {section.insights.map((insight, index) => (
            <div key={index} className="snap-start h-full">
              <InsightCard insight={insight} size={section.cardSize} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FinancialInsights() {
  const queryClient = useQueryClient();
  const { data: insights, isLoading } = useQuery<FinancialInsight>({
    queryKey: ["/api/insights"],
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <Skeleton className="h-48" />;
  }

  if (!insights) {
    return null;
  }

  const sections: InsightSection[] = [
    {
      title: "Current Status",
      description: "Overview and key metrics",
      cardSize: 'small',
      insights: [
        {
          title: "Financial Summary",
          description: insights.summary,
          category: "Overview",
          impact: "neutral"
        },
        {
          title: "Risk Level",
          description: insights.riskAnalysis.factors[0],
          category: "Risk",
          impact: insights.riskAnalysis.level === "low" ? "positive" : 
                 insights.riskAnalysis.level === "high" ? "negative" : "neutral",
          value: `${insights.riskAnalysis.level.toUpperCase()} RISK`,
          metrics: [
            { label: "Key Factor", value: insights.riskAnalysis.factors[1] || 'None' }
          ]
        },
        ...insights.trends.map(trend => ({
          title: "Trend Analysis",
          description: trend,
          category: "Trends",
          impact: trend.includes("increase") ? "positive" : 
                 trend.includes("decrease") ? "negative" : "neutral"
        }))
      ]
    },
    {
      title: "Forecasting",
      description: "Future predictions and patterns",
      cardSize: 'medium',
      insights: [
        {
          title: "Next Month's Forecast",
          description: `Predicted expenses with ${Math.round(insights.forecast.confidence * 100)}% confidence`,
          category: "Forecast",
          impact: "neutral",
          value: `$${insights.forecast.nextMonthExpense.toFixed(2)}`,
          metrics: insights.forecast.breakdown.map(item => ({
            label: item.category,
            value: `$${item.amount.toFixed(2)}`
          }))
        },
        ...insights.seasonalPatterns.map(pattern => ({
          title: "Seasonal Pattern",
          description: pattern.pattern,
          category: "Seasonal",
          impact: "neutral",
          metrics: [
            { label: "Confidence", value: `${Math.round(pattern.confidence * 100)}%` },
            { label: "Peak Months", value: pattern.months.join(", ") }
          ]
        }))
      ]
    },
    {
      title: "Optimization Opportunities",
      description: "Recommendations and potential savings",
      cardSize: 'large',
      insights: [
        {
          title: "Budget Optimization",
          description: "Identified opportunities for cost reduction",
          category: "Savings",
          impact: "positive",
          value: `$${insights.budgetOptimization.potentialSavings.toFixed(2)} potential savings`,
          metrics: insights.budgetOptimization.suggestions.map((suggestion, i) => ({
            label: `Suggestion ${i + 1}`,
            value: suggestion
          }))
        },
        ...insights.recommendations.map((rec, i) => ({
          title: `Strategic Recommendation ${i + 1}`,
          description: rec,
          category: "Action",
          impact: "positive"
        }))
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <InsightSection key={index} section={section} />
      ))}
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  LineChart,
  Calendar,
  Target,
  Lightbulb,
  DollarSign,
  ArrowUpRight,
  Coins,
  BarChart4,
  Brain
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
  metrics?: { label: string; value: string; icon?: React.ReactNode }[];
  icon?: React.ReactNode;
}

interface InsightSection {
  title: string;
  description: string;
  cardSize: 'small' | 'medium' | 'large';
  insights: InsightCard[];
}

const getActionIcon = (suggestion: string) => {
  const lowercased = suggestion.toLowerCase();
  if (lowercased.includes('venue') || lowercased.includes('hotel')) return '🏢';
  if (lowercased.includes('marketing')) return '📢';
  if (lowercased.includes('merchandise')) return '👕';
  if (lowercased.includes('equipment')) return '🎸';
  if (lowercased.includes('travel')) return '✈️';
  if (lowercased.includes('food')) return '🍽️';
  if (lowercased.includes('staff')) return '👥';
  return '💡';
};

function InsightCard({ insight, size = 'medium' }: { insight: InsightCard; size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: "w-[280px] min-h-[200px]",
    medium: "w-[320px] min-h-[300px]",
    large: "w-[350px] min-h-[400px]"
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
            {insight.icon}
          </div>

          <h3 className="font-semibold text-lg text-white mb-2 flex items-center gap-2">
            {insight.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            {insight.description}
          </p>

          {insight.value && (
            <div className="text-xl font-semibold mb-4 flex items-center gap-2"
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
            <div className="mt-auto space-y-3">
              {insight.metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {metric.icon}
                    <span>{metric.label}</span>
                  </div>
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
      title: "Overview",
      description: "Current financial status and trends",
      cardSize: 'medium',
      insights: [
        {
          title: "Financial Summary",
          description: insights.summary,
          category: "Overview",
          impact: "neutral",
          icon: <Brain className="h-5 w-5 text-blue-500" />
        },
        {
          title: "Risk Assessment",
          description: insights.riskAnalysis.factors[0],
          category: "Risk",
          impact: insights.riskAnalysis.level === "low" ? "positive" : 
                 insights.riskAnalysis.level === "high" ? "negative" : "neutral",
          value: `${insights.riskAnalysis.level.toUpperCase()} RISK`,
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          metrics: insights.riskAnalysis.factors.slice(1).map(factor => ({
            label: factor,
            icon: <Target className="h-4 w-4 text-muted-foreground" />,
            value: ""
          }))
        },
        {
          title: "Trend Analysis",
          description: "Key financial trends and patterns",
          category: "Trends",
          impact: "neutral",
          icon: <LineChart className="h-5 w-5 text-blue-500" />,
          metrics: insights.trends.map(trend => ({
            label: trend,
            icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
            value: ""
          }))
        }
      ]
    },
    {
      title: "Forecasting",
      description: "Future predictions and patterns",
      cardSize: 'large',
      insights: [
        {
          title: "Next Month's Forecast",
          description: `Predicted expenses with ${Math.round(insights.forecast.confidence * 100)}% confidence`,
          category: "Forecast",
          impact: "neutral",
          value: `$${insights.forecast.nextMonthExpense.toFixed(2)}`,
          icon: <BarChart4 className="h-5 w-5 text-blue-500" />,
          metrics: insights.forecast.breakdown.map(item => ({
            label: item.category,
            icon: <Coins className="h-4 w-4 text-muted-foreground" />,
            value: `$${item.amount.toFixed(2)}`
          }))
        },
        ...insights.seasonalPatterns.map(pattern => ({
          title: "Seasonal Pattern",
          description: pattern.pattern,
          category: "Seasonal",
          impact: "neutral",
          icon: <Calendar className="h-5 w-5 text-blue-500" />,
          metrics: [
            { 
              label: "Confidence",
              icon: <Target className="h-4 w-4 text-muted-foreground" />,
              value: `${Math.round(pattern.confidence * 100)}%`
            },
            {
              label: "Peak Months",
              icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
              value: pattern.months.join(", ")
            }
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
          icon: <DollarSign className="h-5 w-5 text-green-500" />,
          metrics: insights.budgetOptimization.suggestions.map(suggestion => ({
            label: suggestion,
            icon: <span className="text-lg">{getActionIcon(suggestion)}</span>,
            value: ""
          }))
        },
        {
          title: "Strategic Recommendations",
          description: "AI-powered suggestions for improvement",
          category: "Action",
          impact: "positive",
          icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
          metrics: insights.recommendations.map(rec => ({
            label: rec,
            icon: <span className="text-lg">{getActionIcon(rec)}</span>,
            value: ""
          }))
        }
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { TrendingUp, AlertCircle, CheckCircle, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

export function FinancialInsights() {
  const queryClient = useQueryClient();
  const { data: insights, isLoading, error } = useQuery<FinancialInsight>({
    queryKey: ["/api/insights"],
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });

  // Refetch insights when expenses change
  useEffect(() => {
    // Instead of subscribing to all cache changes, we'll only watch expenses
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query.queryKey[0] === '/api/expenses' && event.type === 'updated') {
        // Only invalidate insights if expenses were actually updated
        queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) {
    return <Skeleton className="h-48" />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load insights</p>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No insights available yet. Add some expenses to get started!</p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-primary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Advanced Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-muted-foreground">{insights.summary}</p>
        </div>

        <div>
          <h3 className="font-medium mb-4">Expense Forecast</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.forecast.breakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>Next Month's Predicted Spending: ${insights.forecast.nextMonthExpense.toFixed(2)}</span>
            <span>Confidence: {Math.round(insights.forecast.confidence * 100)}%</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Risk Analysis</h3>
          <div className={`flex items-center gap-2 mb-2 ${getRiskColor(insights.riskAnalysis.level)}`}>
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium capitalize">
              {insights.riskAnalysis.level} Risk Level
            </span>
          </div>
          <ul className="space-y-2">
            {insights.riskAnalysis.factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Seasonal Patterns</h3>
          {insights.seasonalPatterns.map((pattern, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{pattern.pattern}</span>
                <span className="text-sm text-muted-foreground">
                  ({Math.round(pattern.confidence * 100)}% confidence)
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Affected months: {pattern.months.join(", ")}
              </p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-medium mb-2">Budget Optimization</h3>
          <div className="flex items-center gap-2 mb-2 text-green-500">
            <DollarSign className="h-4 w-4" />
            <span>Potential Savings: ${insights.budgetOptimization.potentialSavings.toFixed(2)}</span>
          </div>
          <ul className="space-y-2">
            {insights.budgetOptimization.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {insights.trends.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Spending Trends</h3>
            <ul className="space-y-2">
              {insights.trends.map((trend, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
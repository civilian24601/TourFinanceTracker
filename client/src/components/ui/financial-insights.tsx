import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface FinancialInsight {
  summary: string;
  trends: string[];
  recommendations: string[];
  forecast: {
    nextMonthExpense: number;
    confidence: number;
  };
}

export function FinancialInsights() {
  const { data: insights, isLoading } = useQuery<FinancialInsight>({
    queryKey: ["/api/insights"],
  });

  if (isLoading) {
    return <Skeleton className="h-48" />;
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No insights available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-muted-foreground">{insights.summary}</p>
        </div>

        {insights.trends.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Spending Trends</h3>
            <ul className="space-y-2">
              {insights.trends.map((trend, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {insights.recommendations.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {insights.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Next Month Forecast</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              ${Number(insights.forecast.nextMonthExpense).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(insights.forecast.confidence * 100)}% confidence
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
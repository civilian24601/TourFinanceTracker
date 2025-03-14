import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./alert";
import { Skeleton } from "./skeleton";
import type { Expense } from "@shared/schema";

interface ExpenseTrend {
  category: string;
  amount: number;
  percentage: number;
}

function calculateTrends(expenses: Expense[]): ExpenseTrend[] {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const amount = Number(expense.amount);
    acc[expense.category] = (acc[expense.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: Number(amount.toFixed(2)),
    percentage: Number(((amount / total) * 100).toFixed(1))
  })).sort((a, b) => b.amount - a.amount);
}

export function ExpenseTrends({ tourId }: { tourId?: number }) {
  const { data: expenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses", { tourId }],
    enabled: !!tourId,
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<{ trends: string[] }>({
    queryKey: ["/api/insights", { tourId }],
    enabled: !!tourId,
  });

  const isLoading = expensesLoading || insightsLoading;

  if (isLoading) {
    return <Skeleton className="h-[400px]" />;
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No expenses recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  const trends = calculateTrends(expenses);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="category" 
                className="text-xs"
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {insights?.trends && insights.trends.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">AI-Powered Insights</h3>
            {insights.trends.map((trend, index) => (
              <Alert key={index}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{trend}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {trends.map(trend => (
            <div key={trend.category} className="flex justify-between items-center p-2 rounded-lg bg-muted">
              <span>{trend.category}</span>
              <div className="space-x-2 text-sm">
                <span className="text-muted-foreground">{trend.percentage}%</span>
                <span className="font-medium">${trend.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "./alert";
import { Skeleton } from "./skeleton";
import { motion, AnimatePresence } from "framer-motion";
import type { Expense } from "@shared/schema";
import { useState } from "react";

interface ExpenseTrend {
  category: string;
  amount: number;
  percentage: number;
  trend: "increasing" | "decreasing" | "stable";
}

const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  increasing: "hsl(143, 71%, 48%)",
  decreasing: "hsl(346, 87%, 57%)",
  stable: "hsl(217, 91%, 60%)"
};

function calculateTrends(expenses: Expense[]): ExpenseTrend[] {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const amount = Number(expense.amount);
    acc[expense.category] = (acc[expense.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  // Calculate month-over-month trends
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);

  const currentMonthExpenses = expenses.filter(e => new Date(e.createdAt) >= lastMonth);
  const previousMonthExpenses = expenses.filter(e => {
    const date = new Date(e.createdAt);
    return date >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1) && date < lastMonth;
  });

  const getTrend = (category: string): "increasing" | "decreasing" | "stable" => {
    const currentAmount = currentMonthExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const previousAmount = previousMonthExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    if (currentAmount > previousAmount * 1.1) return "increasing";
    if (currentAmount < previousAmount * 0.9) return "decreasing";
    return "stable";
  };

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: Number(amount.toFixed(2)),
      percentage: Number(((amount / total) * 100).toFixed(1)),
      trend: getTrend(category)
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function ExpenseTrends({ tourId }: { tourId?: number }) {
  const [view, setView] = useState<"amount" | "percentage">("amount");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expense Trends</CardTitle>
        <Tabs defaultValue="amount" value={view} onValueChange={(v) => setView(v as "amount" | "percentage")}>
          <TabsList>
            <TabsTrigger value="amount">Amount</TabsTrigger>
            <TabsTrigger value="percentage">Percentage</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={trends}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="category" 
                className="text-xs"
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                className="text-xs"
                tickFormatter={value => 
                  view === "percentage" 
                    ? `${value}%` 
                    : `$${value}`
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload as ExpenseTrend;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background border rounded-lg p-3 shadow-lg"
                    >
                      <p className="font-medium">{data.category}</p>
                      <p className="text-sm text-muted-foreground">
                        Amount: ${data.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.percentage}% of total
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {data.trend === "increasing" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {data.trend === "decreasing" && <TrendingDown className="w-4 h-4 text-red-500" />}
                        <span className="text-sm capitalize">{data.trend}</span>
                      </div>
                    </motion.div>
                  );
                }}
              />
              <Bar 
                dataKey={view === "percentage" ? "percentage" : "amount"}
                radius={[4, 4, 0, 0]}
              >
                {trends.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[entry.trend]}
                    opacity={hoveredCategory === null || hoveredCategory === entry.category ? 1 : 0.3}
                    onMouseEnter={() => setHoveredCategory(entry.category)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <AnimatePresence mode="wait">
          {insights?.trends && insights.trends.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <h3 className="font-medium">AI-Powered Insights</h3>
              {insights.trends.map((trend, index) => (
                <Alert key={index}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{trend}</AlertDescription>
                </Alert>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          layout
          className="grid gap-4 md:grid-cols-2"
        >
          {trends.map(trend => (
            <motion.div
              key={trend.category}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="flex justify-between items-center p-2 rounded-lg bg-muted"
            >
              <span>{trend.category}</span>
              <div className="space-x-2 text-sm">
                <span className="text-muted-foreground">{trend.percentage}%</span>
                <span className="font-medium">${trend.amount}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
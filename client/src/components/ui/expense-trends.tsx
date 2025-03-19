import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
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
import { TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
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
  increasing: "hsl(143, 71%, 48%)",
  decreasing: "hsl(346, 87%, 57%)",
  stable: "hsl(217, 91%, 60%)"
};

function calculateTrends(expenses: Expense[]): ExpenseTrend[] {
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    const amount = Number(expense.amount);
    acc[month] = (acc[month] || 0) + amount;
    return acc;
  }, {} as Record<number, number>);

  const categoryTotals = expenses.reduce((acc, expense) => {
    const amount = Number(expense.amount);
    acc[expense.category] = (acc[expense.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  // Calculate category trends
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const getTrend = (category: string): "increasing" | "decreasing" | "stable" => {
    const currentAmount = monthlyTotals[currentMonth] || 0;
    const previousAmount = monthlyTotals[previousMonth] || 0;

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

function TrendIcon({ trend }: { trend: "increasing" | "decreasing" | "stable" }) {
  switch (trend) {
    case "increasing":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "decreasing":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
  }
}

export function ExpenseTrends() {
  const [view, setView] = useState<"amount" | "percentage">("amount");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

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
        {/* Chart */}
        <div className="h-[250px] -mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={trends}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              onClick={(data) => {
                if (data && data.activePayload) {
                  setSelectedCategory(data.activePayload[0].payload.category);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
              <XAxis 
                dataKey="category" 
                className="text-xs"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tickFormatter={value => 
                  view === "percentage" 
                    ? `${value}%` 
                    : `$${value}`
                }
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload as ExpenseTrend;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#2d2d30] border border-border rounded-lg p-3 shadow-lg"
                    >
                      <p className="font-medium text-white">{data.category}</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Amount: ${data.amount}</p>
                        <p>{data.percentage}% of total</p>
                        <div className="flex items-center gap-2 mt-1">
                          <TrendIcon trend={data.trend} />
                          <span className="capitalize">{data.trend}</span>
                        </div>
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
                    opacity={selectedCategory === null || selectedCategory === entry.category ? 1 : 0.4}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <motion.div 
          layout
          className="space-y-2"
        >
          {trends.map(trend => (
            <motion.div
              key={trend.category}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                p-3 rounded-lg transition-colors duration-200
                ${selectedCategory === trend.category ? 'bg-[#2d2d30] shadow-lg' : 'bg-muted'}
              `}
              onClick={() => setSelectedCategory(
                selectedCategory === trend.category ? null : trend.category
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendIcon trend={trend.trend} />
                  <span className="font-medium">{trend.category}</span>
                </div>
                <div className="text-sm space-x-3">
                  <span className="text-muted-foreground">{trend.percentage}%</span>
                  <span className="font-medium">${trend.amount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Skeleton } from "./skeleton";
import type { Tour } from "@shared/schema";

interface BudgetHealth {
  percentage: number;
  status: "healthy" | "warning" | "critical";
  predictedOverspend: number;
  alerts: string[];
}

function calculateBudgetHealth(tour: Tour, expenses: any[]): BudgetHealth {
  const totalBudget = Number(tour.budget);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const percentage = (totalExpenses / totalBudget) * 100;

  return {
    percentage: Math.min(percentage, 100),
    status: percentage > 90 ? "critical" : percentage > 75 ? "warning" : "healthy",
    predictedOverspend: Math.max(0, totalExpenses - totalBudget),
    alerts: generateAlerts(percentage, totalBudget, totalExpenses)
  };
}

function generateAlerts(percentage: number, budget: number, expenses: number): string[] {
  const alerts = [];
  if (percentage > 90) {
    alerts.push(`Critical: You've used ${percentage.toFixed(1)}% of your budget`);
  } else if (percentage > 75) {
    alerts.push(`Warning: You're approaching your budget limit (${percentage.toFixed(1)}%)`);
  }
  if (expenses > budget) {
    alerts.push(`Over budget by $${(expenses - budget).toFixed(2)}`);
  }
  return alerts;
}

export function BudgetHealthMeter({ tourId }: { tourId?: number }) {
  const { data: tour, isLoading: tourLoading } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
    enabled: !!tourId,
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["/api/expenses", { tourId }],
    enabled: !!tourId,
  });

  const isLoading = tourLoading || expensesLoading;

  if (isLoading) {
    return <Skeleton className="h-[200px]" />;
  }

  if (!tour || !expenses) {
    return null;
  }

  const health = calculateBudgetHealth(tour, expenses);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {health.status === "healthy" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {health.status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
          {health.status === "critical" && <AlertCircle className="h-5 w-5 text-red-500" />}
          Budget Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget Used</span>
            <span className="font-medium">{health.percentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={health.percentage} 
            className={
              health.status === "critical" ? "bg-red-200" :
              health.status === "warning" ? "bg-yellow-200" :
              "bg-green-200"
            }
            indicatorClassName={
              health.status === "critical" ? "bg-red-500" :
              health.status === "warning" ? "bg-yellow-500" :
              "bg-green-500"
            }
          />
        </div>

        {health.alerts.map((alert, index) => (
          <Alert 
            key={index}
            variant={
              health.status === "critical" ? "destructive" :
              health.status === "warning" ? "default" :
              "default"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Budget Alert</AlertTitle>
            <AlertDescription>{alert}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}

import { useQuery } from "@tanstack/react-query";
import type { Tour, Expense } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";

export function BudgetOverview() {
  const { data: tours, isLoading: toursLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  if (toursLoading || expensesLoading) {
    return <Skeleton className="h-48" />;
  }

  const activeTour = tours?.[0];
  if (!activeTour) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active tours</p>
        </CardContent>
      </Card>
    );
  }

  const tourExpenses = expenses?.filter((e) => e.tourId === activeTour.id) ?? [];
  const totalSpent = tourExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const budget = Number(activeTour.budget);
  const progress = Math.min((totalSpent / budget) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activeTour.name} Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${totalSpent.toFixed(2)} spent
            </span>
            <span className="text-muted-foreground">
              ${budget.toFixed(2)} budget
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

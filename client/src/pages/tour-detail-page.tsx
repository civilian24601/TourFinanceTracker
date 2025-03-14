import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/ui/navigation";
import { BudgetHealthMeter } from "@/components/ui/budget-health-meter";
import { ExpenseTrends } from "@/components/ui/expense-trends";
import { ExpenseList } from "@/components/ui/expense-list";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tour } from "@shared/schema";
import { format } from "date-fns";

export default function TourDetailPage() {
  const [, params] = useRoute("/tours/:id");
  const tourId = params?.id ? parseInt(params.id, 10) : undefined;

  const { data: tour, isLoading } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
    enabled: !!tourId,
  });

  if (isLoading) {
    return <Skeleton className="h-screen" />;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{tour.name}</h1>
          <p className="text-muted-foreground">
            {format(new Date(tour.startDate), "MMM d, yyyy")} -{" "}
            {format(new Date(tour.endDate), "MMM d, yyyy")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <BudgetHealthMeter tourId={tourId} />
          <ExpenseTrends tourId={tourId} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tour Expenses</h2>
          <ExpenseList tourId={tourId} />
        </div>
      </main>
      <Navigation />
    </div>
  );
}

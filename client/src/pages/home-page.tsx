import { Navigation } from "@/components/ui/navigation";
import { BudgetOverview } from "@/components/ui/budget-overview";
import { ExpenseList } from "@/components/ui/expense-list";
import { FinancialInsights } from "@/components/ui/financial-insights";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto py-6 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetOverview />
          <FinancialInsights />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Expenses</h2>
          <ExpenseList />
        </div>
      </main>
      <Navigation />
    </div>
  );
}
import { Navigation } from "@/components/ui/navigation";
import { ExpenseForm } from "@/components/ui/expense-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpensePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

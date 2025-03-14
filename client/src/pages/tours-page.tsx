import { Navigation } from "@/components/ui/navigation";
import { TourList } from "@/components/ui/tour-list";
import { TourCalendar } from "@/components/ui/tour-calendar";
import { TourForm } from "@/components/ui/tour-form";
import { BudgetHealthMeter } from "@/components/ui/budget-health-meter";
import { ExpenseTrends } from "@/components/ui/expense-trends";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRoute } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ToursPage() {
  const [open, setOpen] = useState(false);
  const [, params] = useRoute("/tours/:id");
  const tourId = params?.id ? parseInt(params.id, 10) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tours</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Tour
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tour</DialogTitle>
              </DialogHeader>
              <TourForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TourCalendar />
          {tourId && <BudgetHealthMeter tourId={tourId} />}
        </div>

        {tourId && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Expense Analysis</h2>
            <ExpenseTrends tourId={tourId} />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Tours</h2>
          <TourList />
        </div>
      </main>
      <Navigation />
    </div>
  );
}
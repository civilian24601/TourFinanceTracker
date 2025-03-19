import { Header } from "@/components/ui/header";
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
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-[#262629]">
      <Header />
      <motion.main
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="container mx-auto py-6 px-4 space-y-6 pb-32"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#FF6200]">Tours</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
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
            <h2 className="text-xl font-semibold text-white">Expense Analysis</h2>
            <ExpenseTrends tourId={tourId} />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">All Tours</h2>
          <TourList />
        </div>
      </motion.main>
      <Navigation />
    </div>
  );
}
import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { BudgetOverview } from "@/components/ui/budget-overview";
import { ExpenseList } from "@/components/ui/expense-list";
import { FinancialInsights } from "@/components/ui/financial-insights";
import { motion } from "framer-motion";

export default function HomePage() {
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
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetOverview />
          <FinancialInsights />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Expenses</h2>
          <ExpenseList />
        </div>
      </motion.main>
      <Navigation />
    </div>
  );
}
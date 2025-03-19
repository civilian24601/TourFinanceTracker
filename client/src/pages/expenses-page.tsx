import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";

export default function ExpensesPage() {
  return (
    <div className="min-h-screen bg-[#262629]">
      <Header />
      <main className="container mx-auto py-6 px-4 space-y-6 pb-32">
        <h1 className="text-3xl font-bold text-[#FF6200]">Expenses</h1>
        <p className="text-white">Track and manage your tour expenses here.</p>
      </main>
      <Navigation />
    </div>
  );
}

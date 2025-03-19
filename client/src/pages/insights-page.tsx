import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#262629]">
      <Header />
      <main className="container mx-auto py-6 px-4 space-y-6 pb-32">
        <h1 className="text-3xl font-bold text-[#FF6200]">Insights</h1>
        <p className="text-white">Get detailed insights about your tour finances.</p>
      </main>
      <Navigation />
    </div>
  );
}

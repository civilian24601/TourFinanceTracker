import { Link, useLocation } from "wouter";
import {
  Home,
  MapPin,
  DollarSign,
  Lightbulb,
  Book,
  Plus,
} from "lucide-react";
import { Button } from "./button";

export function Navigation() {
  const [location] = useLocation();

  return (
    <>
      {/* Floating Action Button for Add Expense */}
      <Link href="/expense">
        <a className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50">
          <Button size="sm" className="h-10 w-10 rounded-full shadow-lg">
            <Plus className="h-4 w-4" />
          </Button>
        </a>
      </Link>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#262629]/95 backdrop-blur supports-[backdrop-filter]:bg-[#262629]/60 border-t z-40">
        <div className="grid grid-cols-5 h-16 items-center px-4">
          <Link href="/">
            <a className={`flex flex-col items-center space-y-1 ${location === '/' ? 'text-[#FF6200]' : 'text-[#808080]'}`}>
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </a>
          </Link>
          <Link href="/tours">
            <a className={`flex flex-col items-center space-y-1 ${location === '/tours' ? 'text-[#FF6200]' : 'text-[#808080]'}`}>
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Tours</span>
            </a>
          </Link>
          <Link href="/expenses">
            <a className={`flex flex-col items-center space-y-1 ${location === '/expenses' ? 'text-[#FF6200]' : 'text-[#808080]'}`}>
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">Expenses</span>
            </a>
          </Link>
          <Link href="/insights">
            <a className={`flex flex-col items-center space-y-1 ${location === '/insights' ? 'text-[#FF6200]' : 'text-[#808080]'}`}>
              <Lightbulb className="h-5 w-5" />
              <span className="text-xs">Insights</span>
            </a>
          </Link>
          <Link href="/learn">
            <a className={`flex flex-col items-center space-y-1 ${location === '/learn' ? 'text-[#FF6200]' : 'text-[#808080]'}`}>
              <Book className="h-5 w-5" />
              <span className="text-xs">Learn</span>
            </a>
          </Link>
        </div>
      </nav>
    </>
  );
}
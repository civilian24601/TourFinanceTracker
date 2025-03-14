import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./button";
import {
  BarChart3,
  Home,
  LogOut,
  Plus,
  MapPin,
} from "lucide-react";

export function Navigation() {
  const { logoutMutation } = useAuth();
  const [location] = useLocation();

  return (
    <>
      {/* Floating Action Button for Add Expense */}
      <Link href="/expense">
        <a className="fixed bottom-20 right-4 z-50">
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </a>
      </Link>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-40">
        <div className="flex h-16 items-center justify-around px-4">
          <Link href="/">
            <a className={`flex flex-col items-center space-y-1 ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Home className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </a>
          </Link>
          <Link href="/tours">
            <a className={`flex flex-col items-center space-y-1 ${location === '/tours' ? 'text-primary' : 'text-muted-foreground'}`}>
              <MapPin className="h-6 w-6" />
              <span className="text-xs">Tours</span>
            </a>
          </Link>
          <div className="w-16" /> {/* Spacer for FAB */}
          <Link href="/reports">
            <a className={`flex flex-col items-center space-y-1 ${location === '/reports' ? 'text-primary' : 'text-muted-foreground'}`}>
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs">Reports</span>
            </a>
          </Link>
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex flex-col items-center space-y-1 text-muted-foreground"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
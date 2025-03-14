import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./button";
import {
  BarChart3,
  Home,
  LogOut,
  PlusCircle,
  MapPin,
} from "lucide-react";

export function Navigation() {
  const { logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="font-semibold">Tour Tracker</a>
          </Link>
          <Link href="/">
            <a className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/tours">
            <a className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Tours</span>
            </a>
          </Link>
          <Link href="/expense">
            <a className="flex items-center space-x-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Expense</span>
            </a>
          </Link>
          <Link href="/reports">
            <a className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </a>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}